ABOUTME: 200-word summary of the WebVoyager AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# WebVoyager

WebVoyager is a multimodal web agent benchmark introduced by He et al. (Tencent) in January 2024. It comprises 643 tasks across 15 popular real-world websites, generated through a semi-automated pipeline and filtered for quality. The benchmark tests end-to-end web navigation using a Selenium-based online browsing environment, where agents interact with live websites rather than static snapshots or simulators. The agent receives both screenshots (with bounding-box overlays on interactive elements) and accessibility tree text as observations, supporting multimodal or text-only configurations.

Evaluation uses a novel GPT-4V-based automatic protocol that examines the agent's final screenshots and responses to judge task success, achieving 85.3% agreement with human judgment. The original WebVoyager agent (GPT-4V-powered) achieves a 59.1% task success rate, significantly outperforming GPT-4 All Tools and text-only baselines. Tasks include time-sensitive queries on sites like Booking and Google Flights, plus 90 supplementary tasks extracted from the GAIA benchmark validation set.

WebVoyager is notable for being one of the first benchmarks to evaluate agents on live, unmodified websites rather than controlled environments, making it a key reference for real-world web agent evaluation. The code and data are released under an Apache 2.0 license.
