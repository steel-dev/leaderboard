// ABOUTME: Astro API endpoint serving a markdown version of the results index page.
// ABOUTME: Follows the llms.txt spec - accessible at /results.md.

import type { APIRoute } from "astro";
import { indexEntries } from "../lib/index-data";
import { benchmarkDomainLabels } from "../lib/benchmarks";

export const GET: APIRoute = () => {
  const lines: string[] = [];

  lines.push("# AI Agent Benchmark Results Index");
  lines.push("");
  lines.push("> All agent benchmark results across every tracked benchmark.");
  lines.push("> Source: https://leaderboard.steel.dev/results | Maintained by Steel (https://steel.dev)");
  lines.push("");
  lines.push(`${indexEntries.length} results across ${new Set(indexEntries.map((e) => e.benchmark)).size} benchmarks.`);
  lines.push("");

  const benchmarkNames = [...new Set(indexEntries.map((e) => e.benchmark))];

  for (const benchmarkName of benchmarkNames) {
    const entries = indexEntries.filter((e) => e.benchmark === benchmarkName);
    const category = entries[0].benchmarkCategory;
    const categoryLabel = benchmarkDomainLabels[category];

    lines.push(`## ${benchmarkName}`);
    lines.push("");
    lines.push(`**Category:** ${categoryLabel}`);
    lines.push("");
    lines.push("| Rank | Agent | Organization | Score | Open Source | Self-Reported |");
    lines.push("|------|-------|--------------|-------|-------------|---------------|");

    entries.forEach((entry, i) => {
      lines.push(
        `| ${i + 1} | ${entry.agent}${entry.isNew ? " ✦" : ""} | ${entry.organization} | ${entry.score} | ${entry.openSource ? "Yes" : "No"} | ${entry.selfReported ? "Yes" : "No"} |`
      );
    });

    lines.push("");
  }

  lines.push("✦ = recently added");
  lines.push("");
  lines.push("## See Also");
  lines.push("");
  lines.push("- [WebVoyager leaderboard](https://leaderboard.steel.dev/index.md)");
  lines.push("- [Benchmark registry](https://leaderboard.steel.dev/registry.md)");
  lines.push("- [Full context file](https://leaderboard.steel.dev/llms-full.txt)");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
