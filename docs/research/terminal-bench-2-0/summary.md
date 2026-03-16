ABOUTME: 200-word summary of the Terminal-Bench 2.0 AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# Terminal-Bench 2.0

Terminal-Bench 2.0 is a benchmark developed by the Laude Institute for measuring the capabilities of AI agents and language models to perform valuable work in containerized terminal environments. Released in 2025 as a successor to the original Terminal-Bench, version 2.0 features harder tasks designed to test frontier model capabilities. Tasks span diverse domains including protein assembly for synthesis, debugging asynchronous code, and resolving security vulnerabilities. Each task undergoes several hours of human and LM-assisted validation to ensure it is solvable, realistic, and well-specified.

Evaluation runs through Harbor, the Laude Institute's framework for agentic evals and RL rollouts, which executes tasks in Docker containers locally or in the cloud. Agents interact with containerized environments via terminal commands, and oracle solutions are provided for validation. The benchmark supports multiple agent backends including Claude Code and custom agents via the BaseAgent interface.

Terminal-Bench is used by virtually all frontier labs as a measure of practical agent capability in realistic computing environments. The emphasis on task quality and containerized reproducibility distinguishes it from simpler code generation benchmarks. TB 2.0 tasks and the Harbor evaluation framework are open source on GitHub.
