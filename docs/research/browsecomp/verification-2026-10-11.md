# BrowseComp verification — October 11, 2026

## Scope and snapshot

This audit covers the BrowseComp chart's complete data/classification structure and every distinct result, repository, model, and submission source URL. It manually rechecks the two newly added results and selected existing claims with a higher risk of incorrect version, score, weight-release, or source identity. It is **not an exhaustive independent re-evaluation of all 102 reported benchmark scores**. Prior model research remains relevant where this pass checks its structure and source availability rather than repeating every semantic judgment.

The initial snapshot was captured at `2026-10-11T20:45:55.377991+00:00`, while a separate refresh task was active. Existing files stayed read-only until that task completed. The refresh added AREX-2 and Traverse-35B and fixed competition-rank ties. This audit preserves those additions and equal-score ties; the only numerical score correction is o4-mini, from 51.5 to 28.3, followed by competition reranking.

The audit inspected `src/lib/browsecomp-classification.ts`, `src/lib/model-classification.ts`, `src/lib/model-registry.ts`, and the registry schemas without changing shared implementation. Raw response bodies, request timestamps/statuses, inventories, the initial diff, and extracted PDF text were retained locally under ignored `tmp/qa/browsecomp-audit-2026-10-11/`; this document records the durable findings.

## Complete structural validation

- 102 rows have exactly 102 exact-name submission mappings. No missing, extra, or duplicate submission names; every model reference resolves.
- After the Traverse helper addition: 107 model records, 103 distinct IDs. Repeated `gpt-5-4` records (three), `gpt-4o-mini` (two), and `openseeker-summary-unknown` (two) agree on all registry classification fields. Different note wording does not change classification.
- Every research batch parses against `researchBatchSchema`; `buildModelRegistry` accepts all parameter/price categories and rejects no conflicts. Actual `getBrowsecompChartRows` produces all 102 rows.
- Every numerical score is finite and in 0–100, matches its display string, and is in descending order. Every rank equals one plus the number of strictly higher scores. Equal scores retain equal ranks.
- Total parameters control size: Tiny ≤4B, Small >4–40B, Medium >40–150B, Large >150B. Active MoE counts are descriptive, never used as the category total. For undisclosed totals, the price proxy uses `(3 × input + output) / 4`, standard USD per million uncached tokens: Small <0.15; Medium 0.15–1 inclusive; Large >1. Provisional records remain explicitly estimated with low confidence.
- System size follows its largest component. Any uncertain weight component makes the aggregate uncertain. Any estimated component makes the aggregate estimated; otherwise price applies when a largest-category component uses the proxy. Runtime summaries count; external benchmark graders and training-only teachers do not.

These are data/schema/runtime-helper checks. This audit did not run a model evaluation or independently test the vendor's benchmark implementation. The parent task owns UI QA, lint, production build, and README generation.

## Applied corrections and primary evidence

| Item | Evidence and resulting change |
| --- | --- |
| o4-mini | The [OpenAI launch page](https://openai.com/index/introducing-o3-and-o4-mini/) embeds a BrowseComp Vega-Lite dataset: o4-mini with Python/browsing 28.3, o3 49.7, Deep Research 51.5. The old row assigned Deep Research's score to o4-mini. Corrected to 28.3 and reranked; o3 remains 49.7. |
| GPT-5 | Replaced the dead `/index/gpt-5/` URL with [the actual launch article](https://openai.com/index/introducing-gpt-5/). Its embedded BrowseComp chart explicitly gives GPT-5 with thinking 54.9, ChatGPT agent 68.9, and o3 49.7. Text-only extraction omitted this chart; Steel with proxy retrieved the chart specification. |
| MiniMax M2.1 | Replaced a 404 news link with [the publisher model card](https://huggingface.co/MiniMaxAI/MiniMax-M2.1). Its table gives 62.0 for context management, distinct from 47.4 without it. Existing 62.0 remains unchanged. The same card lists MiniMax M2 at 44.0 without context management. |
| Nemotron 3 Super | Replaced the unavailable shortened repository URL with [NVIDIA's full BF16 repository](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16). Its card reports 31.28 with search (the existing one-decimal display 31.3 is correct), 120B total/12B active, and a private internal BrowseComp/SerpAPI harness. Weight files are public; open weights do not imply open evaluation code. |
| Seven historical Parallel Task API rows | Replaced the mutable benchmark page with [the dated September 9, 2025 report](https://parallel.ai/blog/deep-research-benchmarks). It directly supports Ultra8x 58, Ultra4x 56, Ultra2x 51, Ultra 45, Exa Research Pro 14, Claude Opus 4.1 7, and Sonar Deep Research 6. These are a fixed random 100-question subset, tested August 11–29, 2025, not a complete 1,266-question run. Backbone uncertainty remains for undisclosed hosted stacks. |
| Four GPT-5.4 search-provider rows | Replaced the mutable page with [the dated April 21, 2026 report](https://parallel.ai/blog/parallel-search-api): Parallel Basic 53, Advanced 51, Tavily 42, Exa 40. Methodology explicitly names one GPT-5.4 actor, search/fetch, up to 25 calls, separate GPT-5.4 grading, and April 19–21 testing. The report does not disclose the evaluated question count; no full-set assertion was added. |
| Kimi K3 | Removed the stale promise that weights would release in July. The [publisher card](https://huggingface.co/moonshotai/Kimi-K3) and [checkpoint API](https://huggingface.co/api/models/moonshotai/Kimi-K3) now show 96 safetensors shards. The card confirms 2.8T total/104B active, 91.2 with compaction at 300K, and 90.4 without context management. |
| Claude Opus 5 | [System card](https://www-cdn.anthropic.com/ceaf5c7ff2783855203fde8208ec311252dced5b/Claude%20Opus%205%20System%20Card.pdf) summary and visually inspected Figure 8.10.2.B (page 164) confirm 90.8 at max effort with a 10M-token budget. Added that budget to the note. The different Figure 8.10.2.A uses an unreleased effort setting and shows 90.2; it is a separate run. |

### New AREX-2 classification

[Paper Table 2 and §3.3.2](https://arxiv.org/html/2609.38288v1) confirm 84.0 on BrowseComp using a trained Qwen3.8-27B policy and confidence-based recursive research without correctness feedback. The [publisher checkpoint API](https://huggingface.co/api/models/BAAI/AREX-2) reports public, ungated Apache-2.0 weights with 11 shards and 27,356,728,560 serialized parameters at revision `d4e3502f92d9e889031c2d04e387ab2eb3520268`. Classification uses the published nominal 27B: **Small / open / parameters / high confidence**.

The [public harness](https://github.com/VectorSpaceLab/AREX-2) and [research-profile configuration](https://github.com/VectorSpaceLab/AREX-2/blob/main/docs/evaluation/configuration.md) show that summaries reuse the inference policy. External benchmark judging is outside the runtime answer stack. This permits upgrading the previous unverified weight and harness flags to open.

### New Traverse-35B classification

[The paper](https://arxiv.org/html/2609.37082v2) reports 72.83 in its abstract/results; Table 1 rounds this to 72.8. This is the full BrowseComp run. BC-185 is used for ablations and should not replace that evaluation identity. The actor is Qwen3.5-35B-A3B-derived: nominal 35B total, 3B active.

[Appendix F.1.2](https://arxiv.org/html/2609.37082v2#A6.SS1.SSS2) describes a question-conditioned page summarizer, including a reader-plus-LLM fallback. The [public runtime](https://github.com/ByteDance-BandAI/Traverse#search-tools) requires a deployment-specific backend, and its [FunctionLinkSummaryTool wrapper](https://github.com/ByteDance-BandAI/Traverse/blob/main/tools/function_tools.py) does not identify the evaluated summary model. A separate provisional summary component prevents the chart from asserting the actor alone describes the whole runtime. **Medium / uncertain / estimate / low confidence** is a declared estimate, not a measured parameter count; the helper could be another size or reuse the actor.

The runtime is open code, but its README explicitly separates model weights from the harness. No exact evaluated checkpoint inventory was located in the official repository or Hugging Face search. Weight availability remains uncertain. Memory sealing and self-verification are performed by the actor; external evaluation graders are excluded.

## Additional manually substantiated claims

- [Exa's launch article](https://exa.ai/blog/exa-agent), rendered with the BrowseComp tab and Show data selected, confirms Exa High 74, Medium 52.8, Low 43.5 and its third-party Perplexity Advanced 49, Deep 47, Pro 20, Fast 10 rows. Its benchmark table still prices Low at $0.02/query while the current API-price table says $0.025; the leaderboard note describes the benchmark's reported cost. These per-query costs are not converted into model token prices. Exact underlying preset backbones remain unresolved.
- The full [Claude Mythos 5 system card](https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf), §8.14.2, confirms single-agent 88.0 with adaptive maximum effort, a 10M-token limit and 200K compaction. The Opus 5 comparison figures also confirm Sonnet 5 at 84.7 and Opus 4.8 at 84.3; these values remain unchanged.
- DeepDive is version-sensitive. The [current OpenReview PDF](https://openreview.net/pdf?id=gA8mn8eXjo) is blocked by browser verification in direct requests and in the attempted Steel proxy scrape. Its primary-source search index exposes Table 5 with DeepDive-32B 15.3, 128 calls, 128K context. The [September 2025 arXiv v1](https://arxiv.org/html/2509.10446v1) and [current GitHub README](https://github.com/THUDM/DeepDive) report 14.8 instead; the v1 Figure 8 was also visually checked. **15.3 is retained, with only indexed evidence rechecked for that exact revision—not falsely claimed as a complete PDF read.** The project still marks evaluated checkpoints as coming soon, so uncertainty is retained.

- WebSailor-72B’s result note now says the evaluated checkpoint is unverified, matching its uncertain-weight research record. The publisher inventories verify the 7B and 32B releases, not the evaluated 72B policy.

## Source coverage and limitations

The initial snapshot had **204 unique URLs**. All were requested: 196 returned HTTP 200, two returned 404, one shortened Hugging Face repository returned 401, one OpenReview PDF returned 403, and four Hugging Face pages returned 429. The two 404s and incorrect repository were repaired; all four rate-limited Hugging Face pages subsequently returned 200.

After corrections there are **209 unique referenced URLs**. The final inventory reuses successful initial requests and fetches added/failed URLs: **207 direct HTTP 200**, one OpenAI page returning direct 403 but successfully retrieved and semantically inspected with Steel proxy, and one OpenReview PDF whose complete contents remain blocked. All 209 final URLs therefore have an explicit retrieval outcome. A status 200 proves response availability, not that every assertion on the page was audited, nor that a JS page exposed all content. Redirects to a newer product do not validate an old snapshot.

The initial 12MiB download cap truncated large Anthropic PDFs; those responses were not treated as complete evidence. Opus 5 was subsequently downloaded in full (16,281,258 bytes), extracted and chart pages inspected. Mythos 5 was downloaded in full by the companion audit (27,001,265 bytes), and the relevant BrowseComp text read here. Other source responses, including model/pricing docs, were screened for relevance and supplied to structural checks; their complete semantic re-verification was not exhaustive. Historical price ambiguities, undisclosed summarizers, provisional stack estimates, and exact-checkpoint uncertainties documented in the original research remain explicit.

All **45 previously open model records** were additionally checked against live publisher Hugging Face API file inventories; every one was public and contained actual weight files. AREX-2 adds a separately verified 46th open record. Tensor inventory totals sometimes differ from nominal model parameters because of padding, prediction heads, or auxiliary tensors; the audit does not replace supported nominal totals indiscriminately.

## Snapshot hashes

| File | Initial SHA256 | Final SHA256 |
| --- | --- | --- |
| `src/data/browsecomp.json` | `3986d17fab096b501f4ad60b9ef3e218c99916cee6805e5935178a2082d83c7d` | `a7ca35157c218a2ebee601f3ed9859838c12b3802f13aebc510c5ecc81047c32` |
| `src/data/model-research/browsecomp-1.json` | `c3f001043a5634c56da85d6c22bd58e53319f3edba898f513f4ad64341d8e5f0` | `782879101b2c31d731e25dd259c9bf5660f2cd3ea847f1534cfe546064d89f7b` |
| `src/data/model-research/browsecomp-2.json` | `1846558d9a29f9ed1d90d65996cccfd26040a27e3ae2f1fe2a13a73d5aae3055` | `979ca952b287c4f53abd115965375d8de66808b04bd883e7824f4b88a8e01eb2` |
| `src/data/model-research/browsecomp-3.json` | `c8e364a93042580d87b9688cc56b85c5423fd759e5be78c63875a1521854b953` | `7a4ae8465d859a8f12e5a70eb0088e1d340f290d1115d8bb1b497cdaf4640fbb` |
| `src/data/model-research/browsecomp-4.json` | `2d4695dc8af1864afd40d4eb9bd08738ce13fcb62083e324850971a24a890ef0` | `27be89b926726486f100c09f61a4d761c0cd7924685b85388ff008203bb6e5ad` |
| `src/lib/browsecomp-classification.ts` | `889a2a9c685fe9f6d9084b4d0c415a1585ef960d7b481cd1eea2253ca1092acf` | `889a2a9c685fe9f6d9084b4d0c415a1585ef960d7b481cd1eea2253ca1092acf` |
| `src/lib/model-classification.ts` | `ce6f2b248de5d3386f7236e56eda2a4f40b279a47b21016556a86d4351b14df3` | `ad0c3d9b72c957c4c9fa2bb36b607dd05720fcd6a06618bb4214da35f7922e37` |
| `src/lib/model-registry.ts` | `17d532b4ce3f26b929e4a866a117b7c052c8c83cdcb3d8cae50643ff38872e85` | `17d532b4ce3f26b929e4a866a117b7c052c8c83cdcb3d8cae50643ff38872e85` |

## Every result and classification

Every row below passed mapping, score/display, order, competition-rank, and classification-schema checks. `M` means its score/variant was manually matched to one of the primary sources discussed above during this audit. `S` means structural/source-retrieval coverage only; it is not a claim of a newly completed semantic audit. `P` marks the partial/indexed DeepDive check. Model IDs resolve to the research registry, whose evidence and uncertainty are retained.

| Result | Score | Runtime model IDs | Weights / size / basis | Score check |
| --- | ---: | --- | --- | --- |
| GPT-5.6 Sol Ultra | 92.2 | `gpt-5-6-sol` | closed / large / price | S |
| GPT-6 Astra | 91.5 | `gpt-6-astra` | closed / large / price | S |
| Kimi K3 | 91.2 | `kimi-k3` | open / large / parameters | M |
| Claude Opus 5 | 90.8 | `claude-opus-5` | closed / large / price | M |
| GPT-5.6 Sol | 90.4 | `gpt-5-6-sol` | closed / large / price | S |
| GPT-5.5 Pro | 90.1 | `gpt-5-5-pro` | closed / large / price | S |
| GPT-5.4 Pro | 89.3 | `gpt-5-4-pro` | closed / large / price | S |
| MiroThinker-H1 | 88.2 | `mirothinker-h1-stack` | uncertain / large / estimate | S |
| Claude Mythos 5 | 88 | `claude-mythos-5` | closed / large / price | M |
| Claude Fable 5 | 88 | `claude-fable-5` | closed / large / price | S |
| Claude Mythos Preview | 86.9 | `claude-mythos-preview` | closed / large / price | S |
| Kimi K2.6 | 86.3 | `kimi-k2-6` | open / large / parameters | S |
| Gemini 3.1 Pro | 85.9 | `gemini-3-1-pro` | closed / large / price | S |
| Claude Sonnet 5 | 84.7 | `claude-sonnet-5` | closed / large / price | M |
| GPT-5.5 | 84.4 | `gpt-5-5` | closed / large / price | S |
| Claude Opus 4.8 | 84.3 | `claude-opus-4-8` | closed / large / price | M |
| AREX-2 | 84.0 | `arex-2-27b` | open / small / parameters | M |
| Claude Opus 4.6 | 83.7 | `claude-opus-4-6` | closed / large / price | S |
| DeepSeek-V4-Pro-Max | 83.4 | `deepseek-v4-pro` | open / large / parameters | S |
| GPT-5.4 | 82.7 | `gpt-5-4` | closed / large / price | S |
| Claude Opus 4.7 | 79.3 | `claude-opus-4-7` | closed / large / price | S |
| GLM-5.1 | 79.3 | `glm-5-1` | open / large / parameters | S |
| Qwen3.5-397B-A17B | 78.6 | `qwen3-5-397b-a17b` | open / large / parameters | S |
| Kimi K2.5 | 78.4 | `kimi-k2-5` | open / large / parameters | S |
| GPT-5.2 Pro | 77.9 | `gpt-5-2-pro` | closed / large / price | S |
| GPT-5.3-Codex | 77.3 | `gpt-5-3-codex` | closed / large / price | S |
| Seed 2.0 Pro | 77.3 | `seed-2-0-pro` | closed / large / estimate | S |
| Inkling | 77.1 | `inkling` | open / large / parameters | S |
| MiniMax M2.5 | 76.3 | `minimax-m2-5` | open / large / parameters | S |
| Claude Sonnet 4.6 | 76.2 | `claude-sonnet-4-6` | closed / large / price | S |
| GLM-5 | 75.9 | `glm-5` | open / large / parameters | S |
| Agents-A1 | 75.5 | `agents-a1`, `gpt-4o-mini` | mixed / medium / price | S |
| Agents-A1-SFT | 74.6 | `agents-a1-sft`, `gpt-4o-mini` | uncertain / medium / price | S |
| Exa Agent High | 74 | `exa-agent-stack` | uncertain / large / estimate | M |
| DeepSeek-V4-Flash-Max | 73.2 | `deepseek-v4-flash` | open / large / parameters | S |
| LongCat-Flash-Thinking-2601 | 73.1 | `longcat-flash-thinking-2601` | open / large / parameters | S |
| Traverse-35B | 72.83 | `traverse-35b`, `traverse-summary-unknown` | uncertain / medium / estimate | M |
| Step-3.5-Flash | 69 | `step-3-5-flash` | open / large / parameters | S |
| GLM-4.7 | 67.5 | `glm-4-7` | open / large / parameters | S |
| GPT-5.2 | 65.8 | `gpt-5-2` | closed / large / price | S |
| Qwen3.5-122B-A10B | 63.8 | `qwen3-5-122b-a10b` | open / medium / parameters | S |
| MiniMax M2.1 | 62 | `minimax-m2-1` | open / large / parameters | M |
| LongSeeker | 61.5 | `longseeker-30b-sft`, `longseeker-summary-unknown` | uncertain / medium / estimate | S |
| Qwen3.5-27B | 61 | `qwen3-5-27b` | open / small / parameters | S |
| Qwen3.5-35B-A3B | 61 | `qwen3-5-35b-a3b` | open / small / parameters | S |
| Kimi K2-Thinking-0905 | 60.2 | `kimi-k2-thinking` | open / large / parameters | S |
| Gemini 3 Pro | 59.2 | `gemini-3-pro` | closed / large / estimate | S |
| MiMo-V2-Flash | 58.3 | `mimo-v2-flash` | open / large / parameters | S |
| Parallel Ultra8x | 58 | `parallel-task-ultra-stack` | uncertain / large / estimate | M |
| Parallel Ultra4x | 56 | `parallel-task-ultra-stack` | uncertain / large / estimate | M |
| GPT-5 | 54.9 | `gpt-5` | closed / large / price | M |
| Parallel Basic + GPT-5.4 harness | 53 | `gpt-5-4` | closed / large / price | M |
| Exa Agent Medium | 52.8 | `exa-agent-medium-stack` | uncertain / large / estimate | M |
| OpenAI Deep Research | 51.5 | `openai-deep-research-original` | closed / large / estimate | S |
| DeepSeek-V3.2 | 51.4 | `deepseek-v3-2` | open / large / parameters | S |
| DeepSeek-V3.2 (Thinking) | 51.4 | `deepseek-v3-2` | open / large / parameters | S |
| Parallel Advanced + GPT-5.4 harness | 51 | `gpt-5-4` | closed / large / price | M |
| Parallel Ultra2x | 51 | `parallel-task-ultra-stack` | uncertain / large / estimate | M |
| o3 | 49.7 | `o3` | closed / large / price | M |
| Sarvam-105B | 49.5 | `sarvam-105b` | open / medium / parameters | S |
| Perplexity Agent Advanced | 49 | `perplexity-agent-advanced-historical-stack` | uncertain / large / estimate | M |
| SMTL | 48.6 | `smtl-30b`, `deepseek-v3-2` | open / large / parameters | S |
| MiroThinker v1.0-72B | 47.1 | `mirothinker-v1-0-72b`, `mirothinker-v1-0-summary-unknown` | uncertain / medium / estimate | S |
| Perplexity Agent Deep | 47 | `perplexity-agent-deep-historical-stack` | uncertain / large / estimate | M |
| OpenSeeker-v2 | 46 | `openseeker-v2-30b-sft`, `openseeker-summary-unknown` | uncertain / medium / estimate | S |
| WebAnchor-30B | 46 | `webanchor-30b` | uncertain / small / parameters | S |
| GLM-4.6 | 45.1 | `glm-4-6` | open / large / parameters | S |
| Parallel Ultra | 45 | `parallel-task-ultra-stack` | uncertain / large / estimate | M |
| Grok 4 Fast | 44.9 | `grok-4-fast` | closed / medium / price | S |
| MiniMax M2 | 44 | `minimax-m2` | open / large / parameters | M |
| Exa Agent Low | 43.5 | `exa-agent-low-undisclosed` | uncertain / large / estimate | M |
| Tongyi DeepResearch | 43.4 | `tongyi-deepresearch-30b-a3b`, `tongyi-deepresearch-summary-unknown` | uncertain / medium / estimate | S |
| GLM-4.7-Flash | 42.8 | `glm-4-7-flash` | open / small / parameters | S |
| Tavily + GPT-5.4 harness | 42 | `gpt-5-4` | closed / large / price | M |
| DeepSeek-V3.2-Exp | 40.1 | `deepseek-v3-2-exp` | open / large / parameters | S |
| Exa + GPT-5.4 harness | 40 | `gpt-5-4` | closed / large / price | M |
| AgentFounder-30B | 39.9 | `agentfounder-30b`, `agentfounder-summary-unknown` | uncertain / medium / estimate | S |
| Sarvam-30B | 35.5 | `sarvam-30b` | open / small / parameters | S |
| DeepMiner-32B | 33.5 | `deepminer-32b` | uncertain / small / parameters | S |
| Nemotron 3 Super (120B A12B) | 31.3 | `nemotron-3-super-120b-a12b` | open / medium / parameters | M |
| DeepSeek-V3.1 | 30 | `deepseek-v3-1` | open / large / parameters | S |
| BrowseMaster | 30 | `deepseek-r1-0528`, `deepseek-r1` | open / large / parameters | S |
| OpenSeeker | 29.5 | `openseeker-v1-30b-sft`, `openseeker-summary-unknown` | uncertain / medium / estimate | S |
| o4-mini | 28.3 | `o4-mini` | closed / large / price | M |
| GLM-4.5 | 26.4 | `glm-4-5` | open / large / parameters | S |
| GLM-4.5-Air | 21.3 | `glm-4-5-air` | open / medium / parameters | S |
| Perplexity Agent Pro | 20 | `perplexity-agent-pro-undisclosed` | uncertain / large / estimate | M |
| WebExplorer-8B (RL) | 15.7 | `webexplorer-8b` | open / small / parameters | S |
| InfoAgent | 15.3 | `infoagent-14b`, `gpt-4o-mini`, `qwen3-embedding-0-6b`, `qwen3-reranker-0-6b` | uncertain / medium / price | S |
| DeepDive-32B | 15.3 | `deepdive-32b` | uncertain / small / parameters | P |
| Exa Research Pro | 14 | `exa-research-pro-undisclosed` | uncertain / large / estimate | M |
| WebSailor-72B | 12 | `websailor-72b`, `qwen2-5-72b-instruct` | uncertain / medium / parameters | S |
| WebSailor-32B | 10.5 | `websailor-32b`, `qwen2-5-72b-instruct` | open / medium / parameters | S |
| Perplexity Agent Fast | 10 | `perplexity-agent-fast-undisclosed` | uncertain / medium / estimate | M |
| OpenAI o1 | 9.9 | `openai-o1` | closed / large / price | S |
| DeepSeek-R1-0528 | 8.9 | `deepseek-r1-0528` | open / large / parameters | S |
| Claude Opus 4.1 (Parallel Task API benchmark) | 7 | `claude-opus-4-1` | closed / large / price | M |
| WebSailor-7B | 6.7 | `websailor-7b`, `qwen2-5-72b-instruct` | open / medium / parameters | S |
| Perplexity Sonar Deep Research | 6 | `sonar-deep-research-undisclosed` | uncertain / large / estimate | M |
| GPT-4o + browsing | 1.9 | `gpt-4o-search-preview-2025-03-11` | closed / large / price | S |
| GPT-4.5 | 0.9 | `gpt-4-5` | closed / large / price | S |
| GPT-4o | 0.6 | `gpt-4o-2024-08-06` | closed / large / price | S |

## Released-weight inventory checks

Counts below are actual `.safetensors`/`.bin` files returned by publisher APIs; they do not count README promises as released weights. Full revision IDs and raw API bodies are in the local audit cache. All were HTTP 200 and public.

| Model ID | Publisher inventory | Weight files | Revision |
| --- | --- | ---: | --- |
| `kimi-k3` | [API](https://huggingface.co/api/models/moonshotai/Kimi-K3) | 96 | `f831ab66814297da540d832a5235f8e904f29d06` |
| `kimi-k2-6` | [API](https://huggingface.co/api/models/moonshotai/Kimi-K2.6) | 64 | `7eb5002f6aadc958aed6a9177b7ed26bb94011bb` |
| `kimi-k2-5` | [API](https://huggingface.co/api/models/moonshotai/Kimi-K2.5) | 64 | `4d01dfe0332d63057c186e0b262165819efb6611` |
| `deepseek-v4-pro` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Pro) | 64 | `b5968e9190ef611bbf34a7229255be88a0e937c1` |
| `deepseek-v4-flash` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Flash) | 46 | `60d8d70770c6776ff598c94bb586a859a38244f1` |
| `glm-5-1` | [API](https://huggingface.co/api/models/zai-org/GLM-5.1) | 282 | `26e1bd6e011feb778d25ae34b09b07074139d92d` |
| `glm-5` | [API](https://huggingface.co/api/models/zai-org/GLM-5) | 282 | `c183ef8c61faee82855eca1ed9bb3a9a7ce3b0b2` |
| `qwen3-5-397b-a17b` | [API](https://huggingface.co/api/models/Qwen/Qwen3.5-397B-A17B) | 94 | `8472618112abcbd45acbcdc58436aff4233c23f7` |
| `inkling` | [API](https://huggingface.co/api/models/thinkingmachines/Inkling) | 109 | `828496eeae4c243ff1a22f7f28ff83694f2f7bc9` |
| `minimax-m2-5` | [API](https://huggingface.co/api/models/MiniMaxAI/MiniMax-M2.5) | 125 | `f710177d938eff80b684d42c5aa84b382612f21f` |
| `agents-a1` | [API](https://huggingface.co/api/models/InternScience/Agents-A1) | 14 | `e4a30b76e439b5093ac4c14efa6017718781d48f` |
| `longcat-flash-thinking-2601` | [API](https://huggingface.co/api/models/meituan-longcat/LongCat-Flash-Thinking-2601) | 75 | `dc72d0840cc7b4f1488bf32a14eedc5c3c8a2164` |
| `step-3-5-flash` | [API](https://huggingface.co/api/models/stepfun-ai/Step-3.5-Flash) | 44 | `ab446a3de5e171ea341227e24bb1f090e1b771f7` |
| `glm-4-7` | [API](https://huggingface.co/api/models/zai-org/GLM-4.7) | 93 | `602d01efcdd332c5238ca4bcede555defbe83eb7` |
| `qwen3-5-122b-a10b` | [API](https://huggingface.co/api/models/Qwen/Qwen3.5-122B-A10B) | 39 | `dc4d348443bc740c68e2d77492492c11606384d5` |
| `minimax-m2-1` | [API](https://huggingface.co/api/models/MiniMaxAI/MiniMax-M2.1) | 130 | `cd97f59135f37b2a6bf09356e485d5e4aeb7dc9c` |
| `longseeker-30b-sft` | [API](https://huggingface.co/api/models/PolarSeeker/LongSeeker-30B-SFT) | 12 | `afea4807aa196577c2eb872160b98b7a42e5214d` |
| `qwen3-5-27b` | [API](https://huggingface.co/api/models/Qwen/Qwen3.5-27B) | 11 | `fc05daec18b0a78c049392ed2e771dde82bdf654` |
| `qwen3-5-35b-a3b` | [API](https://huggingface.co/api/models/Qwen/Qwen3.5-35B-A3B) | 14 | `59d61f3ce65a6d9863b86d2e96597125219dc754` |
| `kimi-k2-thinking` | [API](https://huggingface.co/api/models/moonshotai/Kimi-K2-Thinking) | 62 | `a51ccc050d73dab088bf7b0e2dd9b30ae85a4e55` |
| `mimo-v2-flash` | [API](https://huggingface.co/api/models/XiaomiMiMo/MiMo-V2-Flash) | 145 | `1afd314a2406c282e0956375c34a676501c78649` |
| `deepseek-v3-2` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V3.2) | 163 | `a7e62ac04ecb2c0a54d736dc46601c5606cf10a6` |
| `sarvam-105b` | [API](https://huggingface.co/api/models/sarvamai/sarvam-105b) | 85 | `abe264bdb8fb2244daadaa59ebc2020b3c139e89` |
| `smtl-30b` | [API](https://huggingface.co/api/models/PersonalAILab/SMTL-30B) | 13 | `f30a94f8ad2ca2a257741e530c363a3486aa8627` |
| `mirothinker-v1-0-72b` | [API](https://huggingface.co/api/models/miromind-ai/MiroThinker-v1.0-72B) | 37 | `8265803e2009a1865daa2ec1a402846d7e8387bc` |
| `openseeker-v2-30b-sft` | [API](https://huggingface.co/api/models/PolarSeeker/OpenSeeker-v2-30B-SFT) | 12 | `3d529319081ea536ced99cc644e7476a2f694518` |
| `glm-4-6` | [API](https://huggingface.co/api/models/zai-org/GLM-4.6) | 93 | `be72194883d968d7923a07e2f61681ea9a2826d1` |
| `minimax-m2` | [API](https://huggingface.co/api/models/MiniMaxAI/MiniMax-M2) | 130 | `757303d492a50514c312788b5247a4f696a4c6a3` |
| `tongyi-deepresearch-30b-a3b` | [API](https://huggingface.co/api/models/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B) | 16 | `4b0ac5767427a55d08a254f0367e2934976598e0` |
| `glm-4-7-flash` | [API](https://huggingface.co/api/models/zai-org/GLM-4.7-Flash) | 48 | `7dd20894a642a0aa287e9827cb1a1f7f91386b67` |
| `deepseek-v3-2-exp` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V3.2-Exp) | 163 | `194c67e12b1b0d6df0ef373ddcf215bc84027409` |
| `sarvam-30b` | [API](https://huggingface.co/api/models/sarvamai/sarvam-30b) | 26 | `071ae95e933605ca1104a6b4524a36a98488efa4` |
| `nemotron-3-super-120b-a12b` | [API](https://huggingface.co/api/models/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16) | 50 | `2dc98e2afe4face0e4ce40972a915c45368bd34a` |
| `deepseek-v3-1` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V3.1) | 163 | `c0781d039fb7a1ba2abc4add0bdc293e92d2b8db` |
| `deepseek-r1` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-R1) | 163 | `56d4cbbb4d29f4355bab4b9a39ccb717a14ad5ad` |
| `deepseek-r1-0528` | [API](https://huggingface.co/api/models/deepseek-ai/DeepSeek-R1-0528) | 163 | `4236a6af538feda4548eca9ab308586007567f52` |
| `openseeker-v1-30b-sft` | [API](https://huggingface.co/api/models/PolarSeeker/OpenSeeker-v1-30B-SFT) | 12 | `793c4201805772279e757f53fbe98c0f76e1857d` |
| `glm-4-5` | [API](https://huggingface.co/api/models/zai-org/GLM-4.5) | 93 | `cbb2c7cfb52fa128a9660cb1a7a78e017899e115` |
| `glm-4-5-air` | [API](https://huggingface.co/api/models/zai-org/GLM-4.5-Air) | 47 | `a24ceef6ce4f3536971efe9b778bdaa1bab18daa` |
| `webexplorer-8b` | [API](https://huggingface.co/api/models/hkust-nlp/WebExplorer-8B) | 4 | `c7296358b988ffa5d47679f0d6fc165bfd19243a` |
| `qwen3-embedding-0-6b` | [API](https://huggingface.co/api/models/Qwen/Qwen3-Embedding-0.6B) | 1 | `97b0c614be4d77ee51c0cef4e5f07c00f9eb65b3` |
| `qwen3-reranker-0-6b` | [API](https://huggingface.co/api/models/Qwen/Qwen3-Reranker-0.6B) | 1 | `e61197ed45024b0ed8a2d74b80b4d909f1255473` |
| `websailor-32b` | [API](https://huggingface.co/api/models/Alibaba-NLP/WebSailor-32B) | 14 | `ef1019c9600eda1f216c0defdd3cd6f80c142869` |
| `websailor-7b` | [API](https://huggingface.co/api/models/Alibaba-NLP/WebSailor-7B) | 4 | `872291b4f961d013e5dccc6a60d565f19e4657c3` |
| `qwen2-5-72b-instruct` | [API](https://huggingface.co/api/models/Qwen/Qwen2.5-72B-Instruct) | 37 | `495f39366efef23836d0cfae4fbe635880d2be31` |
| `arex-2-27b` | [API](https://huggingface.co/api/models/BAAI/AREX-2) | 11 | `d4e3502f92d9e889031c2d04e387ab2eb3520268` |

## Complete source URL inventory

This table includes the initial 204 URLs plus newly introduced references. `retained/added` URLs occur in the final registry/data; `replaced` URLs explain audit repairs. Roles identify where a URL was used. HTTP 200 entries reflect reachability and **do not imply all linked claims were semantically revalidated**.

| URL | State | Retrieval | Roles |
| --- | --- | --- | --- |
| [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing) | retained/added | 200 | model |
| [api-docs.deepseek.com/quick_start/pricing/](https://api-docs.deepseek.com/quick_start/pricing/) | retained/added | 200 | model |
| [arxiv.org/abs/2508.09129](https://arxiv.org/abs/2508.09129) | retained/added | 200 | result |
| [arxiv.org/abs/2509.13310](https://arxiv.org/abs/2509.13310) | retained/added | 200 | result |
| [arxiv.org/abs/2509.25189](https://arxiv.org/abs/2509.25189) | retained/added | 200 | result |
| [arxiv.org/abs/2510.08276](https://arxiv.org/abs/2510.08276) | retained/added | 200 | result |
| [arxiv.org/abs/2511.11793](https://arxiv.org/abs/2511.11793) | retained/added | 200 | result |
| [arxiv.org/abs/2601.03164](https://arxiv.org/abs/2601.03164) | retained/added | 200 | result |
| [arxiv.org/abs/2602.10604](https://arxiv.org/abs/2602.10604) | retained/added | 200 | result |
| [arxiv.org/abs/2602.22675](https://arxiv.org/abs/2602.22675) | retained/added | 200 | result |
| [arxiv.org/abs/2603.15594](https://arxiv.org/abs/2603.15594) | retained/added | 200 | result |
| [arxiv.org/abs/2605.04036](https://arxiv.org/abs/2605.04036) | retained/added | 200 | result |
| [arxiv.org/abs/2605.05191](https://arxiv.org/abs/2605.05191) | retained/added | 200 | result |
| [arxiv.org/abs/2606.30616](https://arxiv.org/abs/2606.30616) | retained/added | 200 | result, submission |
| [arxiv.org/html/2504.12516](https://arxiv.org/html/2504.12516) | retained/added | 200 | model, submission |
| [arxiv.org/html/2507.02592v1](https://arxiv.org/html/2507.02592v1) | retained/added | 200 | model, submission |
| [arxiv.org/html/2508.09129v1](https://arxiv.org/html/2508.09129v1) | retained/added | 200 | submission |
| [arxiv.org/html/2509.06501v1](https://arxiv.org/html/2509.06501v1) | retained/added | 200 | model, submission |
| [arxiv.org/html/2509.13310v1](https://arxiv.org/html/2509.13310v1) | retained/added | 200 | model, submission |
| [arxiv.org/html/2509.25189v1](https://arxiv.org/html/2509.25189v1) | retained/added | 200 | model, submission |
| [arxiv.org/html/2510.08276v1](https://arxiv.org/html/2510.08276v1) | retained/added | 200 | model, submission |
| [arxiv.org/html/2510.24701v1](https://arxiv.org/html/2510.24701v1) | retained/added | 200 | model |
| [arxiv.org/html/2511.11793](https://arxiv.org/html/2511.11793) | retained/added | 200 | model |
| [arxiv.org/html/2512.02556](https://arxiv.org/html/2512.02556) | retained/added | 200 | model |
| [arxiv.org/html/2601.03164](https://arxiv.org/html/2601.03164) | retained/added | 200 | model, submission |
| [arxiv.org/html/2602.22675](https://arxiv.org/html/2602.22675) | retained/added | 200 | model, submission |
| [arxiv.org/html/2603.15594v1](https://arxiv.org/html/2603.15594v1) | retained/added | 200 | model, submission |
| [arxiv.org/html/2603.15726v1](https://arxiv.org/html/2603.15726v1) | retained/added | 200 | model |
| [arxiv.org/html/2605.04036](https://arxiv.org/html/2605.04036) | retained/added | 200 | submission |
| [arxiv.org/html/2605.05191](https://arxiv.org/html/2605.05191) | retained/added | 200 | model, submission |
| [arxiv.org/html/2605.26494v1](https://arxiv.org/html/2605.26494v1) | retained/added | 200 | model |
| [arxiv.org/html/2606.30616v1](https://arxiv.org/html/2606.30616v1) | retained/added | 200 | model |
| [arxiv.org/html/2609.37082v2](https://arxiv.org/html/2609.37082v2) | retained/added | 200 | model, result, submission |
| [arxiv.org/html/2609.37082v2#A6.SS1.SSS2](https://arxiv.org/html/2609.37082v2#A6.SS1.SSS2) | retained/added | 200 | model |
| [arxiv.org/html/2609.38288v1](https://arxiv.org/html/2609.38288v1) | retained/added | 200 | model, result, submission |
| [arxiv.org/pdf/2507.02592](https://arxiv.org/pdf/2507.02592) | retained/added | 200 | result |
| [build.nvidia.com/nvidia/nemotron-3-super-120b-a12b/modelcard](https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b/modelcard) | retained/added | 200 | model, result, submission |
| [community.perplexity.ai/t/introducing-the-agent-api-a-managed-runtime-for-agentic-workflows/4733](https://community.perplexity.ai/t/introducing-the-agent-api-a-managed-runtime-for-agentic-workflows/4733) | retained/added | 200 | model |
| [deepmind.google/models/model-cards/gemini-3-1-pro/](https://deepmind.google/models/model-cards/gemini-3-1-pro/) | retained/added | 200 | model, result, submission |
| [developers.openai.com/api/docs/models/gpt-4.5-preview](https://developers.openai.com/api/docs/models/gpt-4.5-preview) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-4o](https://developers.openai.com/api/docs/models/gpt-4o) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-4o-mini](https://developers.openai.com/api/docs/models/gpt-4o-mini) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-4o-search-preview](https://developers.openai.com/api/docs/models/gpt-4o-search-preview) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-5](https://developers.openai.com/api/docs/models/gpt-5) | retained/added | 200 | model, submission |
| [developers.openai.com/api/docs/models/gpt-5.2](https://developers.openai.com/api/docs/models/gpt-5.2) | retained/added | 200 | model, submission |
| [developers.openai.com/api/docs/models/gpt-5.2-pro](https://developers.openai.com/api/docs/models/gpt-5.2-pro) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-5.3-codex](https://developers.openai.com/api/docs/models/gpt-5.3-codex) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) | retained/added | 200 | model, submission |
| [developers.openai.com/api/docs/models/gpt-5.4-pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-5.5-pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-5.6-sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/gpt-6-astra](https://developers.openai.com/api/docs/models/gpt-6-astra) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/o1](https://developers.openai.com/api/docs/models/o1) | retained/added | 200 | model |
| [developers.openai.com/api/docs/models/o3](https://developers.openai.com/api/docs/models/o3) | retained/added | 200 | model, submission |
| [developers.openai.com/api/docs/models/o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) | retained/added | 200 | model, submission |
| [developers.openai.com/api/docs/models/o4-mini](https://developers.openai.com/api/docs/models/o4-mini) | retained/added | 200 | model, submission |
| [docs.byteplus.com/en/docs/modelark/model-pricing](https://docs.byteplus.com/en/docs/modelark/model-pricing) | retained/added | 200 | model |
| [docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview) | retained/added | 200 | model, submission |
| [docs.perplexity.ai/docs/agent-api/presets](https://docs.perplexity.ai/docs/agent-api/presets) | retained/added | 200 | model, submission |
| [docs.perplexity.ai/docs/resources/changelog](https://docs.perplexity.ai/docs/resources/changelog) | retained/added | 200 | model |
| [docs.z.ai/guides/llm/glm-4.5](https://docs.z.ai/guides/llm/glm-4.5) | retained/added | 200 | result, submission |
| [docs.z.ai/guides/llm/glm-4.7](https://docs.z.ai/guides/llm/glm-4.7) | retained/added | 200 | result, submission |
| [docs.z.ai/guides/llm/glm-5](https://docs.z.ai/guides/llm/glm-5) | retained/added | 200 | result, submission |
| [docs.z.ai/guides/llm/glm-5.1](https://docs.z.ai/guides/llm/glm-5.1) | retained/added | 200 | result, submission |
| [docs.z.ai/guides/overview/pricing](https://docs.z.ai/guides/overview/pricing) | retained/added | 200 | model |
| [exa.ai/blog/exa-agent](https://exa.ai/blog/exa-agent) | retained/added | 200 | model, result, submission |
| [github.com/Alibaba-NLP/DeepResearch](https://github.com/Alibaba-NLP/DeepResearch) | retained/added | 200 | model, submission |
| [github.com/Alibaba-NLP/DeepResearch/blob/main/.env.example](https://github.com/Alibaba-NLP/DeepResearch/blob/main/.env.example) | retained/added | 200 | model |
| [github.com/Alibaba-NLP/DeepResearch/tree/main/Agent/AgentFounder](https://github.com/Alibaba-NLP/DeepResearch/tree/main/Agent/AgentFounder) | retained/added | 200 | model |
| [github.com/Alibaba-NLP/DeepResearch/tree/main/WebAgent/WebSailor](https://github.com/Alibaba-NLP/DeepResearch/tree/main/WebAgent/WebSailor) | retained/added | 200 | model, submission |
| [github.com/Alibaba-NLP/WebAgent](https://github.com/Alibaba-NLP/WebAgent) | retained/added | 200 | repo |
| [github.com/ByteDance-BandAI/Traverse](https://github.com/ByteDance-BandAI/Traverse) | retained/added | 200 | repo, submission |
| [github.com/ByteDance-BandAI/Traverse#search-tools](https://github.com/ByteDance-BandAI/Traverse#search-tools) | retained/added | 200 | model |
| [github.com/ByteDance-BandAI/Traverse/blob/main/tools/function_tools.py](https://github.com/ByteDance-BandAI/Traverse/blob/main/tools/function_tools.py) | retained/added | 200 | model |
| [github.com/InternScience/Agents-A1/blob/main/evaluation/Search/.env.example](https://github.com/InternScience/Agents-A1/blob/main/evaluation/Search/.env.example) | retained/added | 200 | submission |
| [github.com/InternScience/Agents-A1/blob/main/evaluation/Search/inference/tool_visit.py](https://github.com/InternScience/Agents-A1/blob/main/evaluation/Search/inference/tool_visit.py) | retained/added | 200 | submission |
| [github.com/InternScience/Agents-A1/tree/main/evaluation](https://github.com/InternScience/Agents-A1/tree/main/evaluation) | retained/added | 200 | submission |
| [github.com/MiniMax-AI/MiniMax-M2](https://github.com/MiniMax-AI/MiniMax-M2) | retained/added | 200 | repo |
| [github.com/MiniMax-AI/MiniMax-M2.5](https://github.com/MiniMax-AI/MiniMax-M2.5) | retained/added | 200 | repo |
| [github.com/MiroMindAI/MiroThinker](https://github.com/MiroMindAI/MiroThinker) | retained/added | 200 | model, submission |
| [github.com/MiroMindAI/MiroThinker/blob/main/apps/miroflow-agent/conf/agent/mirothinker_v1.0.yaml](https://github.com/MiroMindAI/MiroThinker/blob/main/apps/miroflow-agent/conf/agent/mirothinker_v1.0.yaml) | retained/added | 200 | model, submission |
| [github.com/MiroMindAI/MiroThinker/blob/main/libs/miroflow-tools/src/miroflow_tools/dev_mcp_servers/jina_scrape_llm_summary.py](https://github.com/MiroMindAI/MiroThinker/blob/main/libs/miroflow-tools/src/miroflow_tools/dev_mcp_servers/jina_scrape_llm_summary.py) | retained/added | 200 | model |
| [github.com/OPPO-PersonalAI/Agent_Foundation_Models](https://github.com/OPPO-PersonalAI/Agent_Foundation_Models) | retained/added | 200 | submission |
| [github.com/PolarSeeker/LongSeeker](https://github.com/PolarSeeker/LongSeeker) | retained/added | 200 | model, submission |
| [github.com/PolarSeeker/LongSeeker/blob/main/tools/utils.py](https://github.com/PolarSeeker/LongSeeker/blob/main/tools/utils.py) | retained/added | 200 | model, submission |
| [github.com/PolarSeeker/OpenSeeker](https://github.com/PolarSeeker/OpenSeeker) | retained/added | 200 | repo, submission |
| [github.com/PolarSeeker/OpenSeeker/blob/main/src/llm_tool_openseeker.py](https://github.com/PolarSeeker/OpenSeeker/blob/main/src/llm_tool_openseeker.py) | retained/added | 200 | model |
| [github.com/PolarSeeker/OpenSeeker/blob/main/src/tools/visit.py](https://github.com/PolarSeeker/OpenSeeker/blob/main/src/tools/visit.py) | retained/added | 200 | model, submission |
| [github.com/THUDM/DeepDive](https://github.com/THUDM/DeepDive) | retained/added | 200 | model, repo, submission |
| [github.com/VectorSpaceLab/AREX-2](https://github.com/VectorSpaceLab/AREX-2) | retained/added | 200 | submission |
| [github.com/VectorSpaceLab/AREX-2/blob/main/docs/evaluation/configuration.md](https://github.com/VectorSpaceLab/AREX-2/blob/main/docs/evaluation/configuration.md) | retained/added | 200 | model, submission |
| [github.com/microsoft/InfoAgent](https://github.com/microsoft/InfoAgent) | retained/added | 200 | model, submission |
| [github.com/zai-org/GLM-5](https://github.com/zai-org/GLM-5) | retained/added | 200 | model |
| [huggingface.co/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B](https://huggingface.co/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B) | retained/added | 200 | model, repo |
| [huggingface.co/Alibaba-NLP/WebSailor](https://huggingface.co/Alibaba-NLP/WebSailor) | retained/added | 200 | model |
| [huggingface.co/Alibaba-NLP/WebSailor-32B](https://huggingface.co/Alibaba-NLP/WebSailor-32B) | retained/added | 200 | model |
| [huggingface.co/Alibaba-NLP/WebSailor-7B](https://huggingface.co/Alibaba-NLP/WebSailor-7B) | retained/added | 200 | model |
| [huggingface.co/InternScience/Agents-A1](https://huggingface.co/InternScience/Agents-A1) | retained/added | 200 | model |
| [huggingface.co/InternScience/models](https://huggingface.co/InternScience/models) | retained/added | 200 | model |
| [huggingface.co/MiniMaxAI/MiniMax-M2](https://huggingface.co/MiniMaxAI/MiniMax-M2) | retained/added | 200 | model |
| [huggingface.co/MiniMaxAI/MiniMax-M2.1](https://huggingface.co/MiniMaxAI/MiniMax-M2.1) | retained/added | 200 | model, result, submission |
| [huggingface.co/MiniMaxAI/MiniMax-M2.1/tree/main](https://huggingface.co/MiniMaxAI/MiniMax-M2.1/tree/main) | retained/added | 200 | model |
| [huggingface.co/MiniMaxAI/MiniMax-M2.5](https://huggingface.co/MiniMaxAI/MiniMax-M2.5) | retained/added | 200 | model |
| [huggingface.co/PersonalAILab/SMTL-30B](https://huggingface.co/PersonalAILab/SMTL-30B) | retained/added | 200 | model |
| [huggingface.co/PersonalAILab/SMTL-30B/blob/main/config.json](https://huggingface.co/PersonalAILab/SMTL-30B/blob/main/config.json) | retained/added | 200 | model |
| [huggingface.co/PersonalAILab/SMTL-30B/tree/main](https://huggingface.co/PersonalAILab/SMTL-30B/tree/main) | retained/added | 200 | model |
| [huggingface.co/PolarSeeker/LongSeeker-30B-SFT](https://huggingface.co/PolarSeeker/LongSeeker-30B-SFT) | retained/added | 200 | model |
| [huggingface.co/PolarSeeker/LongSeeker-30B-SFT/tree/main](https://huggingface.co/PolarSeeker/LongSeeker-30B-SFT/tree/main) | retained/added | 200 | model |
| [huggingface.co/PolarSeeker/OpenSeeker-v1-30B-SFT](https://huggingface.co/PolarSeeker/OpenSeeker-v1-30B-SFT) | retained/added | 200 | model |
| [huggingface.co/PolarSeeker/OpenSeeker-v2-30B-SFT](https://huggingface.co/PolarSeeker/OpenSeeker-v2-30B-SFT) | retained/added | 200 | model |
| [huggingface.co/PolarSeeker/OpenSeeker-v2-30B-SFT/tree/main](https://huggingface.co/PolarSeeker/OpenSeeker-v2-30B-SFT/tree/main) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen2.5-72B-Instruct](https://huggingface.co/Qwen/Qwen2.5-72B-Instruct) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507](https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3.5-122B-A10B](https://huggingface.co/Qwen/Qwen3.5-122B-A10B) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/Qwen/Qwen3.5-122B-A10B/tree/main](https://huggingface.co/Qwen/Qwen3.5-122B-A10B/tree/main) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3.5-27B](https://huggingface.co/Qwen/Qwen3.5-27B) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/Qwen/Qwen3.5-27B/tree/main](https://huggingface.co/Qwen/Qwen3.5-27B/tree/main) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3.5-35B-A3B](https://huggingface.co/Qwen/Qwen3.5-35B-A3B) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/Qwen/Qwen3.5-35B-A3B/tree/main](https://huggingface.co/Qwen/Qwen3.5-35B-A3B/tree/main) | retained/added | 200 | model |
| [huggingface.co/Qwen/Qwen3.5-397B-A17B](https://huggingface.co/Qwen/Qwen3.5-397B-A17B) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/XiaomiMiMo/MiMo-V2-Flash](https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash) | retained/added | 200 | model, repo, submission |
| [huggingface.co/XiaomiMiMo/MiMo-V2-Flash-Base](https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash-Base) | retained/added | 200 | result |
| [huggingface.co/XiaomiMiMo/MiMo-V2-Flash/tree/main](https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash/tree/main) | retained/added | 200 | model |
| [huggingface.co/api/models/BAAI/AREX-2](https://huggingface.co/api/models/BAAI/AREX-2) | retained/added | 200 | model |
| [huggingface.co/api/models/MiniMaxAI/MiniMax-M2](https://huggingface.co/api/models/MiniMaxAI/MiniMax-M2) | retained/added | 200 | model |
| [huggingface.co/api/models/MiniMaxAI/MiniMax-M2.1](https://huggingface.co/api/models/MiniMaxAI/MiniMax-M2.1) | retained/added | 200 | model |
| [huggingface.co/api/models/deepseek-ai/DeepSeek-R1](https://huggingface.co/api/models/deepseek-ai/DeepSeek-R1) | retained/added | 200 | model |
| [huggingface.co/api/models/deepseek-ai/DeepSeek-V3.1](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V3.1) | retained/added | 200 | model |
| [huggingface.co/api/models/deepseek-ai/DeepSeek-V3.2](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V3.2) | retained/added | 200 | model |
| [huggingface.co/api/models/deepseek-ai/DeepSeek-V3.2-Exp](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V3.2-Exp) | retained/added | 200 | model |
| [huggingface.co/api/models/sarvamai/sarvam-30b](https://huggingface.co/api/models/sarvamai/sarvam-30b) | retained/added | 200 | model |
| [huggingface.co/api/models/zai-org/GLM-4.5](https://huggingface.co/api/models/zai-org/GLM-4.5) | retained/added | 200 | model |
| [huggingface.co/api/models/zai-org/GLM-4.5-Air](https://huggingface.co/api/models/zai-org/GLM-4.5-Air) | retained/added | 200 | model |
| [huggingface.co/api/models/zai-org/GLM-4.6](https://huggingface.co/api/models/zai-org/GLM-4.6) | retained/added | 200 | model |
| [huggingface.co/api/models/zai-org/GLM-4.7](https://huggingface.co/api/models/zai-org/GLM-4.7) | retained/added | 200 | model |
| [huggingface.co/api/models/zai-org/GLM-4.7-Flash](https://huggingface.co/api/models/zai-org/GLM-4.7-Flash) | retained/added | 200 | model |
| [huggingface.co/collections/miromind-ai/mirothinker-17](https://huggingface.co/collections/miromind-ai/mirothinker-17) | retained/added | 200 | repo |
| [huggingface.co/deepseek-ai/DeepSeek-R1](https://huggingface.co/deepseek-ai/DeepSeek-R1) | retained/added | 200 | model |
| [huggingface.co/deepseek-ai/DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/deepseek-ai/DeepSeek-V3.1](https://huggingface.co/deepseek-ai/DeepSeek-V3.1) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/deepseek-ai/DeepSeek-V3.2](https://huggingface.co/deepseek-ai/DeepSeek-V3.2) | retained/added | 200 | model, repo, submission |
| [huggingface.co/deepseek-ai/DeepSeek-V3.2-Exp](https://huggingface.co/deepseek-ai/DeepSeek-V3.2-Exp) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/deepseek-ai/DeepSeek-V3.2/resolve/main/assets/paper.pdf](https://huggingface.co/deepseek-ai/DeepSeek-V3.2/resolve/main/assets/paper.pdf) | retained/added | 200 | result |
| [huggingface.co/deepseek-ai/DeepSeek-V3.2/tree/main](https://huggingface.co/deepseek-ai/DeepSeek-V3.2/tree/main) | retained/added | 200 | model |
| [huggingface.co/deepseek-ai/DeepSeek-V4-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/deepseek-ai/DeepSeek-V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/hkust-nlp/WebExplorer-8B](https://huggingface.co/hkust-nlp/WebExplorer-8B) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/meituan-longcat/LongCat-Flash-Thinking-2601](https://huggingface.co/meituan-longcat/LongCat-Flash-Thinking-2601) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/meituan-longcat/LongCat-Flash-Thinking-2601/tree/main](https://huggingface.co/meituan-longcat/LongCat-Flash-Thinking-2601/tree/main) | retained/added | 200 | model |
| [huggingface.co/microsoft/InfoAgent](https://huggingface.co/microsoft/InfoAgent) | retained/added | 200 | model |
| [huggingface.co/miromind-ai/MiroThinker-v1.0-72B](https://huggingface.co/miromind-ai/MiroThinker-v1.0-72B) | retained/added | 200 | model, repo, submission |
| [huggingface.co/miromind-ai/MiroThinker-v1.0-72B/tree/main](https://huggingface.co/miromind-ai/MiroThinker-v1.0-72B/tree/main) | retained/added | 200 | model |
| [huggingface.co/moonshotai/Kimi-K2-Thinking](https://huggingface.co/moonshotai/Kimi-K2-Thinking) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/moonshotai/Kimi-K2-Thinking/tree/main](https://huggingface.co/moonshotai/Kimi-K2-Thinking/tree/main) | retained/added | 200 | model |
| [huggingface.co/moonshotai/Kimi-K2.5](https://huggingface.co/moonshotai/Kimi-K2.5) | retained/added | 200 | model, repo, result, submission |
| [huggingface.co/moonshotai/Kimi-K2.6](https://huggingface.co/moonshotai/Kimi-K2.6) | retained/added | 200 | model, repo |
| [huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3) | retained/added | 200 | model |
| [huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16) | retained/added | 200 | model, repo |
| [huggingface.co/nvidia/Nemotron-3-Super-120B-A12B](https://huggingface.co/nvidia/Nemotron-3-Super-120B-A12B) | replaced | 401 | repo |
| [huggingface.co/sarvamai/sarvam-105b](https://huggingface.co/sarvamai/sarvam-105b) | retained/added | 200 | model, repo, submission |
| [huggingface.co/sarvamai/sarvam-105b/tree/main](https://huggingface.co/sarvamai/sarvam-105b/tree/main) | retained/added | 200 | model |
| [huggingface.co/sarvamai/sarvam-30b](https://huggingface.co/sarvamai/sarvam-30b) | retained/added | 200 | model, repo |
| [huggingface.co/stepfun-ai/Step-3.5-Flash](https://huggingface.co/stepfun-ai/Step-3.5-Flash) | retained/added | 200 | model, submission |
| [huggingface.co/stepfun-ai/Step-3.5-Flash/tree/main](https://huggingface.co/stepfun-ai/Step-3.5-Flash/tree/main) | retained/added | 200 | model |
| [huggingface.co/thinkingmachines/Inkling](https://huggingface.co/thinkingmachines/Inkling) | retained/added | 200 | model |
| [huggingface.co/zai-org/GLM-4.5](https://huggingface.co/zai-org/GLM-4.5) | retained/added | 200 | model, repo |
| [huggingface.co/zai-org/GLM-4.5-Air](https://huggingface.co/zai-org/GLM-4.5-Air) | retained/added | 200 | model, repo |
| [huggingface.co/zai-org/GLM-4.6](https://huggingface.co/zai-org/GLM-4.6) | retained/added | 200 | model, repo, submission |
| [huggingface.co/zai-org/GLM-4.6/tree/main](https://huggingface.co/zai-org/GLM-4.6/tree/main) | retained/added | 200 | model |
| [huggingface.co/zai-org/GLM-4.7](https://huggingface.co/zai-org/GLM-4.7) | retained/added | 200 | model, repo, submission |
| [huggingface.co/zai-org/GLM-4.7-Flash](https://huggingface.co/zai-org/GLM-4.7-Flash) | retained/added | 200 | model, repo |
| [huggingface.co/zai-org/GLM-4.7/tree/main](https://huggingface.co/zai-org/GLM-4.7/tree/main) | retained/added | 200 | model |
| [huggingface.co/zai-org/GLM-5](https://huggingface.co/zai-org/GLM-5) | retained/added | 200 | model, repo |
| [huggingface.co/zai-org/GLM-5.1](https://huggingface.co/zai-org/GLM-5.1) | retained/added | 200 | model, repo |
| [openai.com/index/browsecomp/](https://openai.com/index/browsecomp/) | retained/added | 200 | result, submission |
| [openai.com/index/gpt-5-6/](https://openai.com/index/gpt-5-6/) | retained/added | 200 | result, submission |
| [openai.com/index/gpt-5/](https://openai.com/index/gpt-5/) | replaced | 404 | result |
| [openai.com/index/gpt-6-astra/](https://openai.com/index/gpt-6-astra/) | retained/added | 200 | result, submission |
| [openai.com/index/introducing-gpt-5-2/](https://openai.com/index/introducing-gpt-5-2/) | retained/added | 200 | result, submission |
| [openai.com/index/introducing-gpt-5-4/](https://openai.com/index/introducing-gpt-5-4/) | retained/added | 200 | result, submission |
| [openai.com/index/introducing-gpt-5-5/](https://openai.com/index/introducing-gpt-5-5/) | retained/added | 200 | result, submission |
| [openai.com/index/introducing-gpt-5/](https://openai.com/index/introducing-gpt-5/) | retained/added | 403 direct; Steel proxy retrieved chart | result, submission |
| [openai.com/index/introducing-o3-and-o4-mini/](https://openai.com/index/introducing-o3-and-o4-mini/) | retained/added | 200 | result, submission |
| [openreview.net/pdf?id=gA8mn8eXjo](https://openreview.net/pdf?id=gA8mn8eXjo) | retained/added | 403/challenge; indexed excerpt only | model, result, submission |
| [parallel.ai/benchmarks](https://parallel.ai/benchmarks) | replaced | 200 | model, result, submission |
| [parallel.ai/blog/deep-research-benchmarks](https://parallel.ai/blog/deep-research-benchmarks) | retained/added | 200 | model, result, submission |
| [parallel.ai/blog/parallel-search-api](https://parallel.ai/blog/parallel-search-api) | retained/added | 200 | result, submission |
| [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) | retained/added | 200 | model, submission |
| [platform.kimi.ai/docs/pricing/chat](https://platform.kimi.ai/docs/pricing/chat) | retained/added | 200 | model |
| [platform.minimax.io/docs/guides/pricing-paygo](https://platform.minimax.io/docs/guides/pricing-paygo) | retained/added | 200 | model |
| [seed.bytedance.com/en/seed2](https://seed.bytedance.com/en/seed2) | retained/added | 200 | model, result, submission |
| [storage.googleapis.com/deepmind-media/gemini/gemini_3-1_pro_model_evaluation.pdf](https://storage.googleapis.com/deepmind-media/gemini/gemini_3-1_pro_model_evaluation.pdf) | retained/added | 200 | result, submission |
| [thinkingmachines.ai/news/introducing-inkling](https://thinkingmachines.ai/news/introducing-inkling) | retained/added | 200 | result, submission |
| [thinkingmachines.ai/news/introducing-inkling/](https://thinkingmachines.ai/news/introducing-inkling/) | retained/added | 200 | model |
| [tinker-docs.thinkingmachines.ai/tinker/models/models_and_pricing/](https://tinker-docs.thinkingmachines.ai/tinker/models/models_and_pricing/) | retained/added | 200 | model |
| [tongyi-agent.github.io/blog/introducing-tongyi-deep-research/](https://tongyi-agent.github.io/blog/introducing-tongyi-deep-research/) | retained/added | 200 | result, submission |
| [www-cdn.anthropic.com/9e6a1044980d8c4ed85669faf9c2a8342e2e9f1e/Claude%20Sonnet%205%20System%20Card.pdf](https://www-cdn.anthropic.com/9e6a1044980d8c4ed85669faf9c2a8342e2e9f1e/Claude%20Sonnet%205%20System%20Card.pdf) | retained/added | 200 | result, submission |
| [www-cdn.anthropic.com/ceaf5c7ff2783855203fde8208ec311252dced5b/Claude%20Opus%205%20System%20Card.pdf](https://www-cdn.anthropic.com/ceaf5c7ff2783855203fde8208ec311252dced5b/Claude%20Opus%205%20System%20Card.pdf) | retained/added | 200 | result, submission |
| [www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf](https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf) | retained/added | 200 | result, submission |
| [www.anthropic.com/glasswing](https://www.anthropic.com/glasswing) | retained/added | 200 | model, result, submission |
| [www.anthropic.com/news/claude-opus-4-7](https://www.anthropic.com/news/claude-opus-4-7) | retained/added | 200 | result, submission |
| [www.anthropic.com/news/claude-opus-4-8](https://www.anthropic.com/news/claude-opus-4-8) | retained/added | 200 | result, submission |
| [www.kimi.com/blog/kimi-k2-6](https://www.kimi.com/blog/kimi-k2-6) | retained/added | 200 | result, submission |
| [www.kimi.com/blog/kimi-k3](https://www.kimi.com/blog/kimi-k3) | retained/added | 200 | model, result, submission |
| [www.minimax.io/news/minimax-m2-1](https://www.minimax.io/news/minimax-m2-1) | replaced | 404 | result |
| [www.minimax.io/news/minimax-m25](https://www.minimax.io/news/minimax-m25) | retained/added | 200 | result, submission |
| [www.prnewswire.com/news-releases/miromind-team-unveils-mirothinker-1-7--mirothinker-h1-a-new-era-of-verification-centric-heavy-duty-research-agents-302714500.html](https://www.prnewswire.com/news-releases/miromind-team-unveils-mirothinker-1-7--mirothinker-h1-a-new-era-of-verification-centric-heavy-duty-research-agents-302714500.html) | retained/added | 200 | result, submission |
| [www.sarvam.ai/blogs/sarvam-30b-105b](https://www.sarvam.ai/blogs/sarvam-30b-105b) | retained/added | 200 | result, submission |
| [x.ai/news/grok-4-fast](https://x.ai/news/grok-4-fast) | retained/added | 200 | model, result, submission |
| [z.ai/blog/glm-4.6](https://z.ai/blog/glm-4.6) | retained/added | 200 | result |
