import fs from "fs";
import path from "path";
import { leaderboardEntries } from "../lib/leaderboard.js";

const README_PATH = path.join(process.cwd(), "README.md");

function generateTableMarkdown(entries: typeof leaderboardEntries): string {
  const header = `| Rank | Model           | Company        | WebVoyager Score | Source                                                                                            | Open Source | New | SOTA |
| ---- | --------------- | -------------- | ---------------- | ------------------------------------------------------------------------------------------------- | ----------- | --- | ---- |`;

  const rows = entries
    .map((entry) => {
      const openSource = entry.github ? "Yes" : "No";
      const isNew = entry.isNew ? "Yes" : "";
      const isSota = entry.isSota ? "Yes" : "";

      return `| ${entry.rank} | ${entry.model.padEnd(14)} | ${entry.company.padEnd(13)} | ${entry.webVoyager.score.padEnd(15)} | [Source](${entry.webVoyager.source}) | ${openSource.padEnd(11)} | ${isNew.padEnd(3)} | ${isSota.padEnd(4)} |`;
    })
    .join("\n");

  return `${header}\n${rows}`;
}

function updateReadme() {
  const readmeContent = fs.readFileSync(README_PATH, "utf-8");
  const tableMarkdown = generateTableMarkdown(leaderboardEntries);

  // Replace the existing table with the new one, being more specific about the table boundaries
  const updatedContent = readmeContent.replace(
    /\| Rank \| Model.*?\n\| ---- \|.*?\n(\| \d+ \|.*\n)*?(?=\n\*\*Notes:\*\*)/s,
    tableMarkdown
  );

  fs.writeFileSync(README_PATH, updatedContent);
  console.log("README.md has been updated successfully!");
}

updateReadme();
