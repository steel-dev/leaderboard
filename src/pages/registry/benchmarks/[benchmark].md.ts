// ABOUTME: Astro API endpoint serving markdown versions of individual benchmark detail pages.
// ABOUTME: Follows the llms.txt spec - accessible at /registry/benchmarks/[benchmark].md.

import type { GetStaticPaths, APIRoute } from "astro";
import {
  benchmarks,
  benchmarkDomainLabels,
  categorySlugs,
  getBenchmarkAnchorId,
  getCategoryPath,
  categoryRouteLabels,
} from "../../../lib/benchmarks";
import type { RoutedCategory } from "../../../lib/benchmarks";
import { getBenchmarkSummary } from "../../../lib/benchmark-summaries";
import { indexEntries } from "../../../lib/index-data";

export const getStaticPaths: GetStaticPaths = () => {
  return benchmarks.map((benchmark) => ({
    params: { benchmark: getBenchmarkAnchorId(benchmark.name) },
    props: { benchmark },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { benchmark } = props as { benchmark: (typeof benchmarks)[number] };
  const slug = getBenchmarkAnchorId(benchmark.name);
  const categoryLabel = benchmarkDomainLabels[benchmark.category];
  const hasRoute = benchmark.category in categorySlugs;
  const categorySlug = hasRoute ? categorySlugs[benchmark.category as RoutedCategory] : null;

  const summaryParagraphs = getBenchmarkSummary(slug);
  const results = indexEntries.filter((e) => e.benchmark === benchmark.name);

  const lines: string[] = [];

  lines.push(`# ${benchmark.name}`);
  lines.push("");
  lines.push(`> ${benchmark.description}`);
  lines.push(`> Source: https://leaderboard.steel.dev/registry/benchmarks/${slug} | Maintained by Steel (https://steel.dev)`);
  lines.push("");

  lines.push("## Overview");
  lines.push("");
  lines.push(`- **Category:** ${categoryLabel}`);
  lines.push(`- **Tasks:** ${benchmark.tasks}`);
  lines.push(`- **Evaluator:** ${benchmark.evaluator}`);
  lines.push(`- **Human baseline:** ${benchmark.human}`);
  lines.push(`- **Self-hosted:** ${benchmark.selfHosted ? "Yes" : "No"}`);
  if (benchmark.benchmarkOrg) lines.push(`- **Benchmark org:** ${benchmark.benchmarkOrg}`);
  lines.push(`- **Top agent:** ${benchmark.topAgent} (${benchmark.topOrg}) — ${benchmark.topScore}`);
  lines.push(`- **Paper:** ${benchmark.paper}`);
  if (benchmark.github) lines.push(`- **GitHub:** ${benchmark.github}`);
  lines.push("");

  if (summaryParagraphs && summaryParagraphs.length > 0) {
    lines.push("## Summary");
    lines.push("");
    for (const para of summaryParagraphs) {
      lines.push(para);
      lines.push("");
    }
  }

  if (results.length > 0) {
    lines.push("## Results");
    lines.push("");
    lines.push("| Rank | Agent | Organization | Score | Open Source | Self-Reported |");
    lines.push("|------|-------|--------------|-------|-------------|---------------|");
    results.forEach((entry, i) => {
      lines.push(
        `| ${i + 1} | ${entry.agent}${entry.isNew ? " ✦" : ""} | ${entry.organization} | ${entry.score} | ${entry.openSource ? "Yes" : "No"} | ${entry.selfReported ? "Yes" : "No"} |`
      );
    });
    lines.push("");
    lines.push("✦ = recently added");
    lines.push("");
  }

  lines.push("## See Also");
  lines.push("");
  if (categorySlug) {
    lines.push(`- [${categoryLabel} benchmarks](https://leaderboard.steel.dev/registry/${categorySlug}.md)`);
  }
  lines.push("- [All benchmarks](https://leaderboard.steel.dev/registry.md)");
  lines.push("- [All results](https://leaderboard.steel.dev/results.md)");
  lines.push("- [Full context file](https://leaderboard.steel.dev/llms-full.txt)");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
