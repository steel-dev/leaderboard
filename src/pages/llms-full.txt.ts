// ABOUTME: Astro API endpoint generating a full LLM-optimized context file at build time.
// ABOUTME: Contains all leaderboard entries, benchmark descriptions, and results in markdown.

import type { APIRoute } from "astro";
import { leaderboardEntries } from "../lib/leaderboard";
import { benchmarks, benchmarkDomainLabels, categorySlugs, getBenchmarkAnchorId } from "../lib/benchmarks";
import { indexEntries } from "../lib/index-data";

export const GET: APIRoute = () => {
  const lines: string[] = [];

  lines.push("# Steel Agent Leaderboard — Full Context");
  lines.push("");
  lines.push("> A community-maintained leaderboard and benchmark registry for AI agents.");
  lines.push("> Source: https://leaderboard.steel.dev | Maintained by Steel (https://steel.dev)");
  lines.push("");

  // WebVoyager leaderboard
  lines.push("## WebVoyager Leaderboard");
  lines.push("");
  lines.push("The most widely adopted web agent benchmark. 643 tasks across 15 live websites, evaluated by GPT-4V.");
  lines.push("");
  lines.push("| Rank | Agent | Organization | Score | Source |");
  lines.push("|------|-------|--------------|-------|--------|");
  leaderboardEntries.forEach((entry, i) => {
    const source = entry.homepage;
    lines.push(`| ${i + 1} | ${entry.agent} | ${entry.organization} | ${entry.webVoyager.score} | ${source} |`);
  });
  lines.push("");

  // Benchmark Registry
  lines.push("## Benchmark Registry");
  lines.push("");
  lines.push(`${benchmarks.length} benchmarks across 7 categories.`);
  lines.push("");

  const categoriesInOrder = [
    "WEB NAV", "RESEARCH", "DESKTOP", "CODING", "TOOL USE", "GENERAL", "SPECIALIZED"
  ] as const;

  for (const cat of categoriesInOrder) {
    const catBenchmarks = benchmarks.filter((b) => b.category === cat);
    if (catBenchmarks.length === 0) continue;

    const label = benchmarkDomainLabels[cat];
    const slug = categorySlugs[cat as keyof typeof categorySlugs];
    lines.push(`### ${label}`);
    lines.push("");

    for (const b of catBenchmarks) {
      const benchSlug = getBenchmarkAnchorId(b.name);
      lines.push(`#### ${b.name}`);
      lines.push("");
      lines.push(b.description);
      lines.push("");
      lines.push(`- **Category:** ${label}`);
      lines.push(`- **Tasks:** ${b.tasks}`);
      lines.push(`- **Evaluator:** ${b.evaluator}`);
      lines.push(`- **Top agent:** ${b.topAgent} (${b.topOrg}) — ${b.topScore}`);
      lines.push(`- **Human baseline:** ${b.human}`);
      lines.push(`- **Self-hosted:** ${b.selfHosted ? "Yes" : "No"}`);
      if (b.benchmarkOrg) lines.push(`- **Benchmark org:** ${b.benchmarkOrg}`);
      lines.push(`- **Paper:** ${b.paper}`);
      if (b.github) lines.push(`- **GitHub:** ${b.github}`);
      lines.push(`- **Detail page:** https://leaderboard.steel.dev/registry/benchmarks/${benchSlug}`);
      lines.push(`- **Category page:** https://leaderboard.steel.dev/registry/${slug}`);
      lines.push("");
    }
  }

  // Full results index
  lines.push("## All Agent Results");
  lines.push("");
  lines.push(`${indexEntries.length} results across all benchmarks.`);
  lines.push("");

  const benchmarkNames = [...new Set(indexEntries.map((e) => e.benchmark))];
  for (const benchmarkName of benchmarkNames) {
    const entries = indexEntries.filter((e) => e.benchmark === benchmarkName);
    lines.push(`### ${benchmarkName}`);
    lines.push("");
    lines.push("| Rank | Agent | Organization | Score | Open Source | Self-Reported |");
    lines.push("|------|-------|--------------|-------|-------------|---------------|");
    entries.forEach((entry, i) => {
      lines.push(
        `| ${i + 1} | ${entry.agent} | ${entry.organization} | ${entry.score} | ${entry.openSource ? "Yes" : "No"} | ${entry.selfReported ? "Yes" : "No"} |`
      );
    });
    lines.push("");
  }

  const content = lines.join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
