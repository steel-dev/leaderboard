// ABOUTME: llms.txt index for the Steel benchmark hub.
// ABOUTME: Static wording with a dynamic Leaderboard section sourced from benchmark-hub.

import type { APIRoute } from "astro";
import { getAllBenchmarkPages } from "../lib/benchmark-hub";

export const GET: APIRoute = () => {
  const pages = getAllBenchmarkPages();
  const lines: string[] = [];

  lines.push("# Steel Agent Leaderboard");
  lines.push("");
  lines.push("> Benchmark hub with canonical benchmark leaderboard pages.");
  lines.push("");
  lines.push("Maintained by Steel (https://steel.dev).");
  lines.push("");
  lines.push("## Leaderboard");
  lines.push("");
  pages.forEach((page) => {
    lines.push(
      `- [${page.meta.name}](https://leaderboard.steel.dev/leaderboards/${page.meta.slug}/): ${page.meta.description}`
    );
  });
  lines.push("");
  lines.push("## Optional");
  lines.push("");
  lines.push(
    "- [Hub markdown index](https://leaderboard.steel.dev/index.md): Homepage benchmark hub summary."
  );
  lines.push(
    "- [Full context file](https://leaderboard.steel.dev/llms-full.txt): Leaderboard data in a single text file optimized for LLM context."
  );

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
