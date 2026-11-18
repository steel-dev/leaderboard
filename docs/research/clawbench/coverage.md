# ClawBench coverage

Reviewed on September 27, 2026 for issue #21.

The requested benchmark already exists at `/leaderboards/clawbench/`.
Commit `7ea6cdd` added its seven results.
All seven scores match [Table 2 of paper version 1](https://arxiv.org/html/2604.08523v1#S2.T2).
Keep their original reporting date and scores.

The [project leaderboard](https://claw-bench.com) now separates corpus, harness, and scoring rubric.
Its V1 Hermes table lists Opus 4.6 at 61.4% and Sonnet 4.6 at 56.9%.
The existing 33.3% Sonnet result is from the paper's OpenClaw evaluation.
These are distinct runs, not evidence that the stored paper score is wrong.

The [repository](https://github.com/TIGER-AI-Lab/ClawBench) also documents task removals after publication.
Do not substitute the shipping corpus counts for the original evaluation denominator.

## Decision for review

Keep this page as a labeled paper snapshot.
Add later results only with an explicit corpus, harness, rubric, and denominator.
Decide whether those variants need separate pages before adding their scores.
