// ABOUTME: JUDGMENT pass. Reads Atlas's cited candidates (.discovery/atlas-candidates.json),
// ABOUTME: the FULL current leaderboard rows for each benchmark, and the CONTRIBUTING evidence
// ABOUTME: ladder, and emits ONE declarative proposal per benchmark to
// ABOUTME: .discovery/proposals/<dataKey>-<week>.json. Deductive only — NO network, NO tools
// ABOUTME: (a plain generateObject call). A deterministic apply step (discover-apply.ts) later
// ABOUTME: validates, re-ranks, and opens the PR. This script never touches src/data or git.

import fs from "fs";
import path from "path";
import { generateObject } from "ai";
import { z } from "zod";
import { getBenchmarkPage, type BenchmarkResultRow } from "../lib/benchmark-hub.js";
import { dataKeyForSlug } from "../lib/discovery-map.js";
import { resolveDiscoveryModel } from "../lib/zai-model.js";

const OUT_DIR = path.join(process.cwd(), ".discovery");
const CANDIDATES_JSON = path.join(OUT_DIR, "atlas-candidates.json");
const PROPOSALS_DIR = path.join(OUT_DIR, "proposals");
// z.ai/glm-5.2 occasionally returns an empty response ("No object generated") on the first
// generateObject call — a retry clears it. Retry also lets us capture usage across attempts.
const MAX_JUDGE_ATTEMPTS = 3;

// A leaderboard ENTRY minus `rank` (the apply step owns ranks), plus per-add judgment metadata.
// This Zod shape is what the LLM is forced to emit. The apply step re-validates the entry half
// against src/data/schema.json itself, so this is a forcing function, not the final word.
const entrySchema = z.object({
  systemName: z.string().min(1),
  organization: z.string().min(1),
  scoreDisplay: z.string().min(1),
  scoreValue: z.number(),
  sourceUrl: z.string(),
  repoUrl: z.string().optional(),
  notesShort: z.string().min(1),
  reportedAt: z.string().optional(),
  isNew: z.boolean().optional(),
});

const proposalSchema = z.object({
  summary: z.string().describe("One-line tally: N adds; M dismissed (top reason)."),
  adds: z.array(
    z.object({
      entry: entrySchema.describe("A complete leaderboard entry WITHOUT rank (apply re-ranks)."),
      reasoning: z
        .string()
        .describe(
          "Why ADD: evidence tier, why the number is verbatim, why it is the ORIGINAL benchmark (not variant/subset), why not a duplicate of an existing row, in-window."
        ),
      evidenceTier: z.enum([
        "official-leaderboard",
        "paper",
        "model-card",
        "repo",
        "third-party-eval",
      ]),
      quotedEvidence: z
        .string()
        .describe("The verbatim snippet from the fetched source containing the exact number."),
    })
  ),
  dismissals: z.array(
    z.object({
      candidateSystemName: z.string().optional(),
      scoreDisplay: z.string().optional(),
      sourceUrl: z.string().optional(),
      reasoning: z.string().describe("One-sentence why this candidate is NOT being added."),
      category: z.enum([
        "verbatim-missing",
        "variant",
        "out-of-window",
        "duplicate",
        "weak-source",
        "subset-not-comparable",
        "other",
      ]),
    })
  ),
  coverageNote: z.string().describe("What was judged, gaps, anything a reviewer should know."),
});

type Proposal = z.infer<typeof proposalSchema>;

interface CandidateRow {
  systemName: string;
  organization: string;
  scoreDisplay: string;
  scoreValue?: number;
  sourceUrl: string;
  reportedAt?: string;
  setup: string;
  isSelfReported: boolean;
  isVariant: boolean;
  variantName?: string;
  quotedEvidence: string;
  sourceTier: string;
}

interface CandidatesFile {
  sweepWeek: string;
  sinceDate: string;
  model: string;
  benchmarks: Record<string, { name: string; coverageNote: string; candidates: CandidateRow[] }>;
}

function parseArgs(): { slugs: Set<string> | null; model: string | undefined } {
  const args = process.argv.slice(2);
  let slugs: Set<string> | null = null;
  let model: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--slug" && args[i + 1]) slugs = new Set(args[++i].split(","));
    else if (a === "--model" && args[i + 1]) model = args[++i];
  }
  return { slugs, model };
}

function readCandidates(): CandidatesFile {
  if (!fs.existsSync(CANDIDATES_JSON)) {
    console.error(
      `Missing ${CANDIDATES_JSON}. Run "pnpm run discover:research" first to produce Atlas candidates.`
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CANDIDATES_JSON, "utf8")) as CandidatesFile;
}

function existingRowsBlock(rows: BenchmarkResultRow[]): string {
  if (rows.length === 0) return "(none — empty leaderboard)";
  return rows
    .map(
      (r) =>
        `- rank ${r.rank}: ${r.systemName} — ${r.scoreDisplay} (${r.organization}) — ${r.sourceUrl}`
    )
    .join("\n");
}

function candidatesBlock(cands: CandidateRow[]): string {
  if (cands.length === 0) return "(none)";
  return cands
    .map((c, i) => {
      const parts = [
        `CANDIDATE ${i + 1}:`,
        `systemName: ${c.systemName}`,
        `organization: ${c.organization}`,
        `scoreDisplay: ${c.scoreDisplay}`,
        `scoreValue: ${c.scoreValue ?? "(none)"}`,
        `sourceUrl: ${c.sourceUrl}`,
        `reportedAt: ${c.reportedAt ?? "(none)"}`,
        `setup: ${c.setup}`,
        `isSelfReported: ${c.isSelfReported}`,
        `isVariant: ${c.isVariant}`,
        `variantName: ${c.variantName || "(none)"}`,
        `sourceTier: ${c.sourceTier}`,
        `quotedEvidence: ${c.quotedEvidence}`,
      ];
      return parts.join("\n  ");
    })
    .join("\n\n");
}

function buildSystemPrompt(): string {
  return `You are the JUDGMENT pass for a benchmark-leaderboard discovery pipeline. You receive candidates that a research engine already found and cited — each carries quotedEvidence (a verbatim snippet from a fetched primary source) and a sourceTier. Judge PURELY from that evidence plus the benchmark's current contents. You have NO tools and MUST NOT fetch anything.

EVIDENCE LADDER (CONTRIBUTING.md), strongest to weakest:
1. official leaderboard maintained by the benchmark authors
2. peer-reviewed paper / arXiv / tech report with a benchmark table
3. official model card / product post / launch post / eval PDF from the reporting org
4. public repo with reproducible eval artifacts or a clear results table
5. independent third-party eval with enough methodology to inspect
Usually UNACCEPTABLE: social posts without an artifact, screenshots with no stable URL, private docs, aggregators that don't link the primary, "state of the art" with no number, numbers inferred from a chart, and source URLs that are just a homepage.

HARD RULES:
- ADMIT an add only if it is an ABSOLUTE, COMPLETE number on the ORIGINAL benchmark AND that exact number appears VERBATIM in quotedEvidence. Reject deltas ("+8 points"), "SOTA" with no number, and truncated/chart-inferred/guessed/rounded numbers — those become dismissals with category verbatim-missing. If scoreValue cannot be read verbatim from quotedEvidence, it is verbatim-missing.
- ADMIT only ORIGINAL-benchmark scores. A score on a VARIANT (e.g. BrowseComp-Plus, SWE-bench Multilingual/Pro, RepoMirage, Online-Mind2Web-as-variant) OR on a filtered SUBSET / non-standard judge / pass@k-on-a-subset is NOT comparable to full-test rows and MUST be dismissed (category variant or subset-not-comparable). Preserve the setup distinction in the dismissal reason.
- ADMIT only candidates published inside the lookback window [sinceDate, today]; otherwise dismiss as out-of-window.
- ADMIT only if NOT already tracked — compare against the EXISTING ROWS list (same system + same/similar score); otherwise dismiss as duplicate.
- Self-reported (reporting org == system vendor) IS admissible when public and specific, but notesShort MUST state it is self-reported.
- For every ADD: produce a complete entry (systemName, organization, scoreDisplay, scoreValue = the verbatim number, sourceUrl that CONTAINS the score, notesShort capturing setup + caveat in one sentence, reportedAt, isNew:true) and a one-sentence reasoning citing the evidence tier and why it is original, in-window, and not a duplicate.
- For every DISMISSAL: include candidateSystemName, sourceUrl, a one-sentence reason, and a category.
- COMPREHENSIVE: every input candidate is either an add or a dismissal (the counts must reconcile). Do not drop a candidate silently.
- Never invent a source, round a number, or guess. You have no tools — work only from the provided evidence.`;
}

function buildUserPrompt(
  name: string,
  slug: string,
  methodology: string[],
  importantNotes: string[],
  sinceDate: string,
  rows: BenchmarkResultRow[],
  cands: CandidateRow[]
): string {
  const meth = methodology.length ? methodology.map((m) => `- ${m}`).join("\n") : "(none)";
  const notes = importantNotes.length ? importantNotes.map((n) => `- ${n}`).join("\n") : "(none)";
  return `Benchmark: ${name} (slug: ${slug}).
Lookback window: candidates must have been published on or after ${sinceDate} (and not in the future). Today is the run date in the candidates file.

Methodology / scoring context for this leaderboard:
${meth}

Comparability caveats already documented for this leaderboard:
${notes}

EXISTING ROWS already tracked on ${name} (do NOT re-add these unless a NEW, different score appeared — then it is a duplicate dismissal unless the score genuinely changed):
${existingRowsBlock(rows)}

CANDIDATES to judge:
${candidatesBlock(cands)}

Emit the proposal: summary, adds[] (each with a full rank-less entry + reasoning + evidenceTier + quotedEvidence), dismissals[] (each with reason + category), and coverageNote. Every candidate above must appear in exactly one of adds or dismissals.`;
}

async function main(): Promise<void> {
  const { slugs, model } = parseArgs();
  const resolved = resolveDiscoveryModel(model);
  console.log(
    `Judge model: ${resolved.modelId}${resolved.viaZai ? ` via z.ai (${resolved.endpoint})` : " via Anthropic"}`
  );

  const file = readCandidates();
  const slugsToJudge = Object.keys(file.benchmarks).filter((s) => !slugs || slugs.has(s));
  if (slugsToJudge.length === 0) {
    console.error("No benchmarks to judge (check --slug against atlas-candidates.json).");
    process.exit(1);
  }

  fs.mkdirSync(PROPOSALS_DIR, { recursive: true });
  const sinceDate = file.sinceDate;
  const sweepWeek = file.sweepWeek;
  const today = new Date().toISOString().slice(0, 10);
  const usageLog: {
    slug: string;
    attempts: number;
    model: string;
    candidates: number;
    adds: number;
    dismissals: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  }[] = [];

  for (const slug of slugsToJudge) {
    const bench = file.benchmarks[slug];
    const dataKey = dataKeyForSlug(slug);
    if (!dataKey) {
      console.warn(`  SKIP ${slug}: no dataKey mapping (unknown slug).`);
      continue;
    }
    const page = getBenchmarkPage(slug);
    const rows = page?.results ?? [];
    console.log(`\n[${slug}] ${bench.candidates.length} candidate(s) — judging...`);

    let proposal: Proposal | undefined;
    let attempts = 0;
    let lastErr = "";
    const usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    for (let attempt = 1; attempt <= MAX_JUDGE_ATTEMPTS; attempt++) {
      attempts++;
      try {
        const res = await generateObject({
          model: resolved.model,
          schema: proposalSchema,
          schemaName: "DiscoveryProposal",
          system: buildSystemPrompt(),
          prompt: buildUserPrompt(
            bench.name ?? page?.meta.name ?? slug,
            slug,
            page?.meta.methodology ?? [],
            page?.meta.importantNotes ?? [],
            sinceDate,
            rows,
            bench.candidates
          ),
          temperature: 0,
        });
        proposal = res.object;
        // AI SDK usage names changed across versions (inputTokens vs promptTokens); accept both.
        const u = (res.usage ?? {}) as {
          inputTokens?: number;
          promptTokens?: number;
          outputTokens?: number;
          completionTokens?: number;
          totalTokens?: number;
        };
        const inT = u.inputTokens ?? u.promptTokens ?? 0;
        const outT = u.outputTokens ?? u.completionTokens ?? 0;
        usage.inputTokens += inT;
        usage.outputTokens += outT;
        usage.totalTokens += u.totalTokens ?? inT + outT;
        break;
      } catch (e) {
        lastErr = (e as Error).message;
        console.warn(`  attempt ${attempt}/${MAX_JUDGE_ATTEMPTS} failed: ${lastErr}`);
      }
    }
    if (!proposal) {
      console.error(`  ERROR judging ${slug} after ${attempts} attempt(s): ${lastErr}`);
      continue;
    }
    usageLog.push({
      slug,
      attempts,
      model: resolved.modelId,
      candidates: bench.candidates.length,
      adds: proposal.adds.length,
      dismissals: proposal.dismissals.length,
      ...usage,
    });

    const outPath = path.join(PROPOSALS_DIR, `${dataKey}-${sweepWeek}.json`);
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          schemaVersion: 1,
          sweepWeek,
          sinceDate,
          judgedAt: today,
          model: resolved.modelId,
          slug,
          dataKey,
          summary: proposal.summary,
          adds: proposal.adds,
          dismissals: proposal.dismissals,
          coverageNote: proposal.coverageNote,
        },
        null,
        2
      ) + "\n"
    );
    console.log(
      `  -> ${proposal.adds.length} add(s), ${proposal.dismissals.length} dismissal(s) -> ${path.relative(process.cwd(), outPath)}`
    );
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "judge-usage.json"),
    JSON.stringify({ model: resolved.modelId, sweepWeek, sinceDate, runs: usageLog }, null, 2) +
      "\n"
  );
  const totIn = usageLog.reduce((s, r) => s + r.inputTokens, 0);
  const totOut = usageLog.reduce((s, r) => s + r.outputTokens, 0);
  console.log(
    `\nDone. Proposals in ${path.relative(process.cwd(), PROPOSALS_DIR)}/. Judge tokens: ${totIn} in / ${totOut} out across ${usageLog.length} benchmark(s).`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
