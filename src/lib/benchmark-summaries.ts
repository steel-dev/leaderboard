// ABOUTME: Helper to load benchmark summary markdown files at build time.
// ABOUTME: Parses docs/research/{slug}/summary.md and returns paragraph text.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getBenchmarkSummary(slug: string): string[] | null {
  try {
    const filePath = join(
      process.cwd(),
      "docs",
      "research",
      slug,
      "summary.md",
    );
    const content = readFileSync(filePath, "utf-8");

    const paragraphs = content
      .split("\n\n")
      .map((block) => block.trim())
      .filter((block) => {
        if (!block) return false;
        if (block.startsWith("ABOUTME:")) return false;
        if (block.startsWith("# ")) return false;
        return true;
      });

    return paragraphs.length > 0 ? paragraphs : null;
  } catch {
    return null;
  }
}
