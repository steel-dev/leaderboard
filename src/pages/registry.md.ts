// ABOUTME: Astro API endpoint serving a markdown version of the benchmark registry index.
// ABOUTME: Follows the llms.txt spec - accessible at /registry.md.

import type { APIRoute } from "astro";
import { benchmarks, benchmarkDomainLabels, categorySlugs, getBenchmarkAnchorId } from "../lib/benchmarks";

export const GET: APIRoute = () => {
  const lines: string[] = [];

  lines.push("# AI Agent Benchmark Registry");
  lines.push("");
  lines.push("> A curated registry of AI agent benchmarks across all major categories.");
  lines.push("> Source: https://leaderboard.steel.dev/registry | Maintained by Steel (https://steel.dev)");
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

    lines.push(`## ${label}`);
    lines.push("");
    lines.push(`[Full category page](https://leaderboard.steel.dev/registry/${slug}.md)`);
    lines.push("");

    for (const b of catBenchmarks) {
      const benchSlug = getBenchmarkAnchorId(b.name);
      lines.push(`### ${b.name}`);
      lines.push("");
      lines.push(b.description);
      lines.push("");
      lines.push(`- **Top agent:** ${b.topAgent} (${b.topOrg}) — ${b.topScore}`);
      lines.push(`- **Tasks:** ${b.tasks} | **Evaluator:** ${b.evaluator} | **Human baseline:** ${b.human}`);
      lines.push(`- **Detail:** https://leaderboard.steel.dev/registry/benchmarks/${benchSlug}.md`);
      lines.push("");
    }
  }

  lines.push("## See Also");
  lines.push("");
  lines.push("- [All results](https://leaderboard.steel.dev/results.md)");
  lines.push("- [Full context file](https://leaderboard.steel.dev/llms-full.txt)");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
