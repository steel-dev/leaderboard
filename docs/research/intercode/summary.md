ABOUTME: 200-word summary of the InterCode AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# InterCode

InterCode is a framework and benchmark for evaluating language agents on interactive coding tasks, developed by Princeton NLP and published in 2023. Unlike static code generation benchmarks that use instruction-to-code sequence transduction, InterCode models coding as a reinforcement learning environment where code serves as actions and execution feedback as observations. It provides self-contained Docker environments for safe, reproducible execution across three core interactive coding environments: Bash (using NL2Bash data), SQL (using Spider data), and Python (using MBPP data), with an extensible architecture supporting additional tasks like Capture the Flag puzzles.

Evaluation measures success rate (percentage of tasks where the agent achieves a perfect score of 1.0) through multi-turn interaction, where agents can observe execution results and iteratively refine their code. The framework supports prompting strategies including ReAct and Plan & Solve. Results demonstrate that interactive code generation significantly benefits from execution feedback compared to single-shot approaches, though tasks remain challenging for state-of-the-art LLMs.

InterCode is significant as one of the first benchmarks to formalize interactive coding with execution feedback as a standard RL environment. Its language-agnostic and platform-agnostic design makes it easily extensible. The framework is available as a PyPI package and on GitHub under the MIT license.
