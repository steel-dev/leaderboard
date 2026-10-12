# OSWorld model classification

Initially checked 2026-10-10; audited and corrected 2026-10-11 using the repository’s model-classification-research skill. All 23 existing
submissions have exact-name mappings. The audit corrected the Qwen3-VL score/variant and UiPath backbone, and repaired result links; see
[verification report](../chart-data-verification-2026-10-11.md). The batch defines 15 model records and
references ten shared BrowseComp records.

## Findings that affect filters

| Submission or group                   | Weights                        | Size basis                                   |
| ------------------------------------- | ------------------------------ | -------------------------------------------- |
| Qwen3.8-Max                           | Uncertain evaluated checkpoint | Large, 2.4T published total                  |
| MiMo-V2.6-Pro / Flash                 | Open                           | Large, 1.02T / 309B total; 42B / 15B active  |
| OSAgent                               | Uncertain backbone             | Large, provisional estimate, low confidence  |
| Qwen3-VL-235B-A22B-Instruct           | Open                           | Large, 235B total / 22B active               |
| Kimi K2.5                             | Open                           | Large, existing parameter record             |
| GLM-5V-Turbo                          | Uncertain evaluated weights    | Large, $1.90/M price blend                   |
| Agent S2 + Claude 3.7                 | Mixed                          | Large, largest component; open harness       |
| Qwen2.5 VL 72B / 32B Instruct         | Open                           | Medium / Small, full checkpoint inventories  |
| Other Claude and GPT-5.4 rows; UiPath | Closed                         | Large, standard token-price proxies          |
| Original OpenAI Operator CUA          | Closed                         | Large, provisional historical-model estimate |

The [Qwen3.8 release announcement](https://www.alibabacloud.com/en/press-room/alibaba-unveils-qwen3-8-max?_p_lc=1)
publishes 2.4T parameters. The related
[Qwen3.8-2.4T-A95B card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) explicitly describes the
released checkpoint as text-only, distinguishing the hosted Max version’s vision support. Its 213
weight shards therefore do not prove the evaluated GUI model is available. The August result is
also kept distinct from the September alias upgrade.

The [Agent S2 paper](https://arxiv.org/html/2504.00906v1) identifies Claude 3.7 Sonnet as
manager/worker and UI-TARS-72B-DPO for visual grounding. The
[v0.2.0 code](https://github.com/simular-ai/Agent-S/tree/v0.2.0) additionally uses
text-embedding-3-small for uncached narrative/episodic retrieval. Optional Perplexica is disabled in
the release CLI. OCR and UNO are conventional tools, not extra language models. Open harness code
does not make this runtime an open-weight submission.

The embedding helper has a published $0.02/M input rate, but no generation output rate. Its Small
category is explicitly an estimate; the text-generation price formula is not applied with an
invented zero output price. Claude 3.7 remains the largest component.

## Evidence and unresolved identity

- Public Hugging Face API inventories confirmed weight files for both MiMo RL checkpoints,
  UI-TARS-72B-DPO, and both Qwen2.5-VL checkpoints. Full stored Qwen2.5-VL totals are approximately
  73.4108B and 33.4527B including visual components, with 38 and 18 shards. Published MiMo
  architectural totals take precedence over larger stored inventories containing auxiliary tensors.
- The original Qwen3-VL 66.7 score was **OSWorldG grounding**, not OSWorld task success.
  [Table 2, page 15](https://arxiv.org/pdf/2511.21631v1#page=15) gives the exact Instruct model
  **31.6** on OSWorld. The score, name, rank, and mapping now reflect that result. Its exact
  [Instruct inventory](https://huggingface.co/api/models/Qwen/Qwen3-VL-235B-A22B-Instruct)
  has 96 public shards at revision `710c13861be6c466e66de3f484069440b8f31389`; published 235B
  total / 22B active remains the classification basis.
- The [official OSWorld workbook](https://osworld-v1.xlang.ai/static/data/osworld_verified_results.xlsx)
  assigns 53.63% to **UiPath Screen Agent w/ GPT-5**, 50 steps, September 14, 2025. The row retains
  its rounded 53.6%, with corrected name/backbone/date. January's Opus 4.5 results are different runs.
  Exact historical scaffold release is unverified; harness availability is now Uncertain.
- [OSAgent’s launch](https://www.theagi.company/blog/osworld) discloses an unnamed general-reasoning
  base and RL policy. A later `agi-inc` 32B repository was created in April 2026 and has no model
  card; it cannot establish the October 2025 evaluation identity. No parameter count is invented.
- [GLM-5V-Turbo’s model docs](https://docs.z.ai/guides/vlm/glm-5v-turbo) identify the endpoint but
  omit parameter count and released weights. Z.AI’s current pricing page omits the model; the
  serving [Vercel Z.AI route](https://vercel.com/ai-gateway/models/glm-5v-turbo) directly quotes
  standard $1.20 input/$4 output per million tokens. The record labels the provider and context
  tier, and does not present that rate as a historical launch receipt.
- The original [CUA announcement](https://openai.com/index/computer-using-agent/) describes
  GPT-4o-based vision and RL reasoning. It does not establish that the January model equals the
  later March `computer-use-preview` API checkpoint. Historical token prices are therefore omitted;
  later API pricing supports only the labeled Large estimate. The 50-step 32.6 baseline is
  corroborated by Agent S2’s table. Later o3-based Operator is excluded.

The two Anthropic PDF sources initially exceeded the web tool’s size limit. Static downloads
with a browser user agent and local `pdftotext` extraction succeeded. Claude 5 section 8.16.3 and
Sonnet 5 section 8.10.2 describe the revised zoom tool and token limits without a separate inference
model. Existing model identities are reused; changed evaluation settings remain submission context.

## Shared records and validation

Existing IDs reused: `claude-mythos-preview`, `claude-mythos-5`, `claude-fable-5`, `claude-opus-4-8`,
`claude-sonnet-5`, `claude-sonnet-4-6`, `claude-opus-4-6`, `gpt-5-4`, `gpt-5`, and `kimi-k2-5`.
New common records available to other batches include `openai-cua-original`, `claude-3-7-sonnet`,
`claude-opus-4-5`, `claude-sonnet-4-5`, `claude-haiku-4-5`, and both Qwen2.5-VL Instruct IDs.

Validation checks exact 23-name coverage, unique new IDs, references across the shared registry,
required fields, source URLs, check dates, finite nonnegative numbers, category boundaries, and
active-versus-total counts. The October 11 audit updated benchmark results as described above. No build was run in this
research subtask; integration checks belong to the parent task. Final counts are 21 Large, 1 Medium,
1 Small; 6 Open, 13 Closed, 1 Mixed, 3 Uncertain.
