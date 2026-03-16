ABOUTME: 200-word summary of the FORTRESS AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# FORTRESS

FORTRESS (Frontier Risk Evaluation for National Security and Public Safety) is a safety benchmark created by Scale AI to evaluate the safeguards of frontier LLMs against national security and public safety risks. Published in June 2025 (arXiv:2506.14922), it contains over 1,010 expert-crafted adversarial prompts (500 in the public dataset) across three domains: Chemical, Biological, Radiological, Nuclear and Explosive (CBRNE); Political Violence and Terrorism; and Criminal and Financial Illicit Activities, spanning 10 subcategories.

Each adversarial prompt has a unique evaluation rubric of 4-7 objective binary questions and a corresponding benign version to measure over-refusal. Two key metrics drive evaluation: Average Risk Score (ARS), measuring propensity to generate harmful content, and Over-Refusal Score (ORS), measuring tendency to refuse benign requests. Among 26 models evaluated, Claude 3.5 Sonnet shows a low ARS (14.09/100) but the highest ORS (21.8/100), while Gemini 2.5 Pro exhibits low over-refusal (1.4) but high risk (66.29).

FORTRESS is distinctive for testing safeguard robustness rather than raw capability, and for quantifying the safety-usability tradeoff through paired adversarial and benign prompts. The public dataset is available on Hugging Face, with a live leaderboard hosted on Scale AI's SEAL platform.
