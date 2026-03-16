ABOUTME: 200-word summary of the RepoBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# RepoBench

RepoBench is a benchmark for evaluating repository-level code auto-completion systems, introduced by Tianyang Liu, Canwen Xu, and Julian McAuley and accepted at ICLR 2024. It addresses the gap left by single-file code benchmarks by targeting realistic multi-file programming scenarios. The benchmark supports both Python and Java and consists of three interconnected tasks: RepoBench-R (Retrieval) measures the ability to retrieve relevant code snippets from other files as cross-file context, RepoBench-C (Code Completion) evaluates next-line prediction given cross-file and in-file context, and RepoBench-P (Pipeline) combines retrieval and completion end-to-end. Each task is tested under three settings: cross_file_first, cross_file_random, and in_file.

Evaluation uses Exact Match (EM), Edit Similarity (ES), and CodeBLEU (CB) metrics across multiple context-length levels (2k, 4k, 8k, 12k, 16k tokens). The v1.1 dataset, released in February 2024, contains updated code data available on HuggingFace for both Python and Java.

RepoBench is significant because it is one of the first benchmarks to systematically evaluate cross-file code understanding, a capability essential for real-world software development. The benchmark is publicly available with evaluation scripts and datasets under an open repository on GitHub.
