ABOUTME: 200-word summary of the SOTOPIA AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# SOTOPIA

SOTOPIA is an open-ended environment for evaluating social intelligence in language agents, created by researchers at CMU and presented as a spotlight at ICLR 2024. It contains 90 social scenarios spanning negotiation, collaboration, competition, and exchange, each paired with 10 role-playing agent combinations. Agents interact in multi-turn dialogues pursuing complex social goals while a dedicated evaluation framework, SOTOPIA-Eval, scores performance across seven dimensions drawn from social psychology, economics, and cognitive science, including goal completion, relationship building, believability, knowledge, and financial outcomes.

Evaluation uses both GPT-4 as an automated judge and human annotators, with scores on scales varying by dimension (e.g., 0-10 for goal completion, -5 to 5 for relationships). A challenging subset, SOTOPIA-hard, comprises 14 scenarios where all models struggle. On this subset, GPT-4 achieves significantly lower goal completion than humans and fails to demonstrate social commonsense reasoning and strategic communication. GPT-4 automated judgments correlate well with human ratings on several criteria.

SOTOPIA stands out as one of the few benchmarks targeting social intelligence rather than task completion or coding ability. The full platform, dataset, and evaluation code are publicly available on GitHub and Hugging Face under open-source licensing, with an interactive demo at sotopia.world.
