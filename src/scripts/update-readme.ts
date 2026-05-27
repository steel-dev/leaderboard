import fs from "fs";
import path from "path";
import {
  benchmarkCategoryLabels,
  benchmarkScopeLabels,
  getAllBenchmarkPages,
  type BenchmarkPageData,
  type BenchmarkResultRow,
} from "../lib/benchmark-hub.js";

const README_PATH = path.join(process.cwd(), "README.md");
const SITE_URL = "https://leaderboard.steel.dev";
const TOP_N = 5;
const START_MARKER = "<!-- LEADERBOARDS:START -->";
const END_MARKER = "<!-- LEADERBOARDS:END -->";

function escapePipes(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function renderRow(row: BenchmarkResultRow): string {
  const system = row.isNew ? `${row.systemName} **(new)**` : row.systemName;
  const score = `[${row.scoreDisplay}](${row.sourceUrl})`;
  return `| ${row.rank} | ${escapePipes(system)} | ${escapePipes(row.organization)} | ${escapePipes(score)} |`;
}

function renderBenchmark(page: BenchmarkPageData): string {
  const { meta, results } = page;
  const url = `${SITE_URL}/leaderboards/${meta.slug}`;
  const top = results.slice(0, TOP_N);
  const remaining = Math.max(results.length - top.length, 0);

  const header = `### [${meta.name}](${url})

${benchmarkCategoryLabels[meta.category]} · ${benchmarkScopeLabels[meta.scope]} scope · ${results.length} ${results.length === 1 ? "entry" : "entries"} tracked`;

  if (top.length === 0) {
    return `${header}\n\nNo tracked results yet — [contribute one](${SITE_URL}/leaderboards/${meta.slug}).`;
  }

  const table = [
    "| Rank | System | Organization | Score |",
    "| ---: | ------ | ------------ | ----- |",
    ...top.map(renderRow),
  ].join("\n");

  const more =
    remaining > 0
      ? `\n\n[See all ${results.length} entries →](${url})`
      : `\n\n[View on the leaderboard →](${url})`;

  return `${header}\n\n${table}${more}`;
}

function renderAllBenchmarks(): string {
  return getAllBenchmarkPages().map(renderBenchmark).join("\n\n---\n\n");
}

function updateReadme(): void {
  const readme = fs.readFileSync(README_PATH, "utf-8");
  const start = readme.indexOf(START_MARKER);
  const end = readme.indexOf(END_MARKER);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Could not locate ${START_MARKER} / ${END_MARKER} markers in README.md`);
  }

  const before = readme.slice(0, start + START_MARKER.length);
  const after = readme.slice(end);
  const body = renderAllBenchmarks();
  const next = `${before}\n\n${body}\n\n${after}`;

  if (next === readme) {
    console.log("README.md already up to date.");
    return;
  }

  fs.writeFileSync(README_PATH, next);
  console.log("README.md has been updated successfully!");
}

updateReadme();
