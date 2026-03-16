ABOUTME: 200-word summary of the BrowserGym AI agent benchmark ecosystem.
ABOUTME: Synthesized from paper abstract and GitHub README.

# BrowserGym

BrowserGym is a unified, gym-like environment for web agent research developed by ServiceNow and collaborators, published in Transactions on Machine Learning Research in 2025. Rather than a single benchmark, it provides a standardized framework with well-defined observation and action spaces that integrates multiple existing benchmarks: MiniWoB, WebArena, VisualWebArena, WorkArena, AssistantBench, WebLINX, and OpenApps. The ecosystem includes AgentLab, a complementary framework for agent creation, testing, and parallel experiment execution.

The first large-scale multi-benchmark experiment conducted through BrowserGym compared 6 state-of-the-art LLMs across 6 benchmarks. Key findings include Claude-3.5-Sonnet leading on almost all benchmarks except vision-related tasks where GPT-4o is superior, and a large performance gap between OpenAI and Anthropic models. New benchmarks can be integrated by inheriting a single AbstractBrowserTask class. The system uses Playwright for browser automation and supports both text and multimodal observations.

BrowserGym addresses critical fragmentation in web agent evaluation by providing consistent methodology and a unified leaderboard on Hugging Face. It has become the de facto standard infrastructure for web agent research, enabling reproducible comparisons across benchmarks that previously used incompatible evaluation setups. The framework is open source under an Apache 2.0 license and installable via pip.
