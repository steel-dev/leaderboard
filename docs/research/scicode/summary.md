ABOUTME: 200-word summary of the SciCode AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# SciCode

SciCode is a scientist-curated coding benchmark for evaluating language models on realistic scientific research problems, introduced in July 2024 and accepted at NeurIPS 2024 Datasets and Benchmarks Track. It covers 16 subdomains across 5 disciplines: Physics, Mathematics, Material Science, Biology, and Chemistry. The benchmark contains 80 challenging main problems decomposed into 338 subproblems, focusing on numerical methods, system simulation, and scientific calculation. Each problem includes optional scientific background descriptions and gold-standard solutions with test cases annotated by domain scientists.

Evaluation measures both main problem resolve rate and subproblem solve rate. Problems are tested by executing generated code against scientist-annotated numerical test results. In the most realistic setting (no background hints), OpenAI o3-mini-low achieves the highest main problem resolve rate at 10.8% with a 33.3% subproblem rate. Claude 3.5 Sonnet and DeepSeek-R1 each solve 4.6% of main problems. Many models, including Llama-3.1-70B and Mixtral-8x22B, solve 0% of main problems despite partial subproblem success.

SciCode stands out for its extreme difficulty and real-world scientific grounding, going well beyond exam-style coding questions. It is integrated with the inspect_ai framework and OpenCompass for standardized evaluation. The dataset is available on HuggingFace and GitHub.
