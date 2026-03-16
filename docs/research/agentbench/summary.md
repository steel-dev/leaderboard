ABOUTME: 200-word summary of the AgentBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# AgentBench

AgentBench is the first multi-dimensional benchmark designed to evaluate LLMs as autonomous agents across diverse interactive environments, introduced by Xiao Liu et al. at Tsinghua University in August 2023. It encompasses 8 distinct environments: Operating System (OS), Database (DB), Knowledge Graph (KG), Digital Card Game (DCG), Lateral Thinking Puzzles (LTP), plus three recompiled from existing datasets: House-Holding (ALFWorld), Web Shopping (WebShop), and Web Browsing (Mind2Web). The benchmark requires multi-turn interaction, with agents generating approximately 4,000 actions on the dev set and 13,000 on the test set.

Evaluation measures task completion rates across all eight environments, with scores weighted into an overall performance metric. Results show that top commercial LLMs demonstrate strong agent capabilities, but a significant performance gap exists between them and open-source models up to 70B parameters. The main failure modes identified are poor long-term reasoning, weak decision-making, and insufficient instruction following. A newer Function Calling (FC) version adds containerized deployment for five core tasks.

AgentBench is widely regarded as a foundational agent evaluation framework due to its breadth across environment types and its systematic analysis of failure patterns. The benchmark, datasets, environments, and integrated evaluation package are publicly available on GitHub with an active leaderboard.
