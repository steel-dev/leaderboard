// ABOUTME: Astro API endpoint generating an LLM-optimized full-context file at build time.
// ABOUTME: Concatenates every benchmark page's markdown body into a single document.

import type { APIRoute } from "astro";
import {
  benchmarkCategoryLabels,
  getAllBenchmarkPages,
  getTopResult,
  renderBenchmarkMarkdown,
} from "../lib/benchmark-hub";

export const GET: APIRoute = () => {
  const pages = getAllBenchmarkPages();
  const lines: string[] = [];

  lines.push("# Steel Benchmark Hub — Full Context");
  lines.push("");
  lines.push("> Benchmark-specific rankings for agent and model evaluation.");
  lines.push("> Source: https://leaderboard.steel.dev | Maintained by Steel (https://steel.dev)");
  lines.push("");

  lines.push("## Benchmarks");
  lines.push("");
  lines.push("| Name | Category | Scope | Top tracked row | URL |");
  lines.push("|------|----------|-------|-----------------|-----|");
  pages.forEach((page) => {
    const top = getTopResult(page.results);
    lines.push(
      `| ${page.meta.name} | ${benchmarkCategoryLabels[page.meta.category]} | ${page.meta.scope} | ${top ? `${top.systemName} (${top.scoreDisplay})` : "N/A"} | https://leaderboard.steel.dev/leaderboards/${page.meta.slug}/ |`
    );
  });
  lines.push("");

  for (const page of pages) {
    lines.push(renderBenchmarkMarkdown(page, { headingLevel: 2 }));
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
