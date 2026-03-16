ABOUTME: 200-word summary of the API-Bank AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# API-Bank

API-Bank is a comprehensive benchmark for evaluating tool-augmented LLMs, introduced by Minghao Li et al. at Alibaba DAMO ConvAI and published in April 2023. It provides a runnable evaluation system consisting of 73 API tools across diverse domains, with 314 tool-use dialogues containing 753 API calls for testing. The benchmark assesses three core capabilities: API call planning (deciding which APIs to use), API retrieval (finding the right API from a large pool), and API invocation (generating correct calls with proper arguments). A larger training set of 1,888 tool-use dialogues drawn from 2,138 APIs spanning 1,000 distinct domains is also provided.

Evaluation measures correctness across the three capability levels. Experimental results show that GPT-3.5 improves over GPT-3 in tool utilization, while GPT-4 excels particularly in planning. The authors train Lynx, a tool-augmented LLM initialized from Alpaca, which surpasses Alpaca by more than 26 percentage points and approaches GPT-3.5 effectiveness. Error analysis reveals that accurate argument generation and multi-step planning remain key challenges.

API-Bank is significant as one of the earliest comprehensive benchmarks specifically targeting LLM tool-use capabilities, providing both evaluation and training infrastructure. It is released under the MIT license through the DAMO-ConvAI repository.
