# ToolBench evidence

Verified on 2026-09-27. This page preserves the maintainer tracker snapshot
from 2023-09-29. It does not claim current model coverage.

## Scores

[Canonical CSV](https://github.com/OpenBMB/ToolBench/blob/a58986860c63de22be55d7b88125366c4f2607f6/toolbench/tooleval/results/leaderboard%23%23%23default_evalset%23%23%23tooleval_gpt-3.5-turbo_normalized%23%23%23ChatGPT-DFSDT.csv) contains these aggregate `WinRate` values:

- GPT4-DFSDT: 70.4.
- ChatGPT-DFSDT: 64.3.
- ToolLLaMA-DFSDT: 60.

The pinned commit is `a58986860c63de22be55d7b88125366c4f2607f6`. The official tracker maps its
ChatGPT-ReACT reference selector to this CSV despite the filename.
The aggregate column differs from the simple mean of subset columns.
Preserve the published column and disclose both inconsistencies.

## Metric and setup

[ToolEval](https://github.com/OpenBMB/ToolBench/tree/a58986860c63de22be55d7b88125366c4f2607f6/toolbench/tooleval)
defines preference win rate separately from pass rate. The CSV identifies
`default_evalset` and `tooleval_gpt-3.5-turbo_normalized`. The benchmark
uses RapidAPI tools. StableToolBench variants are excluded.

## Exact tasks

The page copies `query` fields for public G1 query IDs 1, 2, and 3
from the pinned `data_example/instruction/G1_query.json` file.
