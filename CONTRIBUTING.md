# Contributor Guide

This repo is a source-linked benchmark hub. A leaderboard row is acceptable when a reader
can click through to a public source, find the benchmark result, understand what was run, and
see the main caveats without needing private context.

The goal is not to list every claim on the internet. The goal is to maintain useful,
searchable, defensible leaderboard pages for agent and model benchmarks.

## Quick Paths

Use this section when you already know what kind of change you are making.

### Add or update a result on an existing leaderboard

1. Find the matching data file in `src/data/`.
2. Add or update one JSON object in that benchmark's array.
3. Make sure `sourceUrl` directly supports the score.
4. Write `notesShort` with the setup and caveat that matter most.
5. Re-rank the file using competition ranking.
6. Run `npm run update-readme`.
7. Run `npm run lint` and `npm run build`.

### Add a new leaderboard page

1. Confirm the benchmark meets the acceptance standard in this guide.
2. Add `src/data/<benchmarkKey>.json`.
3. Export it from `src/data/index.ts`.
4. Add the key to `BenchmarkMap` and `benchmarkMap` in `src/lib/benchmark-hub.ts`.
5. Add a `benchmarkPages` entry in `src/lib/benchmark-hub.ts`.
6. Add 3 exact public task examples with citations.
7. Add related benchmarks and canonical links.
8. Run `npm run update-readme`.
9. Run `npm run lint` and `npm run build`.

## Evidence Standard

Every score needs one public citation. The citation must support the specific row, not just
the existence of the model, agent, or benchmark.

Required evidence for a result:

- Benchmark name and split or variant, when applicable.
- Score and metric.
- System, model, agent, or scaffold name.
- Reporting organization or authors.
- Evaluation setup if the score depends on tools, attempt count, context policy, task subset,
  judge, or special harness.
- Reporting date or publication date.

Acceptable source types, from strongest to weakest:

1. Official benchmark leaderboard maintained by the benchmark authors.
2. Peer-reviewed paper, arXiv paper, or technical report with a benchmark table.
3. Official model card, product post, launch post, evaluation PDF, or docs page from the
   organization reporting the result.
4. Public repository with reproducible eval artifacts, logs, result files, or a clear table.
5. Independent third-party evaluation with enough methodology detail to inspect the run.

Usually unacceptable:

- Social posts without a linked paper, table, repo, or artifact.
- Screenshots with no stable URL.
- Private docs, Discord messages, sales decks, or unpublished spreadsheets.
- Aggregator pages that do not link to the original score source.
- Claims like "state of the art" with no numeric score.
- Scores inferred visually from a chart when no exact value is published.
- Rows where the source URL is just a homepage and does not contain the result.

Self-reported results are allowed when they are public and specific, but `notesShort` must make
that clear. Do not silently present self-reported, filtered, or custom-harness scores as official
apples-to-apples results.

## What WebVoyager And BrowseComp Teach Us

Use these two leaderboards as the practical evidence bar.

### WebVoyager

WebVoyager rows are usually full-system browser-agent results. The score can depend on model,
browser runtime, observation mode, retries, evaluator, task filtering, and stale or auth-gated
tasks.

Acceptable WebVoyager-style evidence:

- A paper or technical report that reports the WebVoyager score.
- An official product or research blog post with a clear score table.
- A public repo or eval harness that gives the score and setup.
- A benchmark page from the submitting organization if the score and benchmark are explicit.

Required notes for WebVoyager-like rows:

- Say if the source used the full task set or a filtered subset.
- Say if the source used a different evaluator, manual correction, or custom judge.
- Say if the result is system-level rather than a base-model number.
- Link the repo separately in `repoUrl` only when it is useful for inspecting the system.

Good `notesShort` patterns:

- `602/643 tasks; 41 removed for invalid/auth issues; reported by <source>.`
- `Self-reported score from <repo or harness>; alternate judge score was <value>.`
- `Claude Code orchestrating <agent>; accessibility-tree parsing with visual reasoning.`

Bad `notesShort` patterns:

- `Best browser agent.`
- `SOTA WebVoyager score.`
- `Uses AI to browse websites.`

### BrowseComp

BrowseComp rows often mix base models, models with browsing, and full research-agent systems.
The leaderboard scope is therefore `mixed`. Tool access and attempt policy matter as much as the
raw model name.

Acceptable BrowseComp-style evidence:

- Official OpenAI, Anthropic, Google, model-card, or research-post tables with BrowseComp scores.
- Technical reports that specify the score and context/tool setup.
- Model cards that include BrowseComp tables and distinguish standard, context-managed, swarm,
  pass@1, best-of-N, or tool-augmented variants.

Required notes for BrowseComp-like rows:

- Preserve the tool setup when the source gives it, such as search, fetch, Python, browsing,
  context compaction, context management, or swarm setup.
- Preserve reasoning effort or attempt policy when it is part of the reported row.
- Distinguish base-model rows from agentic search or hosted product workflows.
- If a source reports multiple variants, note the relevant variant rather than flattening them.

Good `notesShort` patterns:

- `Search + Python + Browse; reported in <source> evaluation PDF.`
- `Open-weight model; Agent Swarm score reported by <source>. Context-managed single-agent score is <value>.`
- `Agentic search with web search, web fetch, tool calling, and context compaction.`

Bad `notesShort` patterns:

- `Good at web search.`
- `Open-weight model.`
- `Reported online.`

## Existing Submission Schema

Each file in `src/data/` is an object with one key and an array of rows. See
`src/data/schema.json` for the formal schema.

```json
{
  "webvoyager": [
    {
      "rank": 1,
      "systemName": "Example Agent",
      "organization": "Example Org",
      "scoreDisplay": "91.2%",
      "scoreValue": 91.2,
      "sourceUrl": "https://example.com/evals/webvoyager",
      "repoUrl": "https://github.com/example/example-agent",
      "notesShort": "Full 643-task run; self-reported with GPT-4V judge and one retry.",
      "reportedAt": "2026-04",
      "isNew": true
    }
  ]
}
```

Field standards:

- `rank`: 1-based displayed rank. Use competition ranking for ties. If two rows tie at rank 3,
  the next row is rank 5.
- `systemName`: Public system, model, or agent name from the source.
- `organization`: Organization, lab, author group, or `Academic Research`.
- `scoreDisplay`: Human-readable score exactly as readers should see it, usually with `%`.
- `scoreValue`: Numeric value used for ordering. For `91.2%`, use `91.2`.
- `sourceUrl`: Citation for the score. This is not a homepage unless the homepage itself contains
  the score.
- `repoUrl`: Optional implementation, model-card, or code repository. Use it only when it adds
  inspectable context beyond the score citation.
- `notesShort`: One sentence. Include the setup, evidence level, and caveat most likely to affect
  comparison.
- `reportedAt`: Source publication date. Use `YYYY-MM-DD` when known, otherwise `YYYY-MM`.
- `isNew`: Optional temporary badge for recently added or materially updated rows.

Do not add extra fields unless the TypeScript types and JSON schema are updated in the same PR.

## Ranking Rules

Most tracked benchmarks sort higher scores first. If a benchmark uses lower-is-better metrics,
make that explicit in the leaderboard methodology before adding it.

For ties:

```text
1, 2, 3, 3, 5
```

not:

```text
1, 2, 3, 3, 4
```

When updating a row:

- Do not reorder unrelated rows.
- Do not "clean up" existing names or notes unless the source proves they are wrong.
- If a source revises a score, update `sourceUrl`, `scoreDisplay`, `scoreValue`, `reportedAt`, and
  `notesShort` together.
- If replacing a score with a newer source, mention the old source and reason in the PR summary.

## Notes Quality

`notesShort` is part of the evidence. It should help a reader decide whether adjacent ranks are
comparable.

Include:

- Full-system vs base-model distinction.
- Tool access: browser, search, Python, code execution, APIs, GUI control.
- Judge or evaluator when it differs from the canonical benchmark.
- Task subset, filtered tasks, verified split, dev/test split, or unofficial subset.
- Attempt count, pass@k, best-of-N, context management, or retry policy when reported.
- Self-reporting or independent verification status.

Avoid:

- Marketing language.
- Generic capability claims.
- Repeating the benchmark name without adding context.
- Saying "official" unless the source is the benchmark maintainer or submitting organization in a
  clearly official channel.

## New Leaderboard Acceptance Standard

A new leaderboard should be added only when it has enough public structure to be useful.

Required:

- Clear benchmark name, task definition, and metric.
- Public paper, project page, repository, official leaderboard, or dataset page.
- At least one credible source of results, preferably several.
- Relevance to AI agents, browser agents, computer use, coding agents, tool use, research/search,
  or general agentic model evaluation.
- Enough public task examples to quote 3 exact tasks.
- A stable enough benchmark identity that future contributors can add rows consistently.

Usually reject or defer:

- Private customer evals.
- One-off blog comparisons with no reusable benchmark definition.
- Benchmarks with no public task examples and no public methodology.
- Benchmarks where all results come from a single vague marketing chart.
- Benchmarks that are not agentic and do not help compare systems tracked by this hub.

New benchmarks with only paper-baseline rows can be accepted when the benchmark itself is important
and the source is strong, but the page must say that independent submissions are limited.

## New Leaderboard Implementation Steps

### 1. Add the data file

Create `src/data/<benchmarkKey>.json`:

```json
{
  "benchmarkKey": [
    {
      "rank": 1,
      "systemName": "Example System",
      "organization": "Example Org",
      "scoreDisplay": "75.0%",
      "scoreValue": 75.0,
      "sourceUrl": "https://example.com/paper-or-leaderboard",
      "notesShort": "Official paper baseline; evaluated on the public test split.",
      "reportedAt": "2026-04"
    }
  ]
}
```

Prefer a camelCase key for TypeScript identifiers. The public URL slug should be kebab-case.

### 2. Export the data

Update `src/data/index.ts`:

```ts
export { default as benchmarkKey } from "./benchmarkKey.json" with { type: "json" };
```

### 3. Register the data map

Update `src/lib/benchmark-hub.ts`:

- Import the JSON export.
- Add the key to `BenchmarkMap`.
- Add the key to `benchmarkMap`.
- Use `results: benchmarkResults("benchmarkKey") ?? []` in the page entry.

### 4. Add benchmark metadata

Add a new object to `benchmarkPages`.

Required metadata quality:

- `slug`: kebab-case URL slug.
- `name`: canonical public benchmark name.
- `description`: one SEO-friendly sentence that includes the benchmark name, what it measures, and
  the scoring context.
- `category`: one of `browser_agents`, `computer_use`, `research_search`, `coding`,
  `model_eval`.
- `scope`: `agent`, `model`, or `mixed`.
- `about`: usually 3 paragraphs.
- `methodology`: usually 4 bullets.
- `taskExamples`: exactly 3 public tasks with exact quotes and citations.
- `importantNotes`: caveats readers need before comparing rows.
- `links`: paper, project, repo, official leaderboard, dataset, or other canonical sources.
- `relatedBenchmarks`: 2 or 3 existing slugs.

### 5. Add exact public task examples

Task examples must be real. Do not invent them, paraphrase them, or compress them into fragments.

Each example needs:

```ts
{
  quote: "Exact public task text as written by the benchmark source.",
  sourceLabel: "Benchmark dataset or paper section",
  sourceUrl: "https://source-containing-the-task.example"
}
```

Task example rules:

- Use exact public task text.
- Prefer official dataset files, public config files, benchmark papers, or official docs.
- Do not quote hidden test-set items unless the benchmark authors published them.
- Do not include private credentials, private user data, real personal data, or sensitive secrets.
- If only long public tasks exist, quote the full task when it is the benchmark prompt and the
  source license/format supports it. If that is not acceptable, pick another public example source.
- The citation must point to the file, paper, or page where the task appears.

### 6. Write content that is useful, not long

Every benchmark page should answer:

- What does this benchmark measure?
- Why does this benchmark matter for agents or models?
- What is the scoring metric?
- What setup choices affect comparability?
- Which source should a reader trust first?
- What are examples of real tasks?
- Which related benchmarks should a reader compare next?

Do not add generic disclaimers. Put concrete caveats in `methodology`, `importantNotes`, and
`notesShort`.

## Source Research Workflow For Agents

Agents adding rows should follow this workflow:

1. Open the source URL and find the exact benchmark score.
2. Record the exact system/model name as the source writes it.
3. Record the exact score and metric.
4. Identify setup details: tools, browsing, Python, retries, pass@k, split, judge, context policy,
   task subset, or verification status.
5. Decide whether the row is `agent`, `model`, or belongs on a `mixed` page.
6. Write a one-sentence `notesShort` that captures the most important setup/caveat.
7. Add `repoUrl` only if it is a real implementation/model repository.
8. Re-rank the JSON file.
9. Run validation commands.
10. In the PR summary, cite the source and explain any caveat or ranking change.

If the source does not clearly support the score, do not add the row. Open an issue or add a
research note instead.

## Pull Request Checklist

For submissions:

- [ ] The score has a public `sourceUrl` that directly supports the row.
- [ ] The row uses the canonical system/model name.
- [ ] `scoreDisplay` and `scoreValue` match.
- [ ] `notesShort` includes setup and caveats.
- [ ] Ties and ranks are correct.
- [ ] `reportedAt` reflects the source publication date.
- [ ] `repoUrl` is present only when useful.
- [ ] `npm run update-readme` was run when data changed.
- [ ] `npm run lint` was run.
- [ ] `npm run build` was run.

For new leaderboards:

- [ ] The benchmark meets the acceptance standard.
- [ ] The data file is added and exported.
- [ ] `BenchmarkMap`, `benchmarkMap`, and `benchmarkPages` are updated.
- [ ] The page has 3 exact public task examples with citations.
- [ ] About, methodology, important notes, links, and related benchmarks are complete.
- [ ] The page makes scope clear: `agent`, `model`, or `mixed`.
- [ ] The README was regenerated.
- [ ] `npm run lint` was run.
- [ ] `npm run build` was run.

## Validation Commands

```bash
npm run update-readme
npm run lint
npm run build
```

Use `npm run dev` for manual review when changing visible page content.

For a focused formatting check while drafting docs:

```bash
npx prettier --check README.md CONTRIBUTING.md
```
