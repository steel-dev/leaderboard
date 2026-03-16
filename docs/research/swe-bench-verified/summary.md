ABOUTME: 200-word summary of the SWE-bench Verified AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# SWE-bench Verified

SWE-bench Verified is a curated subset of the SWE-bench benchmark, introduced in August 2024 through a collaboration between Princeton NLP and OpenAI Preparedness. It contains 500 software engineering problems drawn from the original SWE-bench dataset of 2,294 real GitHub issues across 12 popular Python repositories. Each problem in the Verified subset has been confirmed as solvable by professional software engineers, addressing concerns about ambiguous or unsolvable tasks in the full dataset. Given a codebase and an issue description, a language model must generate a patch that resolves the problem. Tasks frequently require coordinating changes across multiple functions, classes, and files.

Evaluation uses a fully containerized Docker-based harness for reproducible test execution. Each generated patch is applied to the repository and validated against the existing test suite. The original SWE-bench paper (ICLR 2024 Oral) reported Claude 2 solving just 1.96% of issues; modern agent systems now resolve substantially higher percentages on the Verified split.

SWE-bench Verified has become the primary leaderboard for measuring AI coding agents' real-world software engineering capabilities, adopted by virtually all frontier labs. The benchmark, datasets, and evaluation code are available under the MIT license on GitHub and HuggingFace.
