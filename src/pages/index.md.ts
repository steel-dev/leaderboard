// ABOUTME: Astro API endpoint serving a markdown version of the main leaderboard page.
// ABOUTME: Follows the llms.txt spec - accessible at /index.md.

import type { APIRoute } from "astro";
import { benchmarkCategoryLabels, getAllBenchmarkPages, getTopResult } from "../lib/benchmark-hub";

export const GET: APIRoute = () => {
  const pages = getAllBenchmarkPages();
  const lines: string[] = [];

  lines.push("# Steel Benchmark Hub");
  lines.push("");
  lines.push("> Benchmark-specific leaderboards for agent and model evaluation.");
  lines.push("> Source: https://leaderboard.steel.dev | Maintained by Steel (https://steel.dev)");
  lines.push("");
  lines.push("Canonical benchmark pages:");
  lines.push("");
  lines.push("| Benchmark | Category | Top tracked row | Updated | URL |");
  lines.push("|-----------|----------|------------------|---------|-----|");

  pages.forEach((page) => {
    const top = getTopResult(page.results);
    lines.push(
      `| ${page.meta.name} | ${benchmarkCategoryLabels[page.meta.category]} | ${top ? `${top.systemName} (${top.scoreDisplay})` : "N/A"} | ${page.meta.lastUpdated} | https://leaderboard.steel.dev/leaderboards/${page.meta.slug}/ |`
    );
  });

  lines.push("");
  lines.push("## Featured");
  lines.push("");
  lines.push("- WebVoyager remains the flagship benchmark module on the homepage.");
  lines.push("- Each benchmark page follows: About -> Leaderboard -> FAQ.");
  lines.push("");
  lines.push("- [Full context file](https://leaderboard.steel.dev/llms-full.txt)");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
