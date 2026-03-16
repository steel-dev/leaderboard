ABOUTME: 200-word summary of the WebChoreArena AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# WebChoreArena

WebChoreArena is a web agent benchmark introduced by Miyai et al. (University of Tokyo) in May 2025, designed to evaluate agents on tedious, labor-intensive tasks that extend beyond general web browsing. It comprises 532 carefully curated tasks built on top of the four WebArena simulation environments (Shopping, Admin/CMS, Reddit, GitLab), plus cross-site tasks. The benchmark systematically integrates three challenge categories: Massive Memory tasks requiring retrieval of large amounts of observed information, Calculation tasks demanding precise mathematical reasoning, and Long-Term Memory tasks requiring retention across multiple webpages.

Evaluation uses WebArena's execution-based framework, measuring task success rate across environments. The best-performing agent, Gemini 2.5 Pro via BrowserGym, achieves 44.9% overall success, while Claude 3.7 Sonnet reaches 23.1-23.5% and GPT-4o scores only 2.6-6.8%. Cross-site tasks prove especially difficult, with most models scoring under 10%. Results are reported for both AgentOccam and BrowserGym agent frameworks.

WebChoreArena fills an important gap by testing whether agents can handle the tedious, complex tasks that humans prefer to delegate. Its full reproducibility and direct compatibility with WebArena infrastructure enable fair comparisons and clear measurement of progress. The dataset and code are publicly available on GitHub and Kaggle.
