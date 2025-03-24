import fs from "fs";
import path from "path";
import { leaderboardEntries } from "../lib/leaderboard.js";

const README_PATH = path.join(process.cwd(), "README.md");

function generateTableMarkdown(entries: typeof leaderboardEntries): string {
  const header = `| Rank | Agent           | Organization   | WebVoyager Score | Source                                                                                            | Open Source | New | SOTA |
| ---- | --------------- | -------------- | ---------------- | ------------------------------------------------------------------------------------------------- | ----------- | --- | ---- |`;

  const highestScore = Math.max(
    ...entries.map((entry) => parseFloat(entry.webVoyager.score.replace("%", "")))
  );

  const rows = entries
    .map((entry, index) => {
      const rank = index + 1;
      const openSource = entry.github ? "Yes" : "No";
      const isNew = entry.isNew ? "Yes" : "";
      const isSota =
        parseFloat(entry.webVoyager.score.replace("%", "")) === highestScore ? "Yes" : "";

      return `| ${rank} | ${entry.agent.padEnd(14)} | ${entry.organization.padEnd(13)} | ${entry.webVoyager.score.padEnd(15)} | [Source](${entry.webVoyager.source}) | ${openSource.padEnd(11)} | ${isNew.padEnd(3)} | ${isSota.padEnd(4)} |`;
    })
    .join("\n");

  return `${header}\n${rows}`;
}

function updateReadme() {
  const readmeContent = fs.readFileSync(README_PATH, "utf-8");
  const tableMarkdown = generateTableMarkdown(leaderboardEntries);

  const tableStart = readmeContent.indexOf("| Rank | Agent");
  const notesStart = readmeContent.indexOf("**Notes:**", tableStart);

  if (tableStart === -1 || notesStart === -1) {
    console.error("Could not find table section in README");
    return;
  }

  const updatedContent =
    readmeContent.slice(0, tableStart) + tableMarkdown + "\n\n" + readmeContent.slice(notesStart);

  const cleanedContent = updatedContent
    .replace(/\|\|.*\n/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\*\*Notes:\*\*\*\*Notes:\*\*/g, "**Notes:**");

  fs.writeFileSync(README_PATH, cleanedContent);
  console.log("README.md has been updated successfully!");
}

updateReadme();
