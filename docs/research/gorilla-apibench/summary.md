ABOUTME: 200-word summary of the Gorilla APIBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# Gorilla APIBench

Gorilla APIBench is a benchmark for evaluating LLMs on API call generation, introduced by Shishir G. Patil, Tianjun Zhang, Xin Wang, and Joseph E. Gonzalez at UC Berkeley in May 2023. It comprises APIs from three major ML hubs: HuggingFace, TorchHub, and TensorHub, totaling over 1,600 API entries. Given a natural language query, models must generate semantically and syntactically correct API calls, including accurate function names, parameters, and argument values. The benchmark specifically targets hallucination in API usage, a key failure mode where models fabricate non-existent APIs or incorrect parameters.

Evaluation measures functional correctness of generated API calls, comparing predicted calls against ground truth. Gorilla, a fine-tuned LLaMA-based model, surpasses GPT-4 on API call accuracy. When combined with a document retriever, Gorilla demonstrates strong adaptation to test-time documentation changes and substantially reduces hallucination compared to direct prompting of base LLMs.

The project has grown into a broader ecosystem including the Berkeley Function Calling Leaderboard (BFCL), which has evolved through versions V1 through V4 with multi-turn, multi-step, and agentic evaluations. Gorilla and APIBench are Apache 2.0 licensed, and the project has served approximately 500,000 requests since launch, making it one of the most widely adopted function-calling evaluation frameworks.
