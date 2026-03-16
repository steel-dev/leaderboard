ABOUTME: 200-word summary of the macOSWorld AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# macOSWorld

macOSWorld is a multilingual interactive benchmark for GUI agents on macOS, introduced by Yang, Ci, and Shou (National University of Singapore, Show Lab) in June 2025 and accepted at NeurIPS 2025. It comprises 202 tasks across 30 applications (28 macOS-exclusive), covering system apps, productivity tools, media, file management, and multi-app workflows. Tasks are available in five languages: English, Chinese, Arabic, Japanese, and Russian, making it the first multilingual GUI agent benchmark.

Evaluation runs on AWS-hosted macOS instances accessed via VNC, with automated snapshot recovery between tasks and a maximum of 15 dialogue turns per task. Proprietary computer-use agents achieve above 30% success rates, while open-source lightweight models lag below 5%. Multilingual evaluation reveals significant weaknesses, with Arabic tasks showing a 28.8% average degradation compared to English. The benchmark also includes a dedicated safety subset assessing agent resilience under context deception attacks.

macOSWorld fills a critical gap by being the first benchmark targeting macOS, an operating system with distinctive UI patterns and exclusive applications not covered by web, Windows, Linux, or Android benchmarks. It supports GPT-4o, Gemini, Claude, UI-TARS, and ShowUI agents. The code is publicly available on GitHub.
