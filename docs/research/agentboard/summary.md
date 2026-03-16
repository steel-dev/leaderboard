ABOUTME: 200-word summary of the AgentBoard AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# AgentBoard

AgentBoard is a comprehensive evaluation framework for multi-turn LLM agents introduced by Chang Ma et al. in January 2024, accepted at LLMAgents @ ICLR 2024. It encompasses 9 diverse tasks across 4 categories: Embodied AI (AlfWorld, ScienceWorld, BabyAI), Game (Jericho, PDDL), Web (WebShop, WebArena), and Tool (Tool-Query, Tool-Operation). All tasks feature partially-observable environments requiring multi-round interaction, with evaluation spanning up to 15,000 inference rounds per model.

AgentBoard introduces a fine-grained progress rate metric that captures incremental advancements beyond binary success/failure. The evaluation toolkit provides multi-faceted analysis including grounding accuracy, performance breakdown for hard and easy examples, long-range interaction quality, sub-skill proficiency, and trajectory visualization via Weights & Biases integration. The framework supports 12 models out of the box including GPT-4, Claude 2, and open-source models like DeepSeek-67b and Llama2-70b, all evaluated using a simple reflex agent with act-only prompting.

AgentBoard stands out for its emphasis on analytical rather than purely aggregate evaluation, providing researchers with interpretable insights into agent behavior and failure modes. The partially-observable environment design tests genuine world-modeling ability rather than pattern matching. The code is released under Apache 2.0 and the dataset under GPL 2.0.
