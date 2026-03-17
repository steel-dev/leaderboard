// ABOUTME: Astro API endpoint serving markdown versions of benchmark category pages.
// ABOUTME: Follows the llms.txt spec - accessible at /registry/[category].md.

import type { GetStaticPaths, APIRoute } from "astro";
import {
  benchmarks,
  benchmarkDomainLabels,
  categorySlugs,
  slugToCategory,
  categoryRouteLabels,
  getBenchmarkAnchorId,
} from "../../lib/benchmarks";
import type { RoutedCategory } from "../../lib/benchmarks";

export const getStaticPaths: GetStaticPaths = () => {
  return Object.entries(categorySlugs).map(([category, slug]) => ({
    params: { category: slug },
    props: { category: category as RoutedCategory },
  }));
};

export const GET: APIRoute = ({ params }) => {
  const slug = params.category as string;
  const category = slugToCategory[slug] as RoutedCategory;
  const label = categoryRouteLabels[category];
  const catBenchmarks = benchmarks.filter((b) => b.category === category);

  const lines: string[] = [];

  lines.push(`# ${label} Benchmarks`);
  lines.push("");
  lines.push(`> AI agent benchmarks in the ${label.toLowerCase()} category.`);
  lines.push(`> Source: https://leaderboard.steel.dev/registry/${slug} | Maintained by Steel (https://steel.dev)`);
  lines.push("");
  lines.push(`${catBenchmarks.length} benchmarks in this category.`);
  lines.push("");

  for (const b of catBenchmarks) {
    const benchSlug = getBenchmarkAnchorId(b.name);

    lines.push(`## ${b.name}`);
    lines.push("");
    lines.push(b.description);
    lines.push("");
    lines.push(`- **Top agent:** ${b.topAgent} (${b.topOrg}) — ${b.topScore}`);
    lines.push(`- **Tasks:** ${b.tasks}`);
    lines.push(`- **Evaluator:** ${b.evaluator}`);
    lines.push(`- **Human baseline:** ${b.human}`);
    lines.push(`- **Self-hosted:** ${b.selfHosted ? "Yes" : "No"}`);
    if (b.benchmarkOrg) lines.push(`- **Benchmark org:** ${b.benchmarkOrg}`);
    lines.push(`- **Paper:** ${b.paper}`);
    if (b.github) lines.push(`- **GitHub:** ${b.github}`);
    lines.push(`- **Detail:** https://leaderboard.steel.dev/registry/benchmarks/${benchSlug}.md`);
    lines.push("");
  }

  lines.push("## See Also");
  lines.push("");
  lines.push("- [All benchmarks](https://leaderboard.steel.dev/registry.md)");
  lines.push("- [All results](https://leaderboard.steel.dev/results.md)");
  lines.push("- [Full context file](https://leaderboard.steel.dev/llms-full.txt)");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
