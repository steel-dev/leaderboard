ABOUTME: 200-word summary of the WebShop AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# WebShop

WebShop is a simulated e-commerce web environment introduced by Yao et al. (Princeton NLP) in July 2022. It contains 1.18 million real-world products scraped from Amazon and 12,087 crowd-sourced text instructions describing product requirements. Agents must navigate search pages, product listings, and item detail pages to find, customize, and purchase products matching natural language specifications. The environment supports two observation modes: full HTML rendering and a simplified text mode compatible with the OpenAI Gym interface.

Evaluation measures task success rate based on whether the purchased product matches the instruction requirements, using attribute-level scoring. Over 1,600 human demonstrations were collected for training and analysis. Human experts achieve a 59% task success rate, while the best trained model (combining imitation learning and reinforcement learning) reaches 29%, and rule-based heuristics score only 9.6%. The benchmark also demonstrated non-trivial sim-to-real transfer to Amazon.com and eBay.com.

WebShop is one of the earliest large-scale web interaction benchmarks and remains influential for its scalable design using real product data. It provides challenges in compositional instruction understanding, query formulation, noisy text comprehension, and strategic exploration. A Hugging Face demo is available for interactive testing. The code is released under a Princeton license.
