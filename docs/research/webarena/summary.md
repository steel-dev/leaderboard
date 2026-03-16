ABOUTME: 200-word summary of the WebArena AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# WebArena

WebArena is a self-hostable web environment for evaluating autonomous agents, introduced by Zhou et al. (CMU) in July 2023. It provides 812 tasks across four fully functional, self-hosted website domains: e-commerce (shopping), social forums (Reddit), collaborative development (GitLab), content management (CMS), plus supplementary tools like a map and Wikipedia. Tasks are diverse, long-horizon, and designed to emulate realistic human web workflows, requiring multi-step navigation, form filling, and information retrieval.

Evaluation is execution-based, measuring functional correctness of task completions against programmatic validators. The original GPT-4-based agent achieved only 14.41% end-to-end task success rate, compared to a human performance baseline of 78.24%, establishing a large gap that has driven substantial follow-up research. The environment follows an OpenAI Gym-style interface, supporting accessibility tree and other observation modes.

WebArena has become one of the most widely adopted web agent benchmarks in the research community, serving as the foundation for VisualWebArena, WebChoreArena, and the BrowserGym ecosystem. Its self-hosted, reproducible design ensures consistent evaluation across research groups. Human trajectory recordings are available for approximately 170 tasks. The codebase is open source, and the benchmark maintains an active public leaderboard.
