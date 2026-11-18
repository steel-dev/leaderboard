# GPQA Diamond evidence

Checked September 27, 2026.

[OpenAI's September 12, 2024 report, Appendix A](https://openai.com/index/learning-to-reason-with-llms/#appendix-a)
reports GPQA Diamond pass@1 scores of 77.3% for o1, 73.3% for o1-preview,
and 50.6% for GPT-4o. The table separately reports consensus@64. Those consensus
scores are excluded. The report uses maximal test-time compute for o1 unless
specified otherwise. The o1 row names the historical research model.

This is a historical baseline table from one reporting organization. It does
not claim to rank all current models. There is no official submission leaderboard
linked by the benchmark authors.

The authors publish `dataset.zip` in their repository. Its public password is
in their README. The archive contains `dataset/gpqa_diamond.csv` and a CC BY 4.0
license attributed to Irving David Rein. The examples reproduce three questions
and their four choices. Choice order changes; answer labels are omitted.
The source is pinned to commit `56686c06f5e19865c153de0fdb11be3890014df7`.

The archive uses a password and a canary string to discourage accidental
training exposure. The page explains this. No private or unpublished questions
are used.
