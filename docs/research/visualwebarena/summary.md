ABOUTME: 200-word summary of the VisualWebArena AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# VisualWebArena

VisualWebArena is a multimodal web agent benchmark introduced by Koh et al. (CMU) in January 2024. It extends WebArena with 910 visually grounded tasks that require agents to process both visual and textual information to complete web-based objectives. Tasks span three self-hosted environments: Classifieds, Shopping, and Reddit, plus the original WebArena sites (Wikipedia, GitLab, CMS, and map). Agents must interpret images embedded in web pages, understand visual layouts, and act on instructions that reference visual content.

Evaluation uses execution-based functional correctness checks inherited from WebArena's reproducible framework. The proposed GPT-4V + Set-of-Mark (SoM) agent achieves the best baseline performance, though scores remain low, demonstrating significant gaps in multimodal web understanding. Human evaluators achieved approximately 89% success on a 233-task subset, establishing a strong upper bound. Full agent trajectories for all 910 tasks are publicly available for analysis.

VisualWebArena fills a critical gap by moving beyond text-only web agent evaluation, demonstrating that visual grounding is essential for many realistic web tasks. It is fully integrated into the BrowserGym ecosystem and shares infrastructure with WebArena, enabling direct comparisons. The code, data, and environments are publicly released with an Amazon Machine Image for easy deployment.
