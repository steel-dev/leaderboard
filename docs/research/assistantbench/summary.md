ABOUTME: 200-word summary of the AssistantBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# AssistantBench

AssistantBench is a web agent benchmark introduced by Yoran et al. (Tel Aviv University) in July 2024, focusing on realistic and time-consuming tasks that require extended web navigation. It consists of 214 tasks with automatically evaluable answers, covering diverse scenarios and domains such as monitoring real-estate markets or locating relevant nearby businesses. Tasks are designed to reflect genuine information needs that require browsing multiple pages, aggregating data, and reasoning over results.

Evaluation measures accuracy against ground-truth answers, with both accuracy and precision metrics reported. The benchmark exposes severe limitations in current systems: no model exceeds 26 points in accuracy. Closed-book language models achieve reasonable accuracy but exhibit low precision and tend to hallucinate. State-of-the-art web agents score near zero. The authors introduce SeePlanAct (SPA), a new web agent that significantly outperforms prior agents, and an ensemble of SPA with closed-book models achieves the best overall performance.

AssistantBench is distinctive because it targets complex, multi-step information tasks on the open web rather than constrained self-hosted environments. It is integrated into the BrowserGym ecosystem and maintains a public leaderboard on Hugging Face for community submissions. The dataset is available on Hugging Face under open access.
