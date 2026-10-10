---
name: model-classification-research
description: Research evaluated leaderboard model versions, released weights, parameters, token prices, and runtime stacks to maintain evidence-backed size and openness classifications. Use for model-registry research, not benchmark discovery or score updates.
---

# Model classification research

Maintain classification records separately from benchmark results. Read the selected entries in
`src/data/<benchmark>.json`, the existing registry in `src/data/model-research/`, and any requested
scope before editing. Preserve system names, scores, ranks, evaluation dates, and result-source links.

## Evidence and identity

- Research the exact evaluated model version. Distinguish a model checkpoint from its harness and
  from a hosted system. A similarly named later release does not establish an earlier result's
  parameters, price, or weights availability.
- Prefer provider model cards, papers, official checkpoint inventories, code/configurations, and
  official prices. Actually retrieve the source; a search snippet or inaccessible URL is not proof.
  Credible secondary research can support a labeled estimate when primary evidence is incomplete.
- For weights, inspect the actual repository/file inventory. A public GitHub harness, an empty
  Hugging Face repository, a promised release, or an open base model does not prove the evaluated
  fine-tune is available. Record a failed retrieval separately from evidence of non-release.
- Read runtime tool configuration as well as the main model description. Include required planner,
  executor, summarizer, embedding, and reranking models. Exclude training-only teachers and scoring
  judges from the evaluated runtime stack. Do not infer a provider from an OpenAI-compatible API.
- Preserve source URLs, a short explanation, confidence, and the actual check date. Explain conflicts
  such as a paper's architectural parameter count versus a checkpoint inventory including auxiliary
  tensors. Do not silently replace a historical evaluation with the latest contents of a mutable page.

## Classification rules

Use the first supported basis:

1. **Published total parameters**, in billions: Tiny ≤4; Small >4–40; Medium >40–150; Large >150.
   Record active MoE parameters separately. Active count, non-embedding count, quantized file size,
   and number of parallel agents do not replace total parameters.
2. **Published token-price proxy** if total parameters are unknown: blend =
   `(3 × inputUsdPerMillion + outputUsdPerMillion) / 4`. Small <0.15; Medium 0.15–1 inclusive;
   Large >1. Use standard uncached USD prices per million tokens for the evaluated version. Exclude
   batch discounts, cache discounts, promotions unless unavoidable and disclosed, per-query charges,
   tool fees, subscriptions, and total benchmark run cost. Record the relevant context tier.
3. **Best supported provisional estimate** when neither is known. Assign one size, label it Estimated,
   explain the inference and uncertainty, and use low confidence for unidentified hosted stacks.
   Store a parameter range only when evidence supports that range; do not invent a count to fit a
   category. If a range crosses a boundary, explicitly explain the chosen provisional category.

These categories are not compute measurements. Keep estimated and price-based models in their
assigned filters while exposing their basis. Missing optional numeric fields mean unknown, not zero.

For multiple required models, retain every component and use the **largest component category** as a
labeled approximation; do not sum parameter counts or prices. An open-weight submission requires
all required model checkpoints to be available. A closed component makes the stack non-open;
an unverified component prevents an all-open assertion. Show mixed or uncertain stacks explicitly.
Harness code availability remains a separate field.

## Registry output

Write the requested batch file under `src/data/model-research/` and a concise source/uncertainty note
under `docs/research/<benchmark>/`. Follow the existing registry's contract; the research batch shape is:

```typescript
type Source = { title: string; url: string };
type ModelRecord = {
  id: string; // stable kebab-case, one per distinct evaluated version
  name: string;
  weights: "open" | "closed" | "uncertain";
  totalParametersB?: number;
  activeParametersB?: number;
  parameterEstimateB?: [number, number];
  inputUsdPerMillion?: number;
  outputUsdPerMillion?: number;
  size: "tiny" | "small" | "medium" | "large";
  basis: "parameters" | "price" | "estimate";
  confidence: "high" | "medium" | "low";
  notes: string;
  sources: Source[];
  checkedAt: string; // YYYY-MM-DD
};
type SubmissionRecord = {
  systemName: string; // exact existing leaderboard name
  kind: "model" | "harness" | "system";
  modelIds: string[];
  harnessCode: "open" | "closed" | "uncertain" | "not-applicable";
  notes: string;
  sources: Source[];
};
type ResearchBatch = {
  models: ModelRecord[];
  submissions: SubmissionRecord[];
};
```

Use Model for a reported checkpoint evaluation, Harness for a named orchestration layer applied to
known models, and System for a managed product or composite runtime. An unknown runtime component
can have its own explicitly named provisional record; do not claim it is a particular model without
support. Submission notes must explain component roles and assumptions.

## Batching and validation

Agents can research disjoint batches in parallel, each owning separate JSON and note files. Agree on
IDs for shared backbones. The parent agent reconciles duplicate versions, conflicting evidence, and
coverage before using the combined registry.

Validate that every requested submission appears exactly once, every referenced model exists, model
IDs are unique after reconciliation, all records have usable source URLs/check dates, numeric values
are finite and nonnegative, and basis/category calculations obey the boundaries above. Check that
parameter-based records include total parameters, price-based records include both token prices,
and estimates disclose their rationale. Check ranges and active ≤ total where both are available.
Review all low-confidence and non-open records for accidental claims that uncertainty is certainty.

Re-read actual source evidence for any apparent boundary conflict, mutable historical source, or
mixed stack. Run repository-required lint/build checks when integrating the data, and regenerate the
README only if leaderboard result data changes. Report unresolved assumptions without changing
scores as a side effect of classification work.
