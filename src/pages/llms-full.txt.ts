// ABOUTME: Astro API endpoint generating an LLM-optimized context file at build time.
// ABOUTME: WebVoyager leaderboard data in markdown.

import type { APIRoute } from "astro";
import {
  benchmarkCategoryLabels,
  buildBenchmarkFaqFacts,
  generateBenchmarkFaq,
  getAllBenchmarkPages,
  getTopResult,
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
    lines.push(`## ${page.meta.name}`);
    lines.push("");
    lines.push(`Category: ${benchmarkCategoryLabels[page.meta.category]}`);
    lines.push(`Scope: ${page.meta.scope}`);
    lines.push(`Last updated: ${page.meta.lastUpdated}`);
    lines.push("");
    lines.push("| Rank | System | Score | Organization | Notes | Source |");
    lines.push("|------|--------|-------|--------------|-------|--------|");
    page.results.forEach((row) => {
      lines.push(
        `| ${row.rank} | ${row.systemName} | ${row.scoreDisplay} | ${row.organization} | ${row.notesShort} | ${row.sourceUrl} |`
      );
    });
    lines.push("");

    const faqItems = generateBenchmarkFaq(page.meta, buildBenchmarkFaqFacts(page));
    lines.push("FAQ:");
    faqItems.forEach((item) => {
      lines.push(`- Q: ${item.q}`);
      lines.push(`  A: ${item.a}`);
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
