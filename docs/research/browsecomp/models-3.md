# BrowseComp model research: submissions 68–100

Checked 2026-10-10. This batch adds classification evidence for the existing 33 results; it does not alter scores, ranks, names, or result-source URLs. Primary model cards, papers, released file inventories, official API prices, and runtime code were inspected.

## Decisions that affect chart filters

- **Total parameters drive MoE categories.** MiniMax M2 is Large (230B total, 10B active); GLM-4.5-Air and Nemotron 3 Super are Medium (106B and 120B total). Architectural totals are retained where explicitly published; larger tensor inventories are explained in record notes. DeepSeek-V3.2-Exp uses the retrieved checkpoint inventory (685.4B including auxiliary tensors) because its own card does not publish an exact total.
- **WebSailor stacks are Medium.** Its [paper appendix A.1](https://arxiv.org/html/2507.02592v1) and [inference instructions](https://github.com/Alibaba-NLP/DeepResearch/tree/main/WebAgent/WebSailor) require Qwen2.5-72B-Instruct for page summaries. The 7B/32B backbone sizes remain Small; the complete runtimes use the largest component. The 7B/32B checkpoints are released, while the exact 72B release was not found.
- **InfoAgent includes open and closed helpers, with uncertain complete-stack weights.** Its [paper appendix B.2](https://arxiv.org/html/2509.25189v1) uses GPT-4o-mini for snippet generation and two 0.6B Qwen retrieval models. The largest-component category is Medium via the GPT-4o-mini price proxy. The present [Microsoft weight repository](https://huggingface.co/microsoft/InfoAgent) contains RE-TRAC-30B-A3B, not the evaluated InfoAgent-14B checkpoint.
- **Tongyi DeepResearch, AgentFounder, and OpenSeeker have unnamed runtime summarizers.** Their known primary models remain Small. Published tool descriptions or runtime code require a separate summary model without pinning its identity. Each gets a low-confidence Medium helper estimate, informed by the related WebSailor 72B summary pipeline; complete-stack openness remains uncertain. This inference is provisional, with no invented parameter count. OpenSeeker’s training-only historical-context teacher is excluded; its runtime Visit helper is included.
- **BrowseMaster uses two R1 versions.** The [paper section 4.1](https://arxiv.org/html/2508.09129v1) identifies R1-0528 as planner and original R1 as executor. Both have released weights, and the stack remains Large without adding their sizes.

## Retrieval limitations and historical records

- The original NVIDIA HF link failed; the public [NVIDIA-prefixed BF16 checkpoint](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16) was located and its 50 weight shards verified.
- The linked BrowseMaster and WebExplorer GitHub repositories returned 404 through direct fetch/API checks. This is recorded as unverified harness availability; WebExplorer’s model weights are independently verified.
- DeepDive’s [repository model table](https://github.com/THUDM/DeepDive) still marks model downloads as coming soon. The OpenReview PDF returned a browser-verification page. AgentFounder and DeepMiner papers establish their sizes, but an author-hosted exact evaluated checkpoint was not located.
- [Parallel’s benchmark URL](https://parallel.ai/benchmarks) now reports August/September 2026 configurations. The April 2026 GPT-5.4 harness and 2025 competitor identities are retained from the existing result records with a historical-source caveat. They are not silently mapped to today’s GPT-5.6 runs.
- [Perplexity presets](https://docs.perplexity.ai/docs/agent-api/presets) are explicitly mutable and now use different names/backbones. The June Fast/Pro entries receive low-confidence historical estimates rather than today’s model identity. Old Sonar model/pricing pages redirect to migration docs, so historical Sonar Deep Research token prices are omitted.
- Exa identifies top language models/model fusion but does not publish the precise Low stack. Research Pro is an older managed system. Their Large categories are provisional frontier-stack inferences, and per-query spending is never treated as token pricing.

## Category inventory

“Uncertain” is not Closed. It means the complete evaluated weights are not verified. An unknown checkpoint keeps the aggregate Uncertain even when other components are known to be open or closed. Every row keeps its assigned category and exposes the basis and confidence in JSON.

| Submission                                    | Runtime size | Weights   | Basis / caveat                               |
| --------------------------------------------- | ------------ | --------- | -------------------------------------------- |
| Grok 4 Fast                                   | Medium       | Closed    | Price proxy                                  |
| MiniMax M2                                    | Large        | Open      | Parameters                                   |
| Exa Agent Low                                 | Large        | Uncertain | Estimated, low confidence                    |
| Tongyi DeepResearch                           | Medium       | Uncertain | Estimated, low confidence; largest component |
| GLM-4.7-Flash                                 | Small        | Open      | Parameters                                   |
| Tavily + GPT-5.4 harness                      | Large        | Closed    | Price proxy                                  |
| DeepSeek-V3.2-Exp                             | Large        | Open      | Parameters                                   |
| Exa + GPT-5.4 harness                         | Large        | Closed    | Price proxy                                  |
| AgentFounder-30B                              | Medium       | Uncertain | Estimated, low confidence; largest component |
| Sarvam-30B                                    | Small        | Open      | Parameters                                   |
| DeepMiner-32B                                 | Small        | Uncertain | Parameters                                   |
| Nemotron 3 Super (120B A12B)                  | Medium       | Open      | Parameters                                   |
| DeepSeek-V3.1                                 | Large        | Open      | Parameters                                   |
| BrowseMaster                                  | Large        | Open      | Parameters; largest component                |
| OpenSeeker                                    | Medium       | Uncertain | Estimated, low confidence; largest component |
| GLM-4.5                                       | Large        | Open      | Parameters                                   |
| GLM-4.5-Air                                   | Medium       | Open      | Parameters                                   |
| Perplexity Agent Pro                          | Large        | Uncertain | Estimated, low confidence                    |
| WebExplorer-8B (RL)                           | Small        | Open      | Parameters                                   |
| InfoAgent                                     | Medium       | Uncertain | Price proxy; largest component               |
| DeepDive-32B                                  | Small        | Uncertain | Parameters                                   |
| Exa Research Pro                              | Large        | Uncertain | Estimated, low confidence                    |
| WebSailor-72B                                 | Medium       | Uncertain | Parameters; largest component                |
| WebSailor-32B                                 | Medium       | Open      | Parameters; largest component                |
| Perplexity Agent Fast                         | Medium       | Uncertain | Estimated, low confidence                    |
| OpenAI o1                                     | Large        | Closed    | Price proxy                                  |
| DeepSeek-R1-0528                              | Large        | Open      | Parameters                                   |
| Claude Opus 4.1 (Parallel Task API benchmark) | Large        | Closed    | Price proxy                                  |
| WebSailor-7B                                  | Medium       | Open      | Parameters; largest component                |
| Perplexity Sonar Deep Research                | Large        | Uncertain | Estimated, low confidence                    |
| GPT-4o + browsing                             | Large        | Closed    | Price proxy                                  |
| GPT-4.5                                       | Large        | Closed    | Price proxy                                  |
| GPT-4o                                        | Large        | Closed    | Price proxy                                  |

## Price records

All numeric prices in this batch are standard uncached USD per million text tokens, before tool fees. [Grok 4 Fast](https://x.ai/news/grok-4-fast) is $0.20 input/$0.50 output (Medium); [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini) is $0.15/$0.60 (Medium). [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) is $2.50/$15; [o1](https://developers.openai.com/api/docs/models/o1) $15/$60; [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) and [GPT-4o Search Preview](https://developers.openai.com/api/docs/models/gpt-4o-search-preview) each $2.50/$10; [GPT-4.5 Preview](https://developers.openai.com/api/docs/models/gpt-4.5-preview) $75/$150; [Claude Opus 4.1](https://platform.claude.com/docs/en/about-claude/pricing) $15/$75. Those six are Large price proxies. The [original paper section 4.1](https://arxiv.org/html/2504.12516) specifies GPT-4o `2024-08-06`, GPT-4o Search Preview `2025-03-11`, GPT-4.5 Preview `2025-02-27`, and o1 `2024-12-17` (medium reasoning effort). The browsing and no-browsing GPT-4o baselines use separate model records.

Prices are omitted when not needed for parameter classification and the exact evaluated endpoint/version rate was not established. A missing field is not a zero-dollar price.

## Verification

The checkpoint API inventory confirmed public safetensor shards for every model marked open in this batch. No weights were downloaded. JSON validation checks coverage of all 33 assigned names, model references, unique IDs, category boundaries, required evidence for each basis, source URL shape, nonnegative numeric fields, and dates. The integration parent reconciles duplicates across batches and runs repository checks.
