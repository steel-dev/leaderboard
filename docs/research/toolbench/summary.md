ABOUTME: 200-word summary of the ToolBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# ToolBench

ToolBench is a large-scale instruction-tuning and evaluation benchmark for tool-use capabilities in LLMs, created by Yujia Qin et al. at OpenBMB and released in July 2023. It comprises 16,464 real-world RESTful APIs spanning 49 categories collected from RapidAPI Hub, with 126,486 instruction instances and 469,585 actual API calls averaging 4.0 reasoning traces per instance. The benchmark covers single-tool and multi-tool scenarios (intra-category and intra-collection). A novel depth-first search-based decision tree (DFSDT) algorithm is used for solution path annotation, enabling LLMs to evaluate multiple reasoning traces.

Evaluation is performed through ToolEval, an automatic evaluator using two metrics: Pass Rate (proportion of successfully completed instructions) and Win Rate (preference comparison against a reference model via ChatGPT-as-judge, with 87.1% human agreement on pass rate and 80.3% on win rate). GPT-4 with DFSDT achieves the highest average pass rate of 71.1% and win rate of 70.4%. ToolLLaMA-2-7b-v2, fine-tuned on ToolBench, reaches 66.7% pass rate, matching ChatGPT-level performance.

ToolBench is the most comprehensive real-world API tool-use benchmark available, serving as both training data and evaluation framework. It is distributed under Apache License 2.0 with full data, models, and evaluation scripts publicly available.
