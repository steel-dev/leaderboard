ABOUTME: 200-word summary of the ToolSandbox AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# ToolSandbox

ToolSandbox is a stateful, conversational, interactive evaluation benchmark for LLM tool-use capabilities, published in August 2024. Unlike prior benchmarks that evaluate stateless RESTful API calls or single-turn prompts, ToolSandbox introduces stateful tool execution where tools maintain persistent state across calls, implicit state dependencies between tools, a built-in user simulator for on-policy conversational evaluation, and a dynamic evaluation strategy that checks both intermediate and final milestones over arbitrary trajectories.

Evaluation uses milestone-based assessment, tracking whether the agent achieves required intermediate states and final goals throughout a multi-turn conversation. The benchmark defines several challenging task categories including State Dependency (tools whose outputs depend on prior tool calls), Canonicalization (handling input variations), and Insufficient Information (recognizing when a task cannot be completed). Results show a significant performance gap between open-source and proprietary models, with even the most capable SOTA LLMs struggling on complex task categories.

ToolSandbox provides important insights that static, single-turn benchmarks miss, particularly around stateful reasoning and conversational tool use. Its on-policy evaluation approach, where the user simulator reacts dynamically to agent behavior rather than following a fixed script, makes it more realistic than off-policy dialog trajectory evaluation. The evaluation framework is publicly released on GitHub.
