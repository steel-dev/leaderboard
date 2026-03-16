ABOUTME: 200-word summary of the WorkArena AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# WorkArena

WorkArena is a browser-based benchmark for evaluating web agents on enterprise knowledge work tasks, introduced by Drouin et al. (ServiceNow Research) at ICML 2024. WorkArena-L1 includes 19,912 unique task instances drawn from 33 atomic tasks covering core ServiceNow platform components: knowledge bases, forms, service catalogs, lists, menus, and dashboards. WorkArena++ (NeurIPS 2024) extends this with 682 compositional tasks that combine atomic operations into realistic multi-step workflows testing planning, reasoning, and memorization abilities.

Evaluation measures binary task success through programmatic validators built into each task, with oracle (cheat) functions available for verification. The benchmark reveals significant performance gaps between open and closed-source LLMs, with even GPT-4-vision-based agents falling well short of full automation on atomic tasks. WorkArena++ compositional tasks prove substantially harder, requiring agents to chain multiple operations across different UI components.

WorkArena is distinctive for targeting enterprise software automation rather than general web browsing, using the widely-deployed ServiceNow platform as its foundation. It is tightly integrated with BrowserGym for standardized evaluation and AgentLab for parallel experiment execution, reporting results on a unified Hugging Face leaderboard. Access requires ServiceNow instances provided through a gated Hugging Face repository. The benchmark is installable via pip as browsergym-workarena.
