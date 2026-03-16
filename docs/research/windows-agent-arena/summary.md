ABOUTME: 200-word summary of the Windows Agent Arena AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# Windows Agent Arena

Windows Agent Arena (WAA) is a scalable Windows OS benchmark for multi-modal desktop AI agents, introduced by Bonatti et al. (Microsoft) in September 2024. It adapts the OSWorld framework to create over 150 diverse Windows tasks across representative domains requiring planning, screen understanding, and tool usage. Agents operate freely within a real Windows 11 environment using the same applications, browsers, and tools available to human users.

Evaluation is execution-based with programmatic validators checking task completion state. The benchmark's Navi agent achieves 19.5% success rate using GPT-4V with OmniParser for screen understanding, compared to 74.5% for unassisted humans. Tasks span normal and hard difficulty modes, where hard mode requires agents to also initialize and set up the task environment themselves. The benchmark supports both local Docker deployment and scalable Azure ML parallelization, completing full evaluations in as little as 20 minutes using 40 parallel VMs.

WAA is significant for bringing reproducible agent evaluation to the Windows ecosystem with cloud-scale parallelization, dramatically reducing evaluation time from days to minutes. It supports custom agents through a simple predict/reset interface and includes OmniParser integration for screen understanding. The benchmark is open source under MIT license.
