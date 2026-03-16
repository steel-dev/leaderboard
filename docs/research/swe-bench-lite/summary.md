ABOUTME: 200-word summary of the SWE-bench Lite AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# SWE-bench Lite

SWE-bench Lite is a lightweight subset of the SWE-bench benchmark, created by Princeton NLP to provide a more accessible evaluation of language models on real-world software engineering tasks. Drawn from the full SWE-bench dataset of 2,294 GitHub issues across 12 popular Python repositories, Lite selects a representative subset of problems that are less resource-intensive to evaluate while still testing meaningful code generation capabilities. Each task presents a model with a codebase and an issue description, requiring it to produce a patch that resolves the described problem, often involving changes across multiple functions, classes, and files.

Evaluation runs through the same Docker-based containerized harness as the full SWE-bench, applying generated patches and running repository test suites to verify correctness. When the benchmark was first introduced alongside the ICLR 2024 paper, Claude 2 achieved only 1.96% on the full set. SWE-bench Lite serves as a cost-effective proxy for the full benchmark, enabling faster iteration during agent development.

SWE-bench Lite remains widely used as a quick evaluation target for coding agent research and development. It is available under the MIT license on GitHub and HuggingFace, with the same tooling and evaluation infrastructure as the full SWE-bench.
