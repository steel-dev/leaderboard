ABOUTME: 200-word summary of the HumanEval+ AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# HumanEval+

HumanEval+ is a rigorous code synthesis evaluation benchmark created by researchers at UIUC, published at NeurIPS 2023. It extends OpenAI's original HumanEval benchmark with 80x more test cases per problem, generated through LLM-based and mutation-based automatic test input generation via the EvalPlus framework. The original HumanEval contains 164 Python programming problems with docstring specifications; HumanEval+ augments these with substantially more tests to catch functionally incorrect code that passes the sparse original test suite. The EvalPlus framework also includes MBPP+ (35x more tests than MBPP) and EvalPerf for code efficiency evaluation.

Evaluation measures pass@k, where generated code must pass all test cases for a problem. HumanEval+ reduces reported pass@1 scores by 19.3-28.9% compared to the original HumanEval, revealing that many previously "correct" solutions are actually fragile. The framework supports execution in sandboxed Docker containers across multiple LLM backends including OpenAI, Anthropic, Google Gemini, vLLM, and HuggingFace Transformers. Notably, HumanEval+ exposed mis-rankings where WizardCoder and Phind-CodeLlama outperform ChatGPT, a result invisible on the original benchmark.

HumanEval+ is widely adopted by major LLM teams including Meta Llama, Qwen, DeepSeek-Coder, StarCoder2, and Snowflake Arctic. The EvalPlus leaderboard tracks current model rankings. All tools, datasets, and generated code are open source under permissive licensing.
