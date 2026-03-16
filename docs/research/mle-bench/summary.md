ABOUTME: 200-word summary of the MLE-bench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# MLE-bench

MLE-bench is a benchmark created by OpenAI for evaluating AI agents on machine learning engineering tasks, published in October 2024. It curates 75 ML engineering competitions from Kaggle, covering diverse challenges such as training models, preparing datasets, and running experiments across image classification, tabular data, text classification, and audio tasks. Human baselines are established using Kaggle's public leaderboards, and agents are scored by whether their submissions achieve medal-level performance (bronze, silver, or gold).

Evaluation provides agents with 24 hours of runtime on recommended hardware (36 vCPUs, 440GB RAM, one A10 GPU). Scores are reported as "Any Medal %" across three complexity splits: Low (22 competitions), Medium, and High. The original paper found o1-preview with AIDE scaffolding achieved 16.9% medal rate. Current SOTA is Disarray, an ensemble agent using Claude Opus 4.5, Claude Sonnet 4.5, GPT-5.2-Codex, and Gemini-3-Pro-Preview, reaching 77.78% overall with 90.91% on the Low split.

MLE-bench is significant as the primary benchmark for end-to-end ML engineering autonomy, testing not just code generation but experimental design and iteration. A Lite evaluation using only the 22 Low-complexity competitions reduces cost substantially. The code is open source from OpenAI on GitHub.
