# Leaderboard review and benchmark-lifecycle proposal - 2026-09-22

Status: draft for maintainer discussion. Not a decision record.
Data: computed from `src/data/*.json` on 2026-09-22, plus the GPT-6 Astra
release review archived at `.discovery/astra-release-review-2026-09-21.json`.

## Summary

The mission — help developers pick a model for browser and web-browsing
agents — still makes sense. The execution is sound. But the fixed set of 14
boards now answers yesterday's question for 10 of them:

- Four boards carry the site as a decision tool: `osworld2`, `browsecomp`,
  `tauBench`, `draco`.
- Five boards are saturated: tops at 92–99 with a top-10 spread of 3–4
  points. The ranking no longer separates models.
- Five boards have not seen a frontier row in over a quarter. Two are dead
  for 11 months (`agentBench`, `aiderPolyglot`).
- GPT-6 Astra, the biggest launch of the quarter and explicitly a
  computer-and-browser-use model, appears on 2 of 14 boards. It reported
  roughly 15 external benchmarks. Our overlap is 13 percent.

The durable product is not more self-reported rows. It is independent runs
on a fixed harness, plus the benchmark-lifecycle research proposed below.

## Data snapshot

Method: `top` = max `scoreValue`; `sprd` = range of the top 10 by
`scoreValue`; `latest` = most recent `reportedAt` on the board. Frontier
check: GPT-6 Astra, GPT-5.6, Opus 5, Fable 5/5.1, Gemini 3, Muse, Kimi K3,
Step-3.5, Qwen3.8, Mythos, Sai matched against top-10 `systemName`.

| Board | Top | Top-10 spread | Last new row | Frontier models in top 10 | Reading |
|---|---:|---:|---|---|---|
| osworld2 | 77.9 | 15.3 | 2026-09 | 7 | Healthy: unsaturated, dense field |
| browsecomp | 92.2 | 4.2 | 2026-09 | 6 | Active but tight at the top |
| tauBench | 88.2 | 19.8 | 2026-09 | 4 | Healthy |
| draco | 88.6 | 28.8 | 2026-07 | 3 | Healthy, low volume |
| sweBenchVerified | 97.0 | 16.2 | 2026-09 | 4 | Saturated at the ceiling |
| gaia | 92.4 | 3.0 | 2026-03 | 0 | Saturated and deserted |
| mind2web | 97.0 | 32.0 | 2026-06 | 0 | Saturated ceiling, stale field |
| webvoyager | 99.2 | 12.2 | 2026-06 | 1 | Effectively saturated |
| webarena | 74.3 | 17.2 | 2026-06 | 0 | Unsaturated but abandoned |
| osworld (v1) | 86.1 | 13.4 | 2026-08 | few | Superseded by 2.0 |
| agentBench | 70.4 | 17.2 | 2025-10 | 0 | Dead 11 months |
| aiderPolyglot | 88 | 11.1 | 2025-10 | 0 | Dead 11 months |
| clawbench | 33.3 | 32.6 | one day | 1 | Known metric divergence vs official board |
| healthAdminBench | 51.9 | 40.0 | 2026-06 | 2 | Niche |

Known caveat: the clawbench board metric differs from the official
leaderboard scale (33.3 vs 61.4 for the same family). Fix separately.

## Structural findings

1. The frontier barely reports on us. Labs rotate the benchmark stack every
   release cycle. A fixed board set ages by construction.
2. Saturation kills the decision value, not the leaderboard. When the top 10
   sit within 4 points and settings differ (single agent vs 64 searchers,
   offline subsets, latency simulation, effort levels), the single-number
   ranking is partly artifact. `notesShort` records this, but visitors see
   one number.
3. "Dead" has two causes. GAIA and Mind2Web died of saturation — the work
   is done. WebArena died while unsaturated — labs simply left. Different
   stories; the research below separates them.

## Recommendations

1. Mark lifecycle state per board. Split "active" (frontier reporting
   within two quarters) from "archived" with a visible badge. Cost: about a
   day. Buys honesty and sets up the lifecycle page.
2. Run models ourselves on a fixed browser harness. This is the one thing
   system cards cannot rotate away. The top SWE-bench row is a Vals.ai
   independent run; ARC Prize and Artificial Analysis earn trust the same
   way. Steel ships browser infrastructure. A small fixed Steel-run suite
   (3 tasksuites x 10 models) with run provenance beats a hundred
   self-reported rows.
3. Do the lifecycle research. It turns the churn problem into the product.
   Design below.

## Proposal: benchmark lifecycle atlas

### Question

Which benchmarks appear in release materials, which saturate, and which
disappear — measured against a fixed cohort of model releases over time.

### Data design

- Fix the cohort, not the benchmark list. Sample every frontier release
  from the major labs since 2024 (roughly 40 to 60 system cards, model
  cards, and launch posts). Measure each benchmark against that cohort.
- Do not sample benchmarks from our own boards or from current cards. Dead
  benchmarks are then invisible by construction (survivorship bias).
- Reporting rate for benchmark B in window W = share of cohort releases in
  W that report B.

### Metrics

- Adoption: reporting rate over a rolling window (rising, flat, falling).
- Saturation: composite of headroom (ceiling minus frontier score) and
  spread (range or sigma of top-k scores). High score plus low spread means
  saturated; spread alone catches the "ranking is artifact" failure.
- Fragmentation: count of distinct variants and versions per benchmark
  family per quarter (OSWorld v1/Verified/2.0/offline-subset; tau-bench /
  tau2 / tau3-banking; BrowseComp Plus/ZH/V3; SWE-bench
  Verified/Pro/Multilingual/FrontierSWE). A family can be alive while its
  canonical member stalls — that is the osworld story on this site.
- Cause of death (manual field): saturation, contamination distrust,
  supersession by a harder sibling, vendor-owned replacement, exclusivity.
  The timeline shows when; this field explains why.

### Figures

- Figure A, lanes: one lane per benchmark, calendar time on x, lane from
  first to last report, opacity as reporting rate, end marker as alive,
  saturated, or abandoned. Readable in seconds.
- Figure B, scatter: x = reporting consistency (share of trailing cohort
  reporting it), y = saturation. Quadrants name themselves:
  - high consistency, low saturation: healthy standard (osworld2 today)
  - high, high: exhausted standard (sweBenchVerified, browsecomp)
  - low consistency, any saturation: abandoned (gaia, webarena, agentbench)
  - low consistency, low saturation: emerging chaos (Agents' Last Exam,
    BenchCAD, ScreenSpot-Pro)

### Pitfalls

- Aliases and variants are the main cost. One release (GPT-6 Astra)
  produced: OSWorld v1/Verified/2.0/offline-subset, tau-bench family
  splits, SWE-bench family splits, HealthBench not equal to
  HealthAdminBench, and GPQA Diamond mislabeled as SWE-bench Verified.
  Aggregators mislabel constantly. A canonical registry with alias and
  parent-child edges is prerequisite work.
- Self-reported scores are not comparable across labs. Tag provenance;
  separate self-reported from independently run.
- Version skew hides inside names (WebArena fixed set, OSWorld 2.0 offline
  subset under latency simulation). Record dataset version per row.

### Existing assets

- `.discovery/` pipeline: research, judge, and apply stages already fetch
  and archive release materials.
- `docs/research/`: 54 benchmark directories with fetched READMEs, papers,
  and summaries (March pass). Seeds the canonical registry.
- `.discovery/astra-release-review-2026-09-21.json`: 77 untracked benchmark
  signals and 10 open questions from one release, fully sourced.
- Rolling discovery issue #53: the September digest includes six refuted
  mislabels. Direct evidence of the alias problem.

### MVP

A same-day prototype from repo data alone: 14 boards times roughly 350
rows with `reportedAt` yield reporting timelines, top-score trajectories,
and spread over time. This validates the figure shapes before committing
to the 50-card scrape.

### Prior art

Check before claiming novelty: Epoch AI benchmark analyses, HELM, the
benchmark-contamination literature, the retired Open LLM Leaderboard
post-mortem, and "The Leaderboard Illusion" (arena dynamics). The specific
angle — lifecycle of agentic and browser benchmarks against a fixed
release cohort — appears open.

## Open decisions

1. Adopt the active/archived badge split? Which threshold (quarters without
   a frontier row)?
2. Fund a Steel-run evaluation lane? Which tasksuites?
3. Greenlight the lifecycle MVP from repo data?
4. Reconcile the clawbench metric divergence with the official board?
5. Decide the OSWorld 2.0 Opus 5 conflict (70.2 in the Astra table vs 70.6
   in our row from the Anthropic card).
