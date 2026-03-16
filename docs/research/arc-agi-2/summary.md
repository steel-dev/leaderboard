ABOUTME: 200-word summary of the ARC-AGI-2 AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# ARC-AGI-2

ARC-AGI-2 is the second edition of the Abstraction and Reasoning Corpus, launched in March 2025 by the ARC Prize Foundation. It contains 1,000 public training tasks and 120 public evaluation tasks, plus semi-private and private evaluation sets of 120 tasks each. Tasks present input-output grid pairs using integers 0-9 on grids up to 30x30, requiring test-takers to infer transformation rules from demonstration pairs and produce exact output grids. Each evaluation task has been solved by at least two humans in two attempts or fewer in controlled testing with over 400 participants.

Scoring uses pass@2 measurement, meaning two attempts per test input. Average human performance on evaluation tasks is 60%, while frontier AI reasoning systems score in the single digits. OpenAI's o3-preview-low achieves roughly 4%, o1-pro scores about 1%, and pure LLMs like GPT-4.5 score 0%. The benchmark also tracks cost efficiency per task, with human cost at approximately $17 per task versus $200+ for frontier AI systems.

ARC-AGI-2 is significant because it spotlights the gap between human fluid intelligence and AI capabilities on tasks requiring symbolic interpretation, compositional reasoning, and contextual rule application. The ARC Prize 2025 competition offers $1,000,000 in prizes and mandates open-source solutions.
