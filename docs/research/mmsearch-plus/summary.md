ABOUTME: 200-word summary of the MMSearch AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# MMSearch

MMSearch is a multimodal search benchmark introduced by Jiang et al. and accepted at ICLR 2025. It evaluates the potential of Large Multimodal Models (LMMs) to function as multimodal AI search engines. The benchmark contains 300 manually collected instances spanning 14 subfields, with no overlap with existing LMM training data, ensuring that correct answers can only be obtained through active searching.

Evaluation follows a step-wise strategy across four tasks: requery (reformulating visual queries as text), rerank (ordering search results by relevance), summarization (synthesizing answers from retrieved content), and a complete end-to-end search task. The final score is a weighted combination of all four. The accompanying MMSearch-Engine pipeline enables any LMM to conduct multimodal searches using Google and Google Lens. GPT-4o achieved the best overall performance, outperforming Perplexity Pro in end-to-end search, though all models struggled with the full pipeline complexity.

MMSearch is significant as the first comprehensive benchmark for multimodal search capability, testing whether LMMs can replace traditional search engines for image-and-text queries. The dataset is available on HuggingFace, evaluation code supports VLMEvalKit integration, and a public leaderboard is maintained on the project website. Licensed under standard academic terms.
