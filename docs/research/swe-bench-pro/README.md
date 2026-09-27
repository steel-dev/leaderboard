# SWE-Bench Pro evidence

Checked September 27, 2026.

The [Scale public leaderboard](https://labs.scale.com/leaderboard/swe_bench_pro)
reports these point estimates and intervals:

| System                     | Resolve rate | Interval |
| -------------------------- | ------------ | -------- |
| Muse Spark 1.1             | 61.50%       | ±3.10    |
| gpt-5.4 (xHigh)            | 59.10%       | ±3.56    |
| Muse Spark                 | 55.00%       | ±3.60    |
| claude-opus-4-6 (thinking) | 51.90%       | ±3.61    |

All four carry the mini-swe-agent marker. The page specifies 250 turns and
uncapped cost for these rows. Publication dates are absent, so `reportedAt`
is omitted. The snapshot date is not a publication date.

Scale ranks confidence intervals. This hub ranks point estimates.

The repository now documents V2 with 642 tasks. The leaderboard still describes
731 public tasks. The page states this mismatch and does not claim verified V2
scores. Examples quote complete `problem_statement` fields from the official
Hugging Face `v1` configuration, not V2 prompts. Each citation selects the exact
instance identifier. Requirements and interfaces are available in that source.

The four selected rows do not reproduce the full Scale table.
