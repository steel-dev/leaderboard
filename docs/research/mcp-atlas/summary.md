ABOUTME: 200-word summary of the MCP-Atlas AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# MCP-Atlas

MCP-Atlas is a large-scale benchmark for evaluating AI models' tool-use competency using real Model Context Protocol (MCP) servers, created by Scale AI in 2025. It spans 36 MCP servers covering categories including search, code execution, databases, APIs, and productivity tools, exposing 307 distinct tools in total. The benchmark includes 500 evaluation prompts with ground-truth expected tool calls and answers. All servers are real-world open-source MCP implementations with pinned versions for reproducibility, deployed in a Dockerized environment.

Evaluation uses an LLM-as-judge methodology (defaulting to Gemini 2.5 Pro) that produces pass rate and coverage rate metrics. Coverage scores measure how well an agent's response satisfies ground-truth claims, with a default pass threshold of 0.75. Tasks often require chaining multiple MCP servers, and approximately 18% of tasks can be solved with the 20 servers that require no API keys, while the full benchmark requires credentials for services like Exa, Airtable, MongoDB, and Brave Search.

MCP-Atlas is the first benchmark specifically designed around the MCP protocol, making it directly relevant to evaluating agents in the rapidly growing MCP ecosystem. It provides a public leaderboard at scale.com and the dataset is available on HuggingFace. The project is released under the MIT license.
