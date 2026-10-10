# BrowseComp model research: submissions 1–34

Checked October 10, 2026. Machine-readable results are in
`src/data/model-research/browsecomp-1.json`: 34 model records and 34 exact-name
submission mappings. Scores and original benchmark entries were not changed.

## Classification

Total parameters set the size category where disclosed: tiny ≤4B, small >4–40B,
medium >40–150B, large >150B. Active MoE parameters are recorded separately.
For undisclosed models, the fallback is `(3 × input + output) / 4`, using USD per
million uncached tokens: small <0.15, medium 0.15–1, large >1. These labels are
comparison categories, not claims about the parameter counts of closed models.
The three remaining system/model estimates are explicitly provisional.

## Evidence reviewed

- OpenAI: fetched the exact [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol),
  [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra),
  [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro),
  [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro),
  [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5),
  [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4),
  [GPT-5.2 Pro](https://developers.openai.com/api/docs/models/gpt-5.2-pro), and
  [GPT-5.3-Codex](https://developers.openai.com/api/docs/models/gpt-5.3-codex)
  documentation under the OpenAI Docs skill. They disclose API prices but not
  parameter counts. GPT-5.6 Sol Ultra shares the Sol model record; four agents
  are an orchestration choice. Sol's current published pricing is promotional.
- Anthropic: [first-party standard pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  establishes the eight Claude price-based records. [Project Glasswing](https://www.anthropic.com/glasswing)
  gives Mythos Preview's restricted participant price separately. No parameter
  counts are inferred from the product tier names.
- Google: [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) gives
  Gemini 3.1 Pro Preview's standard ≤200K-token text prices. Larger-context and
  grounding charges are outside this category calculation.
- Moonshot: the [K3 model card](https://huggingface.co/moonshotai/Kimi-K3)
  states 2.8T total / 104B active and now has downloadable weight shards. The
  original leaderboard note about a future release is stale. The [K2.6](https://huggingface.co/moonshotai/Kimi-K2.6)
  and [K2.5](https://huggingface.co/moonshotai/Kimi-K2.5) cards give 1T / 32B.
  Their hosted swarm results are system-level records with open underlying weights.
- DeepSeek: the [V4 Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) and
  [V4 Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash) model cards
  disclose 1.6T / 49B and 284B / 13B respectively. Max is a reasoning mode.
- Z.ai: the official [GLM model table](https://github.com/zai-org/GLM-5) explicitly
  labels both GLM-5.1 and GLM-5 744B-A40B; [pricing](https://docs.z.ai/guides/overview/pricing)
  supplies their standard token rates. This avoids relying on raw tensor totals,
  which can include extra prediction heads and differ from published model sizes.
- Qwen: the [397B-A17B card](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)
  and its raw README confirm 397B total / 17B active and Apache-2.0 weights.
- Thinking Machines: [Inkling's announcement](https://thinkingmachines.ai/news/introducing-inkling/)
  and [model repository](https://huggingface.co/thinkingmachines/Inkling) give
  975B / 41B and released Apache-2.0 weights. [Tinker serverless beta pricing](https://tinker-docs.thinkingmachines.ai/tinker/models/models_and_pricing/)
  is recorded with its product qualification.
- MiniMax: the [M2-series technical report](https://arxiv.org/html/2605.26494v1)
  gives the shared 229.9B / 9.8B backbone. [Current API documentation](https://platform.minimax.io/docs/guides/pricing-paygo)
  was used for M2.5 pricing because the [released model card](https://huggingface.co/MiniMaxAI/MiniMax-M2.5)
  has older launch pricing.
- InternScience: the [paper](https://arxiv.org/html/2606.30616v1) distinguishes
  Agents-A1 from its SFT-stage checkpoint, each 35B / 3B based on Qwen3.5-35B-A3B.
  The [final model weights](https://huggingface.co/InternScience/Agents-A1) and
  [evaluation code](https://github.com/InternScience/Agents-A1/tree/main/evaluation)
  are released separately. Its [Visit tool](https://github.com/InternScience/Agents-A1/blob/main/evaluation/Search/inference/tool_visit.py)
  calls a separate summary LLM. The [released environment](https://github.com/InternScience/Agents-A1/blob/main/evaluation/Search/.env.example)
  defaults it to GPT-4o-mini, whose [official prices](https://developers.openai.com/api/docs/models/gpt-4o-mini)
  are $0.15/$0.60 per million uncached input/output tokens (Medium price proxy).
  Both A1 submissions include this helper: A1 is Medium/Mixed weights and A1-SFT
  is Medium/Uncertain weights. This is a public reproduction configuration, not
  a pinned manifest of the original benchmark run; changing the helper may change
  the classification. Training teachers and evaluation-only judges are excluded.

## Uncertainty and retrieval limits

- **MiroThinker-H1:** the [official repository](https://github.com/MiroMindAI/MiroThinker)
  calls H1 proprietary and distinguishes it from the released 235B MiroThinker-1.7.
  The [paper](https://arxiv.org/html/2603.15726v1) describes local/global verification
  on that foundation. The full H1 model stack is undisclosed, so its weight status
  is uncertain and its large category is a low-confidence estimate. No H1 parameter
  count or price is fabricated.
- **Exa Agent High:** [Exa](https://exa.ai/blog/exa-agent) says it combines frontier
  and cost-effective models, but does not disclose the exact mixture. Large is a
  low-confidence provisional category; weight status is uncertain. Per-query
  service prices are deliberately not converted into token prices.
- **Seed 2.0 Pro:** [ByteDance](https://seed.bytedance.com/en/seed2) establishes
  the proprietary flagship identity. The [BytePlus pricing page](https://docs.byteplus.com/en/docs/modelark/model-pricing)
  yielded an empty rendered price table through web retrieval. Its embedded
  document JSON was readable by static request, but names the later 260328
  snapshot, not the evaluated 0215 model. Exact-version parameter count and
  token rates remain unverified; large is a low-confidence estimate.
- **Agents-A1-SFT:** the publisher's model listing has final and quantized A1
  weights but no SFT checkpoint. A direct request to the likely SFT repository
  returned HTTP 401. Weight status stays uncertain; the public code and final
  weights do not establish release of the intermediate checkpoint.
- **Kimi K2.5/K2.6 pricing:** the fetched pricing page omitted its model-price
  tables; direct requests were blocked with HTTP 403. No numeric token rates
  are asserted for those versions. Their parameter-based category is verified.
- **DeepSeek pricing:** normal web retrieval timed out; static retrieval succeeded.
  The current table names V4-Pro-0813 and V4.1-Flash, with the old Flash alias
  redirected to V4.1. Those rates were not assigned to the April checkpoints.
- **Qwen and Agents-A1:** no exact-version first-party standard API token prices
  were verified. Their released weights and parameter counts suffice for size.

## Validation

The Hugging Face public model API was queried for all 11 entries marked open in
this batch. Each returned `private: false`, `gated: false`, license metadata, and
actual `.safetensors` files (14–282 shards depending on the model). Full weights
were not downloaded. Public availability means downloadable weights, not that
every license is OSI-approved or every evaluated harness is released.

JSON validation checks exact coverage of the first 34 BrowseComp names, unique
model IDs, and resolvable submission-to-model references. All disclosed parameter
records use total parameters for classification. All price-based records use
the specified 3:1 formula. Benchmark scores remain unchanged.
