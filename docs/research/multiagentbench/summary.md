ABOUTME: 200-word summary of the MultiAgentBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# MultiAgentBench

MultiAgentBench is a comprehensive benchmark for evaluating LLM-based multi-agent systems across diverse interactive scenarios, introduced in March 2025 (arXiv:2503.01935) by researchers at UIUC. Built on the MARBLE (Multi-Agent Coordination Backbone with LLM Engine) framework, it measures both task completion and the quality of collaboration and competition using novel milestone-based key performance indicators. The framework supports modular agent architectures, shared memory mechanisms, and multiple coordination protocols.

Evaluation covers various coordination topologies including star, chain, tree, and graph structures, alongside strategies like group discussion and cognitive planning. The benchmark tests agents in simulated environments such as Werewolf and other collaborative or competitive scenarios. Results show that gpt-4o-mini achieves the highest average task score, graph topology performs best among coordination protocols in research scenarios, and cognitive planning improves milestone achievement rates by 3%.

MultiAgentBench addresses a significant gap in existing benchmarks, which tend to focus on single-agent tasks or narrow domains and fail to capture multi-agent coordination dynamics. Its modular design allows easy extension with new environments, agents, and LLM integrations. The code, datasets, and Docker-based deployment are publicly available on GitHub, with evaluation metrics built into the framework for reproducible benchmarking.
