// ABOUTME: Astro API endpoint serving a markdown version of the main leaderboard page.
// ABOUTME: Follows the llms.txt spec - accessible at /index.md.

import type { APIRoute } from "astro";
import { leaderboardEntries } from "../lib/leaderboard";

export const GET: APIRoute = () => {
  const lines: string[] = [];

  lines.push("# Steel Agent Leaderboard — WebVoyager");
  lines.push("");
  lines.push("> Rankings of web navigation agents on the WebVoyager benchmark.");
  lines.push("> Source: https://leaderboard.steel.dev | Maintained by Steel (https://steel.dev)");
  lines.push("");
  lines.push("WebVoyager is the most widely adopted web agent benchmark — 643 tasks across 15 live public websites, evaluated by a GPT-4V judge. It is the de facto standard for comparing commercial and research web agents.");
  lines.push("");
  lines.push("| Rank | Agent | Organization | Score | Homepage |");
  lines.push("|------|-------|--------------|-------|----------|");

  leaderboardEntries.forEach((entry, i) => {
    lines.push(
      `| ${i + 1} | ${entry.agent}${entry.isNew ? " ✦" : ""} | ${entry.organization} | ${entry.webVoyager.score} | ${entry.homepage} |`
    );
  });

  lines.push("");
  lines.push("✦ = recently added");
  lines.push("");
  lines.push("## See Also");
  lines.push("");
  lines.push("- [All benchmark results](https://leaderboard.steel.dev/results.md)");
  lines.push("- [Benchmark registry](https://leaderboard.steel.dev/registry.md)");
  lines.push("- [Full context file](https://leaderboard.steel.dev/llms-full.txt)");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
