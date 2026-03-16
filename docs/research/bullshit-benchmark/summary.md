ABOUTME: 200-word summary of the BullshitBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# BullshitBench

BullshitBench is a benchmark that measures whether AI models detect nonsense, call it out clearly, and avoid confidently continuing with invalid assumptions. Created by Peter Gostev, it is currently in v2 (updated March 2026) and contains 100 nonsense prompts spanning 5 domain groups: software (40), finance (15), legal (15), medical (15), and physics (15). The prompts employ 13 nonsense techniques including plausible nonexistent frameworks, misapplied mechanisms, nested nonsense, and specificity traps.

Responses are classified into three categories: Clear Pushback (model rejects the broken premise), Partial Challenge (model flags issues but still engages), and Accepted Nonsense (model treats nonsense as valid). Grading uses a 3-judge panel aggregation with Claude Sonnet 4.6, GPT-5.2, and Gemini 3.1 Pro Preview under full panel mode with mean aggregation. The v2 leaderboard currently includes 80 model/reasoning rows with visualizations covering detection rate by model, domain landscape, temporal trends, and whether increased reasoning effort improves performance.

BullshitBench addresses a uniquely practical failure mode: models that confidently answer nonsensical questions rather than pushing back. With 1,100+ GitHub stars, it has gained significant community traction. The benchmark is MIT-licensed with a public interactive viewer and fully automated end-to-end pipeline.
