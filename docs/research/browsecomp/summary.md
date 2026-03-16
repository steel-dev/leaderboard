ABOUTME: 200-word summary of the BrowseComp AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# BrowseComp

BrowseComp is a benchmark for evaluating web browsing agents, introduced by OpenAI in April 2025. It contains 1,266 questions that require agents to persistently navigate the internet to find hard-to-find, entangled information. The benchmark is designed to be simple in evaluation but challenging in execution, analogous to how programming competitions test coding ability. Questions demand creative and persistent web search strategies rather than surface-level retrieval.

Evaluation is straightforward: predicted answers are short strings that can be easily verified against reference answers, avoiding the complexity of judging long-form responses or resolving ambiguous queries. The authors acknowledge that BrowseComp intentionally sidesteps challenges like generating lengthy answers or handling ambiguity, focusing purely on information discovery capability. The benchmark is hosted in OpenAI's simple-evals repository on GitHub.

BrowseComp fills an important gap in agent evaluation by specifically testing the persistence and creativity required for real-world web research, where information is often buried deep within websites or requires synthesizing clues across multiple sources. Unlike navigation-focused benchmarks, it emphasizes the intellectual challenge of knowing where and how to look. The benchmark is publicly available for research use.
