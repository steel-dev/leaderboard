# AgentHarm (AgentBeats Green Agent)
Agent-agnostic safety evaluation for A2A-compatible agents, based on the **AgentHarm** benchmark.

This repository provides an **AgentBeats green agent** that evaluates a **purple agent** on the AgentHarm benchmark. The original AgentHarm evaluation methodology was developed and published for LLM evaluation by the **UK government Department for Business, Energy and Industrial Strategy (BEIS)** via **Inspect Evals** (see the official AgentHarm eval reference), and this project builds directly on that work by **agentifying** the benchmark into an **A2A-driven, agent-agnostic** evaluation harness that can test any A2A-compatible agent end to end.

**Upstream benchmark (reference implementation):**
- Inspect Evals page: https://ukgovernmentbeis.github.io/inspect_evals/evals/safeguards/agentharm/
- Inspect Evals repo: https://github.com/UKGovernmentBEIS/inspect_evals (see `src/inspect_evals/agentharm`)

**Dataset used for evaluation:**
- Hugging Face dataset: https://huggingface.co/datasets/ai-safety-institute/AgentHarm

**Competition context:**
- AgentX - AgentBeats: https://rdi.berkeley.edu/agentx-agentbeats.html

---

## Abstract (AgentBeats requirement)

This repository provides an **AgentBeats green agent** that evaluates a **purple agent** on the AgentHarm benchmark. The evaluation is **agent-agnostic**: any purple agent that implements the **A2A protocol** can be tested with no benchmark-side changes. The green agent orchestrates runs, serves tasks, and writes scored results to disk for reproducible comparison across agents.

---

## What this benchmark tests

AgentHarm evaluates whether an agent:
- **Refuses** explicitly harmful multi-step requests (preferred outcome), and
- Maintains **coherent multi-step behaviour** when prompted (capability signal), using the benchmark’s task structure.

This repo ports the AgentHarm evaluation flow into an AgentBeats-style **green (evaluator) agent** that speaks A2A to a **purple (agent-under-test)**.

> ⚠️ Safety note: the dataset contains harmful prompts and scenarios. Run only in a controlled environment with appropriate safeguards.

---

## Architecture

- **Green agent (this repo)**: orchestrator + evaluator (AgentBeats benchmark agent)
  - Hosts the evaluation endpoint (A2A server)
  - Loads tasks from the AgentHarm dataset
  - Sends tasks to the purple agent via A2A
  - Scores and persists results

- **Purple agent (baseline included)**: a simple A2A-compatible target agent
  - Used as a default smoke test / baseline
  - You can replace it with any other A2A-compatible purple agent

---

## Directory layout

- `.github/workflows/` - CI
- `src/` - green and purple agent implementation
- `output/` - run artefacts (default results location)
- `Dockerfile.green` - green agent container image
- `Dockerfile.purple` - baseline purple agent container image
- `docker-compose.yml` - local orchestration
- `requirements.txt` - Python deps

---

## Quick start (local)

### 1) Build and start both containers
```bash
docker compose up -d --build
````

### 2) Trigger an evaluation run (A2A JSON-RPC)

```bash
curl -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "message/send",
    "id": "1",
    "params": {
      "message": {
        "messageId": "msg-001",
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "{\"participants\": {\"purple_agent\": \"http://purple-agent:9009\"}}"
          }
        ]
      }
    }
  }'
```

---

## Running against your own purple agent (agent-agnostic)

If your agent is A2A-compatible, you can point the green agent at it by providing its URL in the `participants` payload.

Example (replace with your purple agent URL):

```json
{"participants": {"purple_agent": "http://YOUR_AGENT_HOST:PORT"}}
```

You do not need to modify the benchmark logic, as long as your agent:

* Accepts A2A requests, and
* Returns A2A responses according to the protocol your runner expects.

---

## Configuration

Set required environment variables before running:

```bash
export NEBIUS_API_KEY=your_key_here
```

Override defaults via environment variables:

| Variable      | Default | Meaning                                    |
| ------------- | ------- | ------------------------------------------ |
| `MAX_SAMPLES` | `3`     | Number of samples to evaluate per category |

Example:

```bash
MAX_SAMPLES=5 docker compose up -d
```

> Tip: If you are not using the baseline purple agent, you may not need `NEBIUS_API_KEY`, depending on your purple agent’s backend.

---

## Output

Results are written to:

* `./output/results.json`

Recommended workflow:

* Commit nothing under `output/`
* Keep run artefacts per-agent and per-config (for leaderboard-style comparison)

---

## Useful commands

```bash
docker compose logs -f      # View logs
docker compose down         # Stop containers
docker compose down -v      # Stop and clean up volumes
```

---

## Roadmap

Planned improvements:

* **Faster runs** through more intensive parallelisation options (higher throughput, better utilisation)
* **Dataset enhancements**: broaden coverage, add more behaviours, improve metadata and task balance

---

## Team

* [@adilliadil](https://github.com/adilliadil) - Adil Adilli
* [@aydin41k](https://github.com/aydin41k) - Aydin Salimov

---

## References

* Inspect Evals: AgentHarm evaluation page
  [https://ukgovernmentbeis.github.io/inspect_evals/evals/safeguards/agentharm/](https://ukgovernmentbeis.github.io/inspect_evals/evals/safeguards/agentharm/)

* AgentHarm dataset (Hugging Face)
  [https://huggingface.co/datasets/ai-safety-institute/AgentHarm](https://huggingface.co/datasets/ai-safety-institute/AgentHarm)

* AgentHarm paper (arXiv:2410.09024)
  [https://arxiv.org/abs/2410.09024](https://arxiv.org/abs/2410.09024)