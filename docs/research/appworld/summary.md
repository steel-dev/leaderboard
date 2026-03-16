ABOUTME: 200-word summary of the AppWorld AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# AppWorld

AppWorld is a benchmark for interactive coding agents introduced by Stony Brook NLP, winning the ACL 2024 Best Resource Paper award. It comprises the AppWorld Engine, a high-quality execution environment built with 60,000 lines of code simulating 9 day-to-day apps (notes, messaging, shopping, etc.) operable via 457 APIs and populated with realistic digital activities for approximately 100 fictitious users. The AppWorld Benchmark contains 750 natural, diverse, and challenging tasks requiring agents to generate rich, interactive code with complex control flow across multiple apps.

Evaluation uses robust programmatic state-based unit tests (40,000 lines of test code) that allow different valid solution paths while checking for collateral damage from unexpected state changes. Tasks are split into "normal" and "challenge" difficulty levels. GPT-4o, the strongest model at release, solves approximately 49% of normal tasks and 30% of challenge tasks, with other models solving at least 16 percentage points fewer.

AppWorld is significant because it moves beyond simple sequential API-call benchmarks to test genuine multi-app orchestration with iterative environment interaction. Its controllable simulated world enables reproducible evaluation without real-world side effects, while the state-based testing framework ensures evaluation integrity. The project is publicly available at appworld.dev.
