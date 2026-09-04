// ABOUTME: Discovery prototype — queries the arxiv public API for recent papers per benchmark.
// ABOUTME: Writes candidate JSON to .discovery/ for manual review; never touches src/data/.

import fs from "fs";
import path from "path";
import { getAllBenchmarkPages, type BenchmarkPageData } from "../lib/benchmark-hub.js";

const ARXIV_API = "http://export.arxiv.org/api/query";
const MAX_RESULTS = 20;
const DEFAULT_SINCE_DAYS = 90;
const ARXIV_RATE_LIMIT_MS = 3100; // arxiv ToS suggests <= 1 req per 3 sec
const OUT_DIR = path.join(process.cwd(), ".discovery");

interface ArxivEntry {
  arxivId: string;
  url: string;
  title: string;
  authors: string[];
  publishedAt: string;
  summary: string;
}

interface Candidate extends ArxivEntry {
  alreadyTracked: boolean;
  alreadyTrackedAs?: string;
}

interface DiscoveryReport {
  slug: string;
  benchmarkName: string;
  queriedAt: string;
  sinceIso: string;
  query: string;
  existingTopSystems: string[];
  totalFound: number;
  newCandidates: number;
  candidates: Candidate[];
}

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripVersion(id: string): string {
  return id.replace(/v\d+$/, "");
}

function parseAtom(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(xml))) {
    const body = match[1];
    const idMatch = body.match(/<id>([^<]+)<\/id>/);
    const titleMatch = body.match(/<title>([\s\S]*?)<\/title>/);
    const summaryMatch = body.match(/<summary>([\s\S]*?)<\/summary>/);
    const publishedMatch = body.match(/<published>([^<]+)<\/published>/);
    const authors = Array.from(body.matchAll(/<author>\s*<name>([^<]+)<\/name>/g)).map((a) => a[1]);
    if (!idMatch || !titleMatch) continue;
    const rawUrl = idMatch[1].trim();
    const arxivId = stripVersion(rawUrl.replace(/^https?:\/\/arxiv\.org\/abs\//, ""));
    entries.push({
      arxivId,
      url: `https://arxiv.org/abs/${arxivId}`,
      title: decodeXml(titleMatch[1]),
      authors,
      publishedAt: publishedMatch?.[1] ?? "",
      summary: decodeXml(summaryMatch?.[1] ?? ""),
    });
  }
  return entries;
}

function existingArxivIds(page: BenchmarkPageData): Map<string, string> {
  const map = new Map<string, string>();
  const arxivRe = /arxiv\.org\/(?:abs|html|pdf)\/([^/?#\s]+)/;
  for (const row of page.results) {
    const m = row.sourceUrl.match(arxivRe);
    if (m) map.set(stripVersion(m[1]), row.systemName);
  }
  for (const link of page.meta.links) {
    const m = link.url.match(arxivRe);
    if (m) map.set(stripVersion(m[1]), `[benchmark link: ${link.label}]`);
  }
  return map;
}

// Per-slug query overrides: benchmark names that are common words need disambiguation.
// This is the prototype for a future `discoveryQuery` field on BenchmarkPageMeta.
const QUERY_OVERRIDES: Record<string, string> = {
  gaia: "all:%22GAIA+benchmark%22+OR+all:%22GAIA+General+AI+Assistants%22",
  "swe-bench-verified": "all:%22SWE-bench+Verified%22",
  "tau-bench": "all:%22tau-bench%22+OR+all:%22%CF%84-bench%22",
};

function buildQuery(slug: string, name: string): string {
  if (QUERY_OVERRIDES[slug]) return QUERY_OVERRIDES[slug];
  return `all:%22${encodeURIComponent(name).replace(/%20/g, "+")}%22`;
}

async function discoverFor(page: BenchmarkPageData, sinceIso: string): Promise<DiscoveryReport> {
  const query = buildQuery(page.meta.slug, page.meta.name);
  const url = `${ARXIV_API}?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${MAX_RESULTS}`;
  console.log(`[${page.meta.slug}] querying arxiv for "${page.meta.name}"`);
  const res = await fetch(url, {
    headers: { "User-Agent": "steel-leaderboard-discovery/0.1 (https://leaderboard.steel.dev)" },
  });
  if (!res.ok) {
    throw new Error(`arxiv HTTP ${res.status} for ${page.meta.slug}`);
  }
  const xml = await res.text();
  const entries = parseAtom(xml);
  const known = existingArxivIds(page);

  const candidates: Candidate[] = entries
    .filter((e) => e.publishedAt >= sinceIso)
    .map((e) => ({
      ...e,
      alreadyTracked: known.has(e.arxivId),
      alreadyTrackedAs: known.get(e.arxivId),
    }));

  const newCount = candidates.filter((c) => !c.alreadyTracked).length;
  console.log(`  ${entries.length} returned, ${candidates.length} within window, ${newCount} new`);

  return {
    slug: page.meta.slug,
    benchmarkName: page.meta.name,
    queriedAt: new Date().toISOString(),
    sinceIso,
    query: decodeURIComponent(query),
    existingTopSystems: page.results.slice(0, 8).map((r) => `${r.systemName} (${r.scoreDisplay})`),
    totalFound: entries.length,
    newCandidates: newCount,
    candidates,
  };
}

function parseArgs(): { slugs: Set<string> | null; sinceDays: number } {
  const args = process.argv.slice(2);
  let slugs: Set<string> | null = null;
  let sinceDays = DEFAULT_SINCE_DAYS;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--slug" && args[i + 1]) {
      slugs = new Set(args[++i].split(","));
    } else if (args[i] === "--since-days" && args[i + 1]) {
      sinceDays = Number(args[++i]);
    }
  }
  return { slugs, sinceDays };
}

function writeReport(report: DiscoveryReport): void {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, `${report.slug}.candidates.json`);
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
}

function writeSummary(reports: DiscoveryReport[]): void {
  const lines = [
    "# Discovery summary",
    "",
    `Run: ${new Date().toISOString()}`,
    "",
    "| Benchmark | Returned | In window | New | Top existing |",
    "| --- | ---: | ---: | ---: | --- |",
  ];
  for (const r of reports) {
    const top = r.existingTopSystems[0] ?? "(none)";
    lines.push(
      `| ${r.slug} | ${r.totalFound} | ${r.candidates.length} | ${r.newCandidates} | ${top} |`
    );
  }
  fs.writeFileSync(path.join(OUT_DIR, "SUMMARY.md"), lines.join("\n") + "\n");
}

function writeConsolidated(reports: DiscoveryReport[]): void {
  // Single-file input for the Claude filter pass: drop already-tracked candidates here
  // to keep token cost down. Claude still receives benchmark context and existing top systems.
  const filtered = reports.map((r) => ({
    slug: r.slug,
    benchmarkName: r.benchmarkName,
    sinceIso: r.sinceIso,
    existingTopSystems: r.existingTopSystems,
    candidates: r.candidates.filter((c) => !c.alreadyTracked),
  }));
  fs.writeFileSync(
    path.join(OUT_DIR, "run.json"),
    JSON.stringify({ queriedAt: new Date().toISOString(), benchmarks: filtered }, null, 2)
  );
}

async function main(): Promise<void> {
  const { slugs, sinceDays } = parseArgs();
  const since = new Date(Date.now() - sinceDays * 86_400_000).toISOString();
  const pages = getAllBenchmarkPages().filter((p) => !slugs || slugs.has(p.meta.slug));
  if (pages.length === 0) {
    console.error("No benchmarks selected. Check --slug values.");
    process.exit(1);
  }
  console.log(`Discovering against ${pages.length} benchmarks since ${since}\n`);

  const reports: DiscoveryReport[] = [];
  for (let i = 0; i < pages.length; i++) {
    const report = await discoverFor(pages[i], since);
    writeReport(report);
    reports.push(report);
    if (i < pages.length - 1) {
      await new Promise((r) => setTimeout(r, ARXIV_RATE_LIMIT_MS));
    }
  }
  writeSummary(reports);
  writeConsolidated(reports);
  console.log(`\nWrote ${reports.length} report(s) to ${OUT_DIR}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
