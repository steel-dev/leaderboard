# Hybrid Benchmark Leaderboard Content Plan

## What We Are Actually Building

Keep `/` as the strongest SEO entry point, but evolve it into a benchmark hub. WebVoyager remains the flagship
section on home. Benchmark-specific ranking depth moves to `/leaderboards/<slug>/` using one shared template
and one shared schema.

The site should not read as "just agent benchmarks" or "just model benchmarks." It should read as:

- a benchmark decision hub for builders
- with clear score ownership (model vs system)
- and benchmark-specific pages that are indexable, comparable, and useful

Wave 1 targets: `webvoyager`, `osworld`, `browsecomp`, `webarena`, `swe-bench-verified`.
Future-ready targets include MMMU-Pro and Screenshot-Pro-style eval pages without template changes.

---

## Core Product Decisions (So We Stop Waffling)

1. **One canonical subpage template** for all benchmarks.
2. **One canonical row schema** for all results.
3. **No global "best model overall" claim** unless scores are explicitly comparable.
4. **FAQ answers are generated from current leaderboard data**, but constrained by claim-safety rules.
5. **Agent vs model is explained once, then reinforced everywhere** with labels and notes.

---

## Information Architecture

### URL structure

- `/` -> hub + featured WebVoyager module
- `/leaderboards/<slug>/` -> canonical benchmark page

No extra category index pages in Wave 1. Category discovery happens on `/`.

### Homepage spec (hub-first, still WebVoyager-authentic)

- Keep top-of-page relevance to WebVoyager.
- Add "Featured WebVoyager" module with:
  - what it is
  - why it matters
  - current top system + score
  - link to full `/leaderboards/webvoyager/`
- Add "Explore benchmarks" grouped by:
  - Browser agents
  - Computer use
  - Research/search
  - Coding
  - Model evals / reasoning
- Each card includes:
  - benchmark name
  - one-line purpose
  - current top label (system/model) + score
  - one-line caveat (if needed)
  - crawlable `<a href>` link
- Add one global methodology explainer:
  - scores can represent full systems, not just base models
- Add one homepage FAQ:
  - benchmark-selection questions
  - interpretation questions
  - no benchmark-specific rabbit holes

---

## Benchmark Subpage Template (Simplified)

Every `/leaderboards/<slug>/` page should be simple and consistent:

1. About this benchmark
2. Leaderboard table
3. FAQ

### 1) About this benchmark

This section should be a few helpful paragraphs, not one sentence. It should include:

- what the benchmark is
- what it tests
- why people should care
- any important caveat up front (if needed)

Then include a **Methodology** subsection that can cover:

- evaluation setup
- cost calculation (if relevant)
- testing dates / run window
- sample size / subset used
- judge/evaluator details (if relevant)

Then include **Links** (paper, official site, repo, docs) and any optional notes that matter.

### 2) Leaderboard table

Keep it human-scannable with fixed columns:

- Rank
- System / Submission
- Score
- Organization
- Notes
- Source

`Notes` is the compact home for nuance (harness/framework, tools, evaluator, attempt policy, verification, etc.).
We intentionally keep these details in notes for now instead of making them all structured fields.

### 3) FAQ

FAQ should mix:

- current leaderboard state (who is leading, how to interpret)
- benchmark-specific context (what this score means, common confusion)
- caveats (model vs system ownership, verification questions, comparability questions)

---

## Canonical Data Schema (Simplified)

We should standardize around these shapes.

### `BenchmarkPageMeta`

- `slug: string`
- `name: string`
- `category: "browser_agents" | "computer_use" | "research_search" | "coding" | "model_eval"`
- `scope: "agent" | "model" | "mixed"`  
  (This is the simple model-vs-agent communication field.)
- `about: string[]` (2-5 short paragraphs)
- `methodology: string[]` (evaluation, cost, dates, sample notes)
- `importantNotes: string[]` (optional caveats)
- `links: { label: string; url: string }[]`
- `relatedBenchmarks: string[]` (slugs)
- `featuredOnHome: boolean`
- `lastUpdated: string` (ISO date for the whole page/leaderboard freshness)

### `BenchmarkResultRow`

- `rank: number`
- `systemName: string`
- `organization: string`
- `scoreDisplay: string`
- `scoreValue: number | null`
- `sourceUrl: string`
- `notesShort: string`
- `isNew?: boolean`

Notes for implementers:

- `notesShort` should include the key context when relevant: harness/framework, tools, evaluator/judge,
  attempt policy, subset/sample details, and verification context.
- We are deliberately not structuring those fields yet to keep v1 fast and close to current WebVoyager data.

### `BenchmarkFaqFacts` (generated input, minimal)

- `bestCurrentLabel: string`
- `bestCurrentScore: string`
- `scope: BenchmarkPageMeta.scope`
- `lastUpdated: string`
- `hasVerificationCaveat: boolean`
- `hasComparabilityCaveat: boolean`

---

## FAQ Generation Rules (SEO-Safe + Honest)

These rules should be deterministic and template-wide.

1. Always generate:
   - "Which system is currently best on <benchmark>?"
2. Wording should match page `scope`:
   - `model` -> "model currently leading"
   - `agent` or `mixed` -> "system/agent setup currently leading"
3. Always append freshness:
   - "Based on our latest tracked results, last updated <date>."
4. If `hasVerificationCaveat === true`, include FAQ:
   - "Are these independently verified?"
5. If `scope === "mixed"` or `hasComparabilityCaveat === true`, include FAQ:
   - "Can I compare model-only and agent-with-tools rows directly?"
6. Never generate:
   - "Best model overall across all benchmarks"
   unless we explicitly add comparability logic later.

### Canonical answer style for "best" question

- Short answer first (entity + score)
- One-line ownership disclaimer (model-only vs system-level)
- One-line freshness / source framing

---

## How To Explain Agent vs Model Benchmark Simply

Use this exact framing pattern across homepage and subpages:

- **Model benchmark:** isolates base model capability as much as the benchmark allows.
- **Agent/system benchmark:** measures end-to-end performance of a configured system (model + stack + policy).
- **Mixed benchmark:** includes both; rows are not inherently apples-to-apples.

### UI reinforcement rules

- Add a `Scope` badge near table title:
  - `Model`
  - `Agent`
  - `Mixed`
- Keep row-level hints in `Notes`.
- Repeat one plain-language caveat inside Methodology.

---

## Attribution and Methodology Rules (Non-Negotiable)

- Rankings belong to the **submitted system configuration**, unless the page scope is clearly model-only.
- Never imply score ownership by a base model alone when setup materially contributes.
- Put setup detail in two places:
  - concise `Notes` in the table row
  - fuller explanation in the Methodology subsection
- If setup dependence is high, push detail to Methodology and keep table readable.

---

## SEO Contract Per Subpage

Each `/leaderboards/<slug>/` page should have:

- unique `title`
- unique meta `description`
- unique `h1`
- benchmark-specific About copy (not a near-duplicate template paragraph)
- FAQPage structured data sourced from generated FAQ content
- ItemList structured data for leaderboard rows
- BreadcrumbList structured data for hierarchy

---

## Internal Linking Strategy

- Home benchmark cards link to canonical `/leaderboards/<slug>/`.
- Each subpage links to related benchmarks in section 8.
- Methodology/FAQ should occasionally link back to home hub where context is broader.
- Keep links plain crawlable anchors (`<a href>`), no JS-only navigation.

---

## Rollout Sequence

1. Build schema and content for `webvoyager` first (reference implementation).
2. Apply to `osworld`, `browsecomp`, `webarena`, `swe-bench-verified`.
3. Populate homepage hub cards from same schema source.
4. Remove/de-emphasize registry/results once parity is verified.

---

## Acceptance Criteria

- Homepage remains genuinely useful for WebVoyager while functioning as a benchmark hub.
- Every launched benchmark page uses the 3-block structure:
  - About (with Methodology + Links)
  - Leaderboard
  - FAQ
- Every table includes `Notes` with real setup nuance.
- FAQ has generated "best current" answer with proper scope language and freshness.
- Pages never make unsafe cross-benchmark "best overall" claims.
- Agent-vs-model distinction is understandable in <10 seconds from page scanning.

---

## Assumptions and Defaults

- Homepage is "hub-heavy," not longform essays.
- `/leaderboards/<slug>/` is canonical for benchmark depth pages.
- Category landing pages are out of scope for Wave 1.
- MMMU-Pro and Screenshot-Pro-like pages must fit this template with no structural rewrite.