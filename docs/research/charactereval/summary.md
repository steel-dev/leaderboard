ABOUTME: 200-word summary of the CharacterEval AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# CharacterEval

CharacterEval is a Chinese-language benchmark for evaluating Role-Playing Conversational Agents (RPCAs), published in January 2024 (arXiv:2401.01275). It consists of 1,785 multi-turn role-playing dialogues containing 23,020 examples and featuring 77 characters derived from Chinese novels and scripts. The dataset was constructed through initial dialogue extraction via GPT-4 followed by rigorous human-led quality control, with in-depth character profiles sourced from Baidu Baike.

Evaluation employs a multifaceted approach encompassing thirteen targeted metrics across four dimensions. A specialized character-based reward model, CharacterRM (built on Baichuan), was trained on manual annotations from 12 annotators divided into two groups with disagreement resolution through discussion. CharacterRM achieves a Pearson correlation with human judgments that significantly surpasses GPT-4's correlation. Experiments show that Chinese LLMs exhibit more promising capabilities than GPT-4 in Chinese role-playing conversation. Reproduction results are provided for five open-source models: ChatGLM-6B, Baichuan-7B-Chat, XVERSE-7B-Chat, InternLM-7B-Chat, and Qwen-7B-Chat.

CharacterEval is notable as one of the few benchmarks dedicated to role-playing agent evaluation and the primary benchmark for Chinese-language character consistency assessment. The source code, dataset, and reward model are publicly available on GitHub and Hugging Face, enabling standardized evaluation of RPCAs.
