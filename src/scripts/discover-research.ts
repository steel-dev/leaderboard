// ABOUTME: Atlas deep-research discovery pass. Extends the free arxiv baseline with cited,
// ABOUTME: structured multi-source research (Exa search + Steel browser fetch). Writes
// ABOUTME: .discovery/atlas-* artifacts that the deductive judge (discover-judge.ts) consumes.
// ABOUTME: Never touches src/data/ — a human merges, always.

import fs from "fs";
import path from "path";
import { getAllBenchmarkPages, type BenchmarkPageData } from "../lib/benchmark-hub.js";
import { Atlas, exa, steel, basic, fileStore, type Effort } from "@steel-dev/atlas";
import { z } from "zod";
import { resolveDiscoveryModel } from "../lib/zai-model.js";
import { dataKeyForSlug } from "../lib/discovery-map.js";

const OUT_DIR = path.join(process.cwd(), ".discovery");
const RUN_JSON = path.join(OUT_DIR, "run.json");
// Lookback in days for Atlas research. CI overrides via --since-days; 21 matches the biweekly sweep
// and covers the worst-case 21-day ISO-week-boundary dispatch gap (a 14-day default would leave a hole).
const DEFAULT_SINCE_DAYS = 21;
const DEFAULT_EFFORT: Effort = "fast";
const EFFORTS: readonly Effort[] = ["fast", "balanced", "deep", "max"];
// z.ai/glm-5.2 intermittently returns an empty response ("No object generated") on
// atlas.research's final structured extraction — same flake the judge hits. Retry the whole
// research call; failed attempts bill ~$0 (they die before the extraction completes).
const MAX_RESEARCH_ATTEMPTS = 3;

// Structured shape Atlas extracts from its own cited report. The downstream judgment pass
// (discover-judge.ts) re-checks every field against CONTRIBUTING.md before anything reaches a
// human, so this schema optimizes for coverage + faithful citation, not for final admissibility.
const candidateSchema = z.object({
  candidates: z.array(
    z.object({
      systemName: z.string().describe("Canonical system / model / agent name as published."),
      organization: z
        .string()
        .describe("Reporting org, e.g. Anthropic, OpenAI, or 'Academic Research'."),
      scoreDisplay: z.string().describe("Score exactly as published, e.g. '51.2%' or '0.412'."),
      scoreValue: z
        .number()
        .optional()
        .describe(
          "Numeric score. Omit the field entirely when the exact number is unknown — the downstream judge drops any candidate whose quotedEvidence lacks a verbatim number, so omission is always safer than a guess."
        ),
      sourceUrl: z
        .string()
        .describe(
          "Primary source URL that CONTAINS the score; never a homepage or search snippet."
        ),
      reportedAt: z.string().optional().describe("YYYY-MM-DD or YYYY-MM from the source."),
      setup: z
        .string()
        .describe("One-line eval setup: tools / attempts / judge / subset, or empty if standard."),
      isSelfReported: z
        .boolean()
        .describe("True when the reporting org is also the vendor of the system."),
      isVariant: z
        .boolean()
        .describe("True if the score is on a VARIANT, not the original benchmark."),
      variantName: z.string().optional().describe("Variant name when isVariant is true."),
      quotedEvidence: z
        .string()
        .describe("Verbatim sentence from the fetched source containing the exact number."),
      sourceTier: z.enum([
        "official-leaderboard",
        "paper",
        "model-card",
        "repo",
        "third-party-eval",
      ]),
    })
  ),
  coverageNote: z
    .string()
    .describe("What was searched, what could not be fetched, and any coverage gaps."),
});

type Candidate = z.infer<typeof candidateSchema>["candidates"][number];

// Atlas result shapes we read defensively (its types are not exported as cleanly as these fields).
interface AtlasSource {
  url: string;
  title?: string;
  via?: string;
}
interface AtlasStats {
  costUSD?: number;
  stopReason?: string;
  budgetExhausted?: boolean;
  tokensExhausted?: boolean;
}

interface RunBenchmark {
  slug: string;
  benchmarkName?: string;
  sinceIso?: string;
  existingTopSystems?: string[];
  candidates?: { arxivId?: string; url?: string; title?: string; publishedAt?: string }[];
}

function parseArgs(): {
  slugs: Set<string> | null;
  sinceDays: number;
  effort: Effort;
  model: string | undefined;
} {
  const args = process.argv.slice(2);
  let slugs: Set<string> | null = null;
  let sinceDays = DEFAULT_SINCE_DAYS;
  let effort: Effort = DEFAULT_EFFORT;
  let model: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--slug" && args[i + 1]) slugs = new Set(args[++i].split(","));
    else if (a === "--since-days" && args[i + 1]) sinceDays = Number(args[++i]);
    else if (a === "--effort" && args[i + 1]) {
      const v = args[++i];
      if (!EFFORTS.includes(v as Effort)) {
        console.error(`Invalid --effort "${v}". Must be one of: ${EFFORTS.join(", ")}.`);
        process.exit(1);
      }
      effort = v as Effort;
    } else if (a === "--model" && args[i + 1]) model = args[++i];
  }
  return { slugs, sinceDays, effort, model };
}

function readRunJson(): Record<string, RunBenchmark> {
  try {
    const raw = fs.readFileSync(RUN_JSON, "utf8");
    const parsed = JSON.parse(raw) as { benchmarks?: RunBenchmark[] };
    const map: Record<string, RunBenchmark> = {};
    for (const b of parsed.benchmarks ?? []) if (b.slug) map[b.slug] = b;
    return map;
  } catch {
    return {}; // Running standalone without the arxiv baseline is fine.
  }
}

// Full current entry list so Atlas hunts DELTAS — a new score on a known system, or a brand-new
// system — rather than re-discovering rows we already publish.
function knownScores(page: BenchmarkPageData): string {
  if (page.results.length === 0) return "(empty leaderboard)";
  return page.results.map((r) => `${r.systemName} [${r.scoreDisplay}]`).join(", ");
}

function arxivLeads(run: RunBenchmark | undefined): string {
  const leads = (run?.candidates ?? []).slice(0, 6).map((c) => {
    const date = (c.publishedAt ?? "").slice(0, 10);
    const id = c.arxivId ?? "?";
    const title = (c.title ?? "").replace(/\s+/g, " ").slice(0, 120);
    return `- ${title} (arxiv:${id}${date ? ", " + date : ""})`;
  });
  return leads.length ? leads.join("\n") : "(none)";
}

function buildPrompt(
  page: BenchmarkPageData,
  run: RunBenchmark | undefined,
  sinceDate: string
): string {
  const { slug, name } = page.meta;
  const metric = page.meta.methodology[0] ? `Metric context: ${page.meta.methodology[0]}` : "";
  return `Benchmark: ${name} (slug: ${slug}). Find ALL newly published ABSOLUTE scores on the ORIGINAL ${name} benchmark reported since ${sinceDate} (lookback window below). ${metric}

Search broadly and FETCH each source (a search snippet is NOT a score):
1. Official ${name} leaderboard / index pages maintained by the benchmark authors.
2. HuggingFace model cards for systems that report ${name} results.
3. Vendor and research blogs (openai.com, anthropic.com, deepmind.google, ai.google.dev, z.ai/blog, platform.openai.com, deepseek.com, qwenlm.github.io, kimi.com/blog, minimax.io, x.com links -> resolve to the primary paper/card/blog they point to).
4. System-card and evaluation PDFs.
5. arXiv FULL TEXT — recover truncated numbers like "achieves 41..." from the HTML/PDF.

For EACH score, return: canonical system/agent name, reporting organization, the absolute score (scoreDisplay + numeric scoreValue), the primary source URL that CONTAINS the score (never a homepage), publication date, a one-line setup note (tools/attempts/judge/subset if non-standard), isSelfReported (vendor == reporting org), isVariant + variantName, a VERBATIM sentence from the fetched source containing the exact number (quotedEvidence), and sourceTier.

HARD RULES:
- Only ABSOLUTE, COMPLETE, citable numbers. Never a delta ("+8 points"), never "SOTA" without a number, never a truncated/chart-inferred/guessed/rounded number. If the exact number cannot be read from a fetched source, OMIT it.
- Only the ORIGINAL benchmark. Variant scores (e.g. BrowseComp-Plus / V3, SWE-bench Multilingual / Pro, RepoMirage, Online-Mind2Web-as-variant) must set isVariant=true and variantName, and are tracked separately — not as original rows.
- Every scoreValue MUST be backed by quotedEvidence found verbatim at sourceUrl in a fetched source. No source, no candidate.
- Name collisions are off-topic (e.g. ESA Gaia stellar spectroscopy is NOT the GAIA agent benchmark) — omit them.

EXISTING rows already tracked on the ${name} leaderboard (do NOT re-report a system here unless a NEW, DIFFERENT score for it appeared this window):
${knownScores(page)}

arXiv leads from this run deterministic sweep (verify each, complete any truncated numbers from full text, confirm it is the ORIGINAL benchmark, or drop):
${arxivLeads(run)}

Return candidates even when low-confidence (set isVariant / describe gaps in coverageNote) — breadth matters; a downstream judge decides what surfaces to humans. Cite every number.`;
}

function writeLine(file: string, line: string): void {
  fs.appendFileSync(file, line + "\n", "utf8");
}

// Surface the real cause of an AI-SDK / Atlas failure. Atlas surfaces HTTP errors as
// APICallError{ message: "Invalid JSON response", cause, statusCode, responseBody } — the
// provider throws that generic string whenever a response body fails schema validation (e.g. an
// API 4xx *error* body arriving where a normal result was expected). The actionable detail lives
// in `responseBody`/`statusCode`/`cause`, so we flatten them into one line instead of leaving the
// cryptic "Invalid JSON response" that previously hid e.g. a throttled account.
function describeError(e: unknown): string {
  const err = e as {
    message?: string;
    name?: string;
    statusCode?: number;
    status?: number;
    url?: string;
    responseBody?: unknown;
    cause?: { message?: string } | undefined;
  };
  const message = err?.message ?? String(e);
  const parts: string[] = [message];
  if (err?.name && err.name !== "Error") parts.push(`name=${err.name}`);
  const code = err?.statusCode ?? err?.status;
  if (code != null) parts.push(`http=${code}`);
  if (err?.url) parts.push(`url=${String(err.url).slice(0, 120)}`);
  if (err?.responseBody != null) {
    const body = (
      typeof err.responseBody === "string" ? err.responseBody : JSON.stringify(err.responseBody)
    ).replace(/\s+/g, " ");
    parts.push(`body=${body.slice(0, 600)}`);
  }
  const cause = err?.cause?.message;
  if (cause) parts.push(`cause=${cause}`);
  return parts.join(" | ");
}

async function main(): Promise<void> {
  if (!process.env.EXA_API_KEY) {
    console.error("EXA_API_KEY is missing. Exa powers the search provider.");
    process.exit(1);
  }
  // STEEL is OPTIONAL. basic.fetch already handles static pages; steel.fetch adds JS rendering for
  // some HF cards / vendor dashboards. We gate it below at construction time because steel.fetch()
  // throws synchronously when the key is absent (providers/fetch.js: steel() requires an apiKey).
  if (!process.env.ATLAS_STEEL_API_KEY && !process.env.STEEL_API_KEY) {
    console.warn(
      "WARN: STEEL_API_KEY (or ATLAS_STEEL_API_KEY) is unset — steel.fetch is disabled, so JS-rendered pages (some HF cards, vendor dashboards) may not be fetched. basic.fetch handles static pages."
    );
  }

  const { slugs, sinceDays, effort, model } = parseArgs();
  // Model credentials (z.ai vs Anthropic) resolve in one shared place; fail fast before any LLM cost.
  const resolved = resolveDiscoveryModel(model);
  console.log(
    `Model: ${resolved.modelId}${resolved.viaZai ? ` via z.ai (${resolved.endpoint})` : " via Anthropic"}`
  );
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const runBySlug = readRunJson();
  const pages = getAllBenchmarkPages().filter((p) => !slugs || slugs.has(p.meta.slug));
  if (pages.length === 0) {
    console.error("No benchmarks selected. Check --slug values against getAllBenchmarkPages().");
    process.exit(1);
  }

  const sinceDate = new Date(Date.now() - sinceDays * 86_400_000).toISOString().slice(0, 10);
  const sweepWeek = process.env.DISCOVERY_SWEEP_WEEK ?? sinceDate;

  // Gate steel.fetch() on its key: the steel() factory throws at construction when unset, and STEEL
  // is an optional provider. Mirrors Atlas's own defaultFetchProviders() gating in providers/fetch.js.
  const fetchers = [basic.fetch()];
  if (process.env.ATLAS_STEEL_API_KEY || process.env.STEEL_API_KEY) {
    fetchers.push(steel.fetch({ proxy: true }));
  }

  const atlas = new Atlas({
    model: resolved.model,
    search: exa.search(),
    fetch: fetchers,
    store: fileStore(path.join(OUT_DIR, "atlas-runs")),
    safety: { allowPrivateNetworks: false }, // SSRF guard on the research fetch (Atlas built-in)
  });

  // Per-benchmark budget. We do NOT set maxDurationMs ourselves — a flat cap would override each
  // effort's tuned duration envelope (fast=10 / balanced / deep=40 / max=60 min, from config.js
  // EFFORT_ENVELOPES) and silently truncate deep/max. We only override maxUSD for `fast`: its $0.50
  // envelope default sits below the ~$0.55 minimum-viable floor for a "broad" cited-research question
  // on claude-sonnet-4-5 (resolveBudgetPlan in budget.js: ~115K tokens × $4.80/MTok blended), which
  // would make Atlas refuse every benchmark ⇒ zero candidates. balanced/deep/max ($2.50/$10/$40)
  // already clear the floor, so they inherit their envelopes untouched.
  const budget: { maxUSD?: number } = effort === "fast" ? { maxUSD: 1.0 } : {};

  const tracePath = path.join(OUT_DIR, "atlas-trace.jsonl");
  const reportPath = path.join(OUT_DIR, "atlas-report.md");
  const errorsPath = path.join(OUT_DIR, "atlas-errors.json");
  fs.writeFileSync(tracePath, "", "utf8");
  fs.writeFileSync(reportPath, `# Atlas deep-research report — week ${sweepWeek}\n\n`, "utf8");
  fs.rmSync(errorsPath, { force: true }); // reset; only rewritten below if THIS run errors

  const out: Record<
    string,
    {
      name: string;
      dataKey: string;
      coverageNote: string;
      candidates: Candidate[];
      sources: AtlasSource[];
      stats: AtlasStats;
    }
  > = {};
  const errors: { slug: string; error: string }[] = [];
  let totalCandidates = 0;
  let totalCost = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { slug, name } = page.meta;
    console.log(`\n[${i + 1}/${pages.length}] ${slug} — researching via Atlas (effort ${effort})`);
    try {
      // Retry the research call: glm-5.2 sometimes returns an empty response on the structured
      // extraction. Failed attempts die before extraction so they bill ~$0.
      let result:
        | {
            object?: { candidates?: Candidate[]; coverageNote?: string };
            sources?: AtlasSource[];
            stats?: AtlasStats;
            report?: string;
          }
        | undefined;
      let lastErr: unknown;
      for (let attempt = 1; attempt <= MAX_RESEARCH_ATTEMPTS; attempt++) {
        try {
          result = (await atlas.research(buildPrompt(page, runBySlug[slug], sinceDate), {
            schema: candidateSchema,
            effort,
            budget,
          })) as typeof result;
          break;
        } catch (e) {
          lastErr = e;
          const msg = describeError(e);
          if (attempt < MAX_RESEARCH_ATTEMPTS) {
            console.warn(
              `  attempt ${attempt}/${MAX_RESEARCH_ATTEMPTS} failed: ${msg} — retrying…`
            );
          }
        }
      }
      if (!result) throw lastErr;

      const obj = result.object ?? { candidates: [], coverageNote: "" };
      const sources = (result.sources ?? []) as AtlasSource[];
      const stats = (result.stats ?? {}) as AtlasStats;
      const cost = stats.costUSD ?? 0;

      out[slug] = {
        name,
        dataKey: dataKeyForSlug(slug) ?? slug,
        coverageNote: obj.coverageNote ?? "",
        candidates: obj.candidates ?? [],
        sources: sources.map((s) => ({ url: s.url, title: s.title, via: s.via })),
        stats,
      };
      totalCandidates += out[slug].candidates.length;
      totalCost += cost;

      for (const c of out[slug].candidates) {
        writeLine(tracePath, JSON.stringify({ slug, ...c }));
      }
      writeLine(
        reportPath,
        `## ${name} (${slug})\n\n_${out[slug].candidates.length} candidate(s), ~$${cost.toFixed(2)}, stop=${stats.stopReason ?? "?"}_\n\n${result.report ?? ""}\n`
      );

      console.log(
        `  -> ${out[slug].candidates.length} candidate(s), ~$${cost.toFixed(2)}, stop=${stats.stopReason ?? "?"}`
      );
    } catch (e) {
      const msg = describeError(e);
      console.error(`  ERROR on ${slug}: ${msg}`);
      errors.push({ slug, error: msg });
    }
  }

  const candidatesPath = path.join(OUT_DIR, "atlas-candidates.json");
  fs.writeFileSync(
    candidatesPath,
    JSON.stringify(
      {
        queriedAt: new Date().toISOString(),
        sweepWeek,
        model: resolved.modelId,
        effort,
        sinceDate,
        totalCandidates,
        estimatedCostUSD: Number(totalCost.toFixed(4)),
        benchmarks: out,
      },
      null,
      2
    ) + "\n"
  );
  if (errors.length) fs.writeFileSync(errorsPath, JSON.stringify(errors, null, 2) + "\n");

  console.log(
    `\nWrote ${totalCandidates} candidate(s) across ${Object.keys(out).length}/${pages.length} benchmark(s), est. cost ~$${totalCost.toFixed(2)}.`
  );
  console.log(
    `Artifacts: atlas-candidates.json, atlas-report.md, atlas-trace.jsonl${errors.length ? ", atlas-errors.json" : ""}`
  );

  if (totalCandidates === 0 && Object.keys(out).length === 0) {
    console.error("No benchmarks produced candidates and all errored. Treating as failure.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
