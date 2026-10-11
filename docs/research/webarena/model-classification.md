# WebArena model classification

Initially checked **2026-10-10**, audited **2026-10-11**. Scope: all 50 WebArena submissions. The batch defines 42 model records and reuses eight shared records. The audit corrected BrowserGym/Patel names, source links, and denominator notes without changing scores; see the [verification report](../chart-data-verification-2026-10-11.md).

Research followed the repository's model-classification skill and the OpenAI Docs skill. Retrieved paper HTML/PDF text, author reports, repository trees and evaluation configurations, provider documentation, and actual checkpoint file inventories. An inaccessible source, an open base model, or a public harness does not establish release of evaluated fine-tuned weights.

Total parameters determine Tiny (≤4B), Small (>4–40B), Medium (>40–150B), or Large (>150B). Unknown totals use the published standard uncached token-price proxy `(3 × input + output) / 4`: Small below $0.15/M, Medium $0.15–$1/M inclusive, and Large above $1/M. Unresolved identities retain explicit provisional records without invented counts. Multiple required models use their largest category; uncertainty in any required checkpoint prevents an all-open assertion.

## Evidence that changes interpretation

- **OpAgent's 71.6 result is a composite system.** [Section 4.3](https://arxiv.org/html/2602.13559) names Gemini 3 Pro for planning, reflection, and summarization, with a separately post-trained Qwen2.5-VL-72B-MFT grounder. The publisher inventory contains a later OpAgent-32B release, but did not establish release of the evaluated 72B fine-tune. This row is Large and Uncertain, rather than a Small open model.
- **BrowserGym + GPT-4o corrects the former GPT-4 label.** The retrieved [WorkArena/BrowserGym paper](https://arxiv.org/html/2403.07718) assigns the matching 23.5 result to GPT-4o-2024-05-13. The public name and classification now both follow that evidence; the score is unchanged.
- **Patel et al. (Qwen1.5-72B, Mixture B) corrects the former GPT-4 label.** [Table 3 of the linked study](https://arxiv.org/html/2405.20309) assigns the matching 9.36 result to a Qwen1.5-72B policy fine-tuned on Mixture B. GPT-4 generates reference trajectories used in the analysis, not the policy for that result. No matching fine-tuned checkpoint was verified; the classification is Medium and Uncertain.
- **WebOperator's advertised snapshot is unverified.** Its paper names `gpt-4o-2025-01-01`, which is not in the retrieved OpenAI snapshot documentation. The released configuration uses an Azure `gpt-4o` deployment alias. It also loads the released `all-MiniLM-L6-v2` checkpoint for semantic action deduplication. This is a mixed stack with an unpinned GPT-4o version, not a precise January snapshot.
- **Original Operator remains the January 2025 CUA system.** Neither the later `computer-use-preview` API name nor its tariff establishes the historical model. Its shared record is Large/Estimated.
- **A3's stored 42.1 result is preserved.** The exact released A3-Qwen3.5-9B model card reports 41.5 under its project setup. The discrepancy is documented without changing either source.

## Runtime helpers and training exclusions

The [GBOX evaluation](https://github.com/babelcloud/webarena/blob/main/gbox/report.md) and execution
logs require semantic screenshot targeting alongside Sonnet 4.5. The public MCP delegates this to a
hosted visual-coordinate service. [Current API docs](https://docs.gbox.ai/api-reference/model/generate-coordinates-for-a-model)
name `gbox-handy-1`, but do not identify the historical backend or establish released weights.
An explicit low-confidence helper preserves that uncertainty; its Large estimate allows an
undisclosed frontier vision backend, without inventing a parameter count. Sonnet already determines
Large for the complete stack. The stack's weights are now Uncertain.

[WebChallenger](https://arxiv.org/html/2606.10423) uses GLM-4-32B-0414 and Qwen2.5-VL-7B-Instruct captioning on WebArena; the Qwen3-VL-4B configuration belongs to VisualWebArena and is excluded. [ScribeAgent](https://arxiv.org/html/2411.15004) combines its 32B policy with GPT-4o task decomposition and action mapping. [AgentSymbiotic](https://arxiv.org/html/2502.07942) uses Claude 3.5 plus runtime trajectory embeddings for its 52.1 configuration, while [Learn-by-Interact](https://arxiv.org/html/2501.10893) uses Claude 3.5 and Vertex text embeddings for its 48.0 configuration. Both embedding identities remain unresolved and explicitly provisional. Optional hybrid experiments and training distillation models do not establish extra models in these score configurations.

[Agent Workflow Memory](https://arxiv.org/html/2409.07429), section 2.3, uses neural success predictions to select memories retained for subsequent test tasks. This affects runtime and is included. The paper pins GPT-4-0613 for action generation and induction, but [historical evaluator defaults](https://github.com/zorazrw/agent-workflow-memory/blob/2f15e359e15bf9436b6218f29b6e621eacb19f11/webarena/autoeval/evaluate_trajectory.py) name GPT-3.5-Turbo while [induction defaults](https://github.com/zorazrw/agent-workflow-memory/blob/2f15e359e15bf9436b6218f29b6e621eacb19f11/webarena/induce_prompt.py) expect a GPT-4o-named result. These conflicting defaults do not identify the published run. The helper is a closed, low-confidence Large estimate covering the possible GPT-4/GPT-4o component; no particular price or parameter count is asserted. Its uncertainty does not change the known main model's Large category.

[GPT-4 + Auto Eval](https://github.com/Berkeley-NLP/Agent-Eval-Refine) has a GPT-4-1106-preview actor/reflection loop plus GPT-4 Vision preview success feedback that controls retries. [AgentOccam-Judge](https://arxiv.org/html/2410.13825) likewise uses its judge during action selection; both roles share GPT-4-Turbo-2024-04-09. These judges belong to runtime. The separate post-run scoring judges and TTI's Gemma3-27B training evaluator do not. NNetNav's 70B exploration/reward teacher, AgentTrek data-generation models, FireAct's GPT-4 teacher, and the other students' training teachers are excluded.

[GPT-4o + Tree Search](https://arxiv.org/html/2407.01476) pins the May 13 snapshot for policy and value roles. Its WebArena setting is text-only: BLIP-2 belongs to a separate VisualWebArena experiment. [WebPilot](https://arxiv.org/html/2408.15978) also explicitly pins the May 13 GPT-4o model; its GPT-3.5 experiment is an alternative, not another runtime component.

## Weights and parameter checks

Inspected full weight inventories for GLM-4-32B-0414, Qwen2.5-VL-7B-Instruct, A3-Qwen3.5-9B, TTI's Gemma3-12B WebArena checkpoint, AgentTrek-1.0-32B, NNetNav's WebArena-specific Llama-3.1-8B, Qwen1.5-72B-Chat, Llama 3 8B/70B Instruct, Lemur-70B-Chat-v1, Agent-FLAN-7B, Code Llama 7B/34B Instruct, AgentLM 7B/13B/70B, Mixtral-8x7B-Instruct-v0.1, and all-MiniLM-L6-v2. Gated license acceptance does not make released Meta weights closed.

The [official Synatra repository](https://github.com/web-arena-x/synatra) links [oottyy/Synatra-Models](https://huggingface.co/oottyy/Synatra-Models/tree/main/Synatra-CodeLlama), whose Synatra-CodeLlama subfolder contains three full weight shards. The unrelated similarly named Synatra checkpoints are not used. [Qwen2.5-VL-7B's inventory](https://huggingface.co/api/models/Qwen/Qwen2.5-VL-7B-Instruct) reports 8.2922B total including vision components. [Mixtral's author report](https://mistral.ai/news/mixtral-of-experts) gives 46.7B total and 12.9B active; total places it in Medium. The embedding checkpoint has 22,713,728 parameters and is Tiny. Other parameter records use the published nominal total where an exact inspected count is unnecessary to resolve the category.

No matching evaluated fine-tune was verified for the OpAgent 72B grounder, ScribeAgent-Large, Patel's Mixture-B policy, or AutoWebGLM. Their known base architectures support size classification, but their weights remain Uncertain. AutoWebGLM publishes evaluation code and names ChatGLM3-6B; linking that base does not establish release of the trained policy.

The matching **CodeAct Agent 2.34** result is a [Synatra reevaluation](https://arxiv.org/html/2409.15637v1), not an original WebArena result in the CodeAct paper. Both Llama2-7B and Mistral-7B CodeAct variants have full downloadable checkpoints, but the exact evaluated variant is unresolved. The released Synatra files do not expose that specific evaluation configuration. **FireAct 0.25** comes from [Agent-FLAN's table](https://arxiv.org/html/2403.12881v1); verified full Llama2-7B and Llama2/CodeLlama LoRA releases do not pin which one the reevaluation used. Both rows retain nominal 7B, Small, and Uncertain weights.

## Historical prices and provisional systems

| New priced model                               | Standard input / output USD per 1M tokens |  Blend | Category |
| ---------------------------------------------- | ----------------------------------------: | -----: | -------- |
| GPT-4-0613                                     |                                   30 / 60 |  37.50 | Large    |
| GPT-4-1106-preview                             |                                   10 / 30 |     15 | Large    |
| GPT-4-Turbo-2024-04-09                         |                                   10 / 30 |     15 | Large    |
| GPT-4-Turbo-Preview, unpinned historical alias |                                   10 / 30 |     15 | Large    |
| GPT-4o-2024-05-13                              |                                    5 / 15 |   7.50 | Large    |
| GPT-5-mini                                     |                                  0.25 / 2 | 0.6875 | Medium   |
| GPT-3.5-Turbo-16K-0613                         |                                     3 / 4 |   3.25 | Large    |

Retrieved [OpenAI's model documentation](https://developers.openai.com/api/docs/models), [standard legacy pricing](https://developers.openai.com/api/docs/pricing), and [historical deprecation tables](https://developers.openai.com/api/docs/deprecations). The May 2024 GPT-4o rate differs from the later $2.50/$10 alias. GPT-3.5-Turbo-16K-0613 uses the exact historical $3/$4 tariff, not a current GPT-3.5 replacement; Large here reflects the requested price proxy and does not imply known large parameter count. The exact GPT-4-1106-preview documentation path returned 404, so its surviving family tariff, deprecation identity, and evaluated runtime config support a medium-confidence record.

SteP names a Turbo Preview alias without a snapshot. Its later repository runs use stable April Turbo; those are not substituted for the paper's result. Unpinned Claude 3.5 and GPT-4o retain historical estimated records without false precision. Original December 2023 Gemini Pro has a retrieved legacy character-based tariff, but no verified exact token tariff; its provisional Medium estimate does not fabricate a character-to-token conversion.

DeepSky Agent, Narada AI, IBM CUGA, and Jace AWA-1.5 do not disclose exact historical inference stacks in the retrieved material. All remain Large/Estimated with low confidence and Uncertain weights. CUGA's [historical paper, section 5](https://arxiv.org/pdf/2503.01861v2), says the then-current state-of-the-art results use a frontier model, with smaller/open-model experiments still underway. A later AppWorld GPT-4.1 table and current GPT-4o configuration examples do not identify its earlier WebArena stack. DeepSky's tracker citation provides less direct evidence than the other authors' reports; that limitation is explicit.

AgentSymbiotic's anonymous implementation returned HTTP 403. WebUncertainty's public repository contained documentation, assets, and dependency metadata but no executable agent implementation at the check date. A public repository is therefore not reported as a verified open harness. Other absent checkpoint/code matches are recorded as failed verification, not proof that no release could exist elsewhere.

## Full mapping

The table reports aggregate runtime classifications. Full source URLs, roles, exact-version caveats, prices, counts, and confidence are in `src/data/model-research/webarena.json` and the referenced shared records.

| Existing submission                   | Runtime model IDs                                                               | Size   | Weights   |
| ------------------------------------- | ------------------------------------------------------------------------------- | ------ | --------- |
| WebTactix (DeepSeek v3.2)             | `deepseek-v3-2`                                                                 | Large  | Open      |
| OpAgent                               | `gemini-3-pro`, `opagent-qwen2-5-vl-72b-mft`                                    | Large  | Uncertain |
| ColorBrowserAgent                     | `gpt-5`                                                                         | Large  | Closed    |
| Claude Code + GBOX MCP                | `claude-sonnet-4-5`, `gbox-coordinate-model-historical`                         | Large  | Uncertain |
| DeepSky Agent                         | `deepsky-agent-historical-stack`                                                | Large  | Uncertain |
| Narada AI                             | `narada-operator-historical-stack`                                              | Large  | Uncertain |
| IBM CUGA                              | `cuga-webarena-historical-stack`                                                | Large  | Uncertain |
| Kimi K2.5                             | `kimi-k2-5`                                                                     | Large  | Open      |
| OpenAI Operator                       | `openai-cua-original`                                                           | Large  | Closed    |
| Jace.AI (AWA-1.5)                     | `jace-awa-1-5-stack`                                                            | Large  | Uncertain |
| WebChallenger (GLM-4-32B)             | `glm-4-32b-0414`, `qwen2-5-vl-7b-instruct`                                      | Small  | Open      |
| Plan-MCTS + GPT-5-mini                | `gpt-5-mini`                                                                    | Medium | Closed    |
| WebOperator + GPT-4o                  | `gpt-4o-unspecified-historical`, `all-minilm-l6-v2`                             | Large  | Mixed     |
| ScribeAgent + GPT-4o                  | `scribeagent-large-32b`, `gpt-4o-unspecified-historical`                        | Large  | Uncertain |
| AgentSymbiotic                        | `claude-3-5-sonnet-historical`, `agentsymbiotic-retriever-unknown`              | Large  | Uncertain |
| Learn-by-Interact                     | `claude-3-5-sonnet-historical`, `learn-by-interact-vertex-embedding-historical` | Large  | Uncertain |
| WebUncertainty + GPT-4-Turbo          | `gpt-4-turbo-2024-04-09`                                                        | Large  | Closed    |
| AgentOccam-Judge                      | `gpt-4-turbo-2024-04-09`                                                        | Large  | Closed    |
| A3-Qwen3.5-9B                         | `a3-qwen3-5-9b`                                                                 | Small  | Open      |
| GUI-API Hybrid Agent                  | `gpt-4o-unspecified-historical`                                                 | Large  | Closed    |
| WebPilot                              | `gpt-4o-2024-05-13`                                                             | Large  | Closed    |
| Agent Workflow Memory                 | `gpt-4-0613`, `awm-memory-evaluator-historical`                                 | Large  | Closed    |
| SteP                                  | `gpt-4-turbo-preview-historical`                                                | Large  | Closed    |
| TTI                                   | `tti-gemma3-12b-webarena`                                                       | Small  | Open      |
| BrowserGym + GPT-4o                   | `gpt-4o-2024-05-13`                                                             | Large  | Closed    |
| AgentTrek-1.0-32B                     | `agenttrek-1-0-32b`                                                             | Small  | Open      |
| GPT-4 + Auto Eval                     | `gpt-4-1106-preview`, `gpt-4-vision-preview`                                    | Large  | Closed    |
| GPT-4o + Tree Search                  | `gpt-4o-2024-05-13`                                                             | Large  | Closed    |
| AutoWebGLM                            | `autowebglm-6b`                                                                 | Small  | Uncertain |
| NNetNav                               | `nnetnav-llama3-1-8b-wa`                                                        | Small  | Open      |
| gpt-4-0613 (no not-achievable hint)   | `gpt-4-0613`                                                                    | Large  | Closed    |
| gpt-4o-2024-05-13                     | `gpt-4o-2024-05-13`                                                             | Large  | Closed    |
| gpt-4-0613 (with not-achievable hint) | `gpt-4-0613`                                                                    | Large  | Closed    |
| Patel et al. (Qwen1.5-72B, Mixture B) | `patel-qwen1-5-72b-mixture-b`                                                   | Medium | Uncertain |
| gpt-3.5-turbo-16k-0613                | `gpt-3-5-turbo-16k-0613`                                                        | Large  | Closed    |
| Qwen-1.5-chat-72b                     | `qwen1-5-72b-chat`                                                              | Medium | Open      |
| Gemini Pro                            | `gemini-1-0-pro-historical`                                                     | Medium | Closed    |
| Llama3-chat-70b                       | `llama3-70b-instruct`                                                           | Medium | Open      |
| Synatra-CodeLLama7b                   | `synatra-codellama-7b`                                                          | Small  | Open      |
| Lemur-chat-70b                        | `lemur-70b-chat-v1`                                                             | Medium | Open      |
| Agent-FLAN                            | `agent-flan-7b`                                                                 | Small  | Open      |
| CodeLlama-instruct-34b                | `codellama-34b-instruct`                                                        | Small  | Open      |
| AgentLM-70b                           | `agentlm-70b`                                                                   | Medium | Open      |
| Llama3-chat-8b                        | `llama3-8b-instruct`                                                            | Small  | Open      |
| CodeAct Agent                         | `codeactagent-7b-webarena`                                                      | Small  | Uncertain |
| AgentLM-13b                           | `agentlm-13b`                                                                   | Small  | Open      |
| Mixtral-8x7B                          | `mixtral-8x7b-instruct-v0-1`                                                    | Medium | Open      |
| AgentLM-7b                            | `agentlm-7b`                                                                    | Small  | Open      |
| FireAct                               | `fireact-7b-webarena`                                                           | Small  | Uncertain |
| CodeLlama-instruct-7b                 | `codellama-7b-instruct`                                                         | Small  | Open      |

## Validation

- Parsed all 42 model records and 50 submissions using `researchBatchSchema`.
- Verified exact name coverage against all 50 existing WebArena rows, with no missing or duplicate submissions.
- Verified unique owned IDs and every reference against the combined registry. Shared IDs: `deepseek-v3-2`, `gemini-3-pro`, `gpt-5`, `claude-sonnet-4-5`, `kimi-k2-5`, `openai-cua-original`, `gpt-4-vision-preview`, and `gpt-4o-unspecified-historical`.
- Recomputed every parameter and price category, checked model dates and source URL shapes, and reviewed provisional records and unverified releases.
- Aggregate counts: **27 Large, 8 Medium, 15 Small, 0 Tiny**; **19 Open, 17 Closed, 1 Mixed, 13 Uncertain**. Basis: 23 Published size, 13 Price proxy, 14 Estimated. Confidence: 30 High, 7 Medium, 13 Low.
- Formatted the two owned files with Prettier. Benchmark names and source/interpretation notes changed as recorded above; scores did not. Parent integration handles combined tests, lint, type checks, build, and browser QA; this research task does not build.
