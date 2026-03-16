ABOUTME: 200-word summary of the Aider Benchmark AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# Aider Benchmark

The Aider Benchmark is a polyglot coding evaluation developed by Aider AI to measure LLMs' ability to follow instructions and edit code without human intervention. It tests models on 225 challenging Exercism coding exercises spanning six programming languages: C++, Go, Java, JavaScript, Python, and Rust. Unlike benchmarks that test isolated code generation, the Aider Benchmark evaluates models within the context of Aider's AI pair programming tool, measuring practical code editing capabilities including correct use of edit formats like diff and whole-file modes.

Evaluation reports percent correct (exercises where all tests pass) along with cost per run and correct edit format adherence. The benchmark captures how well models follow structured editing instructions, a critical skill for real-world coding assistants. GPT-5 (high) leads the polyglot leaderboard at 88.0% correct with 91.6% edit format compliance at a cost of $29.08 per run. Models are tested with Aider's standard prompting and edit format configurations.

The Aider Benchmark is significant as a practical measure of LLMs for interactive coding assistance, reflecting real-world usage patterns rather than isolated function synthesis. Its polyglot design tests cross-language generalization. Results are published on the Aider leaderboard website, and Aider itself is open source with over 5 million PyPI installs.
