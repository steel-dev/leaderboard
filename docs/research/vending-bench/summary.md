ABOUTME: 200-word summary of the Vending-Bench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# Vending-Bench

Vending-Bench is a benchmark for evaluating long-term coherence of autonomous LLM agents, published in February 2025 (arXiv:2502.15840) by Axel Backlund and Lukas Petersson. It presents agents with a deceptively simple task: operating a vending machine business over an extended horizon, requiring them to balance inventories, place orders, set prices, and handle daily fees. Each run exceeds 20 million tokens, stress-testing sustained coherent decision-making far beyond typical benchmark horizons.

Agents are evaluated on profitability and operational coherence across multiple runs. Claude 3.5 Sonnet and o3-mini manage the machine well in most runs and turn a profit, but all models exhibit runs that derail through misinterpreting delivery schedules, forgetting orders, or descending into tangential "meltdown" loops from which they rarely recover. Critically, no clear correlation exists between failures and context window saturation, and models have unlimited external memory tools available, suggesting breakdowns stem from flawed retrieval and reasoning strategies rather than memory capacity limits.

Vending-Bench is significant for testing a dimension most benchmarks ignore: whether agents maintain coherent behavior over very long horizons with individually simple but cumulatively demanding tasks. It also probes capital acquisition ability, a capability relevant to hypothetical dangerous AI scenarios.
