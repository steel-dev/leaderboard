# BrowseComp model research: submissions 35–67

Checked on **2026-10-10**. Covers exactly the 33 existing rows from LongCat-Flash-Thinking-2601 through Parallel Ultra. Scores, names, and benchmark data were not edited. Structured output: `src/data/model-research/browsecomp-2.json`.

## Evidence and classification

- Checked official model cards and Hugging Face API file inventories. Open weights require actual downloadable checkpoint shards; an open base or promised release is insufficient. The 16 open records in this batch have safetensors files listed in the publisher repository.
- Size uses total parameters: Tiny ≤4B, Small >4–40B, Medium >40–150B, Large >150B. Active parameters are separate context. Where a publisher gives a nominal architecture count, it is retained. GLM-4.6/4.7, MiniMax M2.1, DeepSeek-V3.2, SMTL, and OpenSeeker use exact publisher-repository tensor counts rounded in billions because their checked cards omit precise totals. These may include auxiliary tensors and are labeled accordingly.
- For undisclosed parameters, standard uncached USD text rates per 1M tokens give a 3:1 input/output blend: Small <$0.15; Medium $0.15–$1 inclusive; Large >$1. This is a price proxy, not inferred physical parameters. No query fees are converted to token prices.
- When exact-version rates or backbones are unavailable, the required provisional category is explicitly an estimate with Low confidence. No parameter count is invented. Current token prices describe inference, not the cost of reproducing the benchmark.

## Records

| Model / underlying checkpoint                   | Weights   | Size / basis        | Total / active (B)       | USD input / output per 1M      | Confidence |
| ----------------------------------------------- | --------- | ------------------- | ------------------------ | ------------------------------ | ---------- |
| LongCat-Flash-Thinking-2601                     | open      | large / parameters  | 560 / 27                 | Not verified for exact version | high       |
| Step-3.5-Flash                                  | open      | large / parameters  | 196.81 / 11              | Not verified for exact version | high       |
| GLM-4.7                                         | open      | large / parameters  | 358.3378 / Unverified    | 0.6 / 2.2                      | high       |
| GPT-5.2                                         | closed    | large / price       | Undisclosed / Unverified | 1.75 / 14                      | high       |
| GPT-5                                           | closed    | large / price       | Undisclosed / Unverified | 1.25 / 10                      | high       |
| GPT-5.4                                         | closed    | large / price       | Undisclosed / Unverified | 2.5 / 15                       | high       |
| o4-mini                                         | closed    | large / price       | Undisclosed / Unverified | 1.1 / 4.4                      | high       |
| o3                                              | closed    | large / price       | Undisclosed / Unverified | 2 / 8                          | high       |
| Qwen3.5-122B-A10B                               | open      | medium / parameters | 122 / 10                 | Not verified for exact version | high       |
| MiniMax M2.1                                    | open      | large / parameters  | 228.6898 / Unverified    | 0.3 / 1.2                      | high       |
| LongSeeker-30B-SFT                              | open      | small / parameters  | 30.5 / 3.3               | Not verified for exact version | high       |
| Qwen3.5-27B                                     | open      | small / parameters  | 27 / 27                  | Not verified for exact version | high       |
| Qwen3.5-35B-A3B                                 | open      | small / parameters  | 35 / 3                   | Not verified for exact version | high       |
| Kimi K2 Thinking                                | open      | large / parameters  | 1000 / 32                | Not verified for exact version | high       |
| Gemini 3 Pro                                    | closed    | large / estimate    | Undisclosed / Unverified | Not verified for exact version | low        |
| MiMo-V2-Flash                                   | open      | large / parameters  | 309 / 15                 | Not verified for exact version | high       |
| Parallel Task Ultra model stack                 | uncertain | large / estimate    | Undisclosed / Unverified | Not verified for exact version | low        |
| Exa Agent Medium model stack                    | uncertain | large / estimate    | Undisclosed / Unverified | Not verified for exact version | low        |
| OpenAI original Deep Research model             | closed    | large / estimate    | Undisclosed / Unverified | Not verified for exact version | low        |
| DeepSeek-V3.2                                   | open      | large / parameters  | 685.3553 / Unverified    | Not verified for exact version | high       |
| Sarvam-105B                                     | open      | medium / parameters | 105 / 10.3               | Not verified for exact version | high       |
| Perplexity Agent Advanced historical stack      | uncertain | large / estimate    | Undisclosed / Unverified | Not verified for exact version | low        |
| SMTL-30B                                        | open      | small / parameters  | 30.5321 / Unverified     | Not verified for exact version | high       |
| MiroThinker v1.0-72B                            | open      | medium / parameters | 72 / 72                  | Not verified for exact version | high       |
| Perplexity Agent Deep historical stack          | uncertain | large / estimate    | Undisclosed / Unverified | Not verified for exact version | low        |
| OpenSeeker-v2-30B-SFT                           | open      | small / parameters  | 30.5321 / Unverified     | Not verified for exact version | high       |
| WebAnchor-30B                                   | uncertain | small / parameters  | 30 / 3                   | Not verified for exact version | medium     |
| GLM-4.6                                         | open      | large / parameters  | 356.7859 / Unverified    | 0.6 / 2.2                      | high       |
| LongSeeker undisclosed Visit summarizer         | uncertain | medium / estimate   | Undisclosed / Unverified | Not verified                   | low        |
| OpenSeeker undisclosed Visit summarizer         | uncertain | medium / estimate   | Undisclosed / Unverified | Not verified                   | low        |
| MiroThinker v1.0 undisclosed webpage summarizer | uncertain | small / estimate    | Undisclosed / Unverified | Not verified                   | low        |

## Material caveats

- **Historical source drift:** [Parallel’s live benchmark page](https://parallel.ai/benchmarks) now reports newer August/September 2026 experiments with GPT-5.6 Sol/Luna. It does not independently verify the stored GPT-5.4 harness rows or original Task Ultra scores. Keep the old score records untouched, preserve the explicitly named GPT-5.4 identity, and expose the caveat. Task Ultra backbones are unresolved.
- **Kimi alias:** The [K2 Thinking card](https://huggingface.co/moonshotai/Kimi-K2-Thinking) assigns 60.2 to K2 Thinking, with K2 0905 separately at 7.4. The existing `Kimi K2-Thinking-0905` name is retained, but mapped to K2 Thinking and marked ambiguous.
- **Sample scope:** [LongSeeker](https://arxiv.org/html/2605.05191) reports a 200-question BrowseComp sample, with up to five discard-all rounds. The hosted Parallel Task rows also represent a sample. Comparisons retain these methodological differences.
- **Hosted systems:** [Exa](https://exa.ai/blog/exa-agent) describes a fusion of frontier and economical models without exposing an exact Medium-tier stack. [Perplexity](https://docs.perplexity.ai/docs/agent-api/presets) says presets change their underlying model and renames the legacy Advanced/Deep presets. Current backbones cannot be backdated to the June comparison. Weight status is Uncertain for these exact stacks; hosted harness code is Closed.
- **Research releases:** LongSeeker, OpenSeeker-v2, and MiroThinker have published evaluation code and weight shards. [SMTL](https://arxiv.org/html/2602.22675) links released 30B weights, but the linked repository tree primarily exposes older AFM code, so SMTL-specific harness availability is Uncertain. Its 48.6 result is the SMTL-300 configuration.
- **Runtime helpers:** [LongSeeker's summary client](https://github.com/PolarSeeker/LongSeeker/blob/main/tools/utils.py) and [OpenSeeker's Visit tool](https://github.com/PolarSeeker/OpenSeeker/blob/main/src/tools/visit.py) require a separately configured `SUMMARY_MODEL_NAME`. The public defaults do not identify the evaluated helper. Each has an explicit Uncertain helper record with a provisional Medium category, using the related [WebSailor pipeline's 72B summarizer](https://github.com/Alibaba-NLP/DeepResearch/tree/main/WebAgent/WebSailor) only as a weak category comparison, not proof of identity or parameter count. Thus the full LongSeeker/OpenSeeker-v2 systems are provisionally Medium/Uncertain. LongSeeker's DeepSeek-V3.2 training teacher is not assigned as its runtime helper.
- **SMTL runtime model:** The [paper's Visit tool description](https://arxiv.org/html/2602.22675) explicitly names DeepSeek-V3.2 for goal-conditioned webpage summaries. This is a runtime dependency, so SMTL maps to its own 30B checkpoint plus DeepSeek-V3.2 and is Large/Open weights. Public main weights alone would incorrectly place the full system in Small.
- **MiroThinker runtime model:** The [v1.0 paper](https://arxiv.org/html/2511.11793) describes a lightweight extraction LLM, with Qwen3-14B as an example; the [v1.0 configuration](https://github.com/MiroMindAI/MiroThinker/blob/main/apps/miroflow-agent/conf/agent/mirothinker_v1.0.yaml) enables this summary tool, but no exact evaluated identity is pinned. The current README allows either open or closed helpers. An explicit Small/Uncertain provisional helper keeps the full system Medium by its main 72B model, with Uncertain weight status. Post-run grading models are excluded.
- **WebAnchor:** The [paper](https://arxiv.org/html/2601.03164) specifies training from Tongyi DeepResearch-30B-A3B. No WebAnchor checkpoint was found in the paper links, primary-source search, or Hugging Face model search; its own weights/harness remain Uncertain despite its open base.
- **OpenAI original Deep Research:** The [BrowseComp paper](https://arxiv.org/html/2504.12516) identifies a specialized browsing system. It is not automatically the [June 26 o3-deep-research API snapshot](https://developers.openai.com/api/docs/models/o3-deep-research), so the later $10/$40 token price is not assigned to the original result.
- **Pricing retrieval:** OpenAI per-model documentation establishes rates for GPT-5, GPT-5.2, GPT-5.4, o3, and o4-mini. [Z.AI](https://docs.z.ai/guides/overview/pricing) and [MiniMax](https://platform.minimax.io/docs/guides/pricing-paygo) retain exact-version rates. Current Google and DeepSeek pricing pages list successor models; a guessed Gemini 3 Pro launch-document URL and web retrieval of DeepSeek pricing failed, although a direct static DeepSeek request succeeded and confirmed successor-only coverage. Kimi redirected to a new pricing domain without readable historical-model rates, and direct retrieval returned HTTP 403. Unverified price fields remain absent.

## Validation

The JSON was parsed successfully; 33 exact submission names match array indices 34–66 in `src/data/browsecomp.json`, in order. All model IDs resolve locally; all 31 model IDs are unique. Parameter and price classifications were recalculated from their numeric fields, every estimate has Low confidence, and each record has at least one source. Runtime helper records were cross-checked against batch 3; the shared OpenSeeker helper is identical. The root task runs repository-wide lint/build and chart QA.
