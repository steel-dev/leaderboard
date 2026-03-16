ABOUTME: 200-word summary of the LiveBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# LiveBench

LiveBench is a contamination-resistant LLM benchmark introduced by Colin White et al. in June 2024, appearing as a Spotlight Paper at ICLR 2025. It contains 18 diverse tasks across 6 categories: math, coding, reasoning, language, instruction following, and data analysis. Questions are derived from recently released math competitions, arXiv papers, news articles, IMDb synopses, and datasets, and are updated monthly to limit test set contamination. All questions have verifiable, objective ground-truth answers scored automatically without LLM judges.

Scoring uses task-specific automated evaluation against objective answers. LiveBench is intentionally difficult, with top models achieving below 70% accuracy at launch. The benchmark includes harder, contamination-limited versions of tasks from established benchmarks like Big-Bench Hard, AMPS, and IFEval. New tasks and harder versions are released over time to maintain differentiation as models improve. The latest release as of writing is 2025-04-25.

LiveBench addresses two critical problems in LLM evaluation: test set contamination and unreliable LLM-as-judge scoring. By releasing fresh questions monthly from recent information sources and using only objective ground-truth evaluation, it provides a more trustworthy signal of model capability. All questions, code, and model answers are publicly released under an open license, with community contributions encouraged.
