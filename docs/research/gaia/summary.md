ABOUTME: 200-word summary of the GAIA AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# GAIA

GAIA (General AI Assistants) is a benchmark designed to evaluate general-purpose AI assistants on real-world questions requiring reasoning, multi-modality handling, web browsing, and tool-use proficiency, introduced in November 2023. It contains 466 questions with definitive answers, each conceptually simple for humans but challenging for AI systems. The benchmark deliberately targets tasks where average humans excel rather than following the trend of testing on expert-level professional knowledge. Of the 466 questions, 300 have answers withheld to power a public leaderboard.

Evaluation is straightforward: each question has a single correct answer, enabling exact-match scoring. The benchmark reveals a stark performance gap: human respondents achieve 92% accuracy while GPT-4 with plugins scores only 15%. This disparity is notable because it contrasts with recent trends where LLMs outperform humans on specialized tasks in domains like law and chemistry. Questions span three difficulty levels, with Level 1 being the simplest and Level 3 requiring the most complex multi-step reasoning and tool use.

GAIA is significant because it reframes AGI evaluation around robustness on everyday tasks rather than superhuman performance on narrow domains. Its philosophy posits that matching average human performance on such practical questions is a meaningful milestone for artificial general intelligence. The benchmark and leaderboard are publicly available on HuggingFace.
