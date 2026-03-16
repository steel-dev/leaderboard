ABOUTME: 200-word summary of the WebBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# WebBench

WebBench is a task-oriented benchmark for browser agents created by Halluminate in partnership with Skyvern, released in May 2025. It contains 2,454 tasks across 452 live websites selected from the global top-1000 by traffic, significantly expanding on WebVoyager's original 15 sites and 642 tasks. Tasks are split into READ (64.4%), CREATE (20.9%), UPDATE (7.1%), DELETE (6.1%), and FILE_MANIPULATION (1.5%) categories, with explicit coverage of authentication, CAPTCHA solving, form filling, and file download challenges that are underrepresented in prior benchmarks.

Evaluation uses an auto-judge to assess task completion on live websites in real time. The benchmark differentiates between read-only information retrieval and write operations that modify state, making it one of the few benchmarks to systematically test agents on stateful web interactions. The full dataset of 5,750 tasks is available on HuggingFace, with 2,454 forming the curated evaluation set.

WebBench stands out for its focus on adversarial real-world web conditions including pop-ups, DOM changes, and two-factor authentication hurdles. It maintains an official leaderboard at webbench.ai and supports systematic comparison of agent architectures, ablation studies, and rapid prototyping under realistic web scenarios. The dataset is publicly available.
