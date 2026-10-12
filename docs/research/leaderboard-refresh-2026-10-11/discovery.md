# Discovery sweep — 2026-10-11

_Source: arxiv API, 30-day lookback beginning 2026-09-11; queried 2026-10-11 at 18:12 UTC._

Abstract-level triage of 86 benchmark-paper matches / 81 unique papers. “Proposed” means a citable absolute result worth verification, not a publication-ready leaderboard row. Full-paper review corrected TeleTune and AutoGUIWorld to variants. [The research summary](./summary.md) supplies deeper verification, release-post backfill, and CUAWright scores recovered from full tables despite its delta-only abstract.

## WebVoyager

Current top: browser-control (Fable 5) (99.19%)

_No new candidates this run (reviewed 1, skipped 1)._

## BrowseComp

Current top: GPT-5.6 Sol Ultra (92.2%)

| ✓ | Kind | System / Finding | Source | Score / Claim |
| --- | --- | --- | --- | --- |
| [ ] | proposed | **AREX-2** | [arxiv:2609.38288](https://arxiv.org/abs/2609.38288) · 2026-09-29 | 84.0% on original BrowseComp; Qwen3.8-27B research agent. |
| [ ] | proposed | **Traverse-35B** | [arxiv:2609.37082](https://arxiv.org/abs/2609.37082) · 2026-09-29 | 72.83% on original BrowseComp with search and memory harness. |
| [ ] | variant | **IndexAct** | [arxiv:2610.07960](https://arxiv.org/abs/2610.07960) · 2026-10-06 | BrowseComp-Plus; no original BrowseComp score in abstract. |
| [ ] | variant | **Programmatic Search Agents** | [arxiv:2610.06689](https://arxiv.org/abs/2610.06689) · 2026-10-05 | BrowseComp-Plus. |
| [ ] | variant | **HEAR** | [arxiv:2610.06597](https://arxiv.org/abs/2610.06597) · 2026-10-05 | BrowseComp-Plus serving / harness protocol. |
| [ ] | variant | **LexiHorizon** | [arxiv:2610.05119](https://arxiv.org/abs/2610.05119) · 2026-10-04 | BrowseComp-ZH. |
| [ ] | variant | **SearchJev** | [arxiv:2610.05107](https://arxiv.org/abs/2610.05107) · 2026-10-04 | BrowseComp-Plus. |
| [ ] | variant | **VideoResearchAgent** | [arxiv:2610.04911](https://arxiv.org/abs/2610.04911) · 2026-10-04 | Video-BrowseComp. |
| [ ] | variant | **EviRover** | [arxiv:2609.40230](https://arxiv.org/abs/2609.40230) · 2026-09-30 | BrowseComp-VL; improvement delta only. |
| [ ] | variant | **DAGent** | [arxiv:2609.39154](https://arxiv.org/abs/2609.39154) · 2026-09-30 | BrowseComp-Plus. |
| [ ] | variant | **Context Language Models** | [arxiv:2609.37725](https://arxiv.org/abs/2609.37725) · 2026-09-29 | BrowseComp-Plus. |
| [ ] | variant | **Adaptive Consistency Graph** | [arxiv:2609.32754](https://arxiv.org/abs/2609.32754) · 2026-09-26 | 73.5% on BrowseComp-Plus. |
| [ ] | variant | **Growing the Harness** | [arxiv:2609.26760](https://arxiv.org/abs/2609.26760) · 2026-09-22 | BrowseComp-Plus. |
| [ ] | variant | **Question's Gambit** | [arxiv:2609.14412](https://arxiv.org/abs/2609.14412) · 2026-09-13 | 90.5% on BrowseComp-Plus. |

_reviewed: 17 · proposed: 2 · variants: 12 · methodology: 0 · skipped: 3_

## DRACO

Current top: Claude Opus 5 (88.6%)

_No new candidates this run (reviewed 3, skipped 3)._

## WebArena

Current top: WebTactix (DeepSeek v3.2) (74.3%)

| ✓ | Kind | System / Finding | Source | Score / Claim |
| --- | --- | --- | --- | --- |
| [ ] | variant | **Harness Evolution** | [arxiv:2610.11655](https://arxiv.org/abs/2610.11655) · 2026-10-08 | WebArena-Lite. |
| [ ] | variant | **Secure-CUA** | [arxiv:2610.09469](https://arxiv.org/abs/2610.09469) · 2026-10-07 | 53.55% averaged across three models on a 400-task WebArena subset. |
| [ ] | variant | **CLIFT** | [arxiv:2610.06829](https://arxiv.org/abs/2610.06829) · 2026-10-05 | WebArena Infinity and VisualWebArena; no absolute score in abstract. |
| [ ] | variant | **AMBER** | [arxiv:2610.07118](https://arxiv.org/abs/2610.07118) · 2026-10-05 | WebArena-Lite. |
| [ ] | variant | **DeskForge** | [arxiv:2610.02320](https://arxiv.org/abs/2610.02320) · 2026-10-01 | WebArena-Infinity. |
| [ ] | variant | **StepLearn** | [arxiv:2609.35911](https://arxiv.org/abs/2609.35911) · 2026-09-28 | 59.9% with GPT-5-mini / 57.8% with Qwen3.5-35B-A3B over five WebArena-Lite rounds. |
| [ ] | variant | **SOLO** | [arxiv:2609.34321](https://arxiv.org/abs/2609.34321) · 2026-09-28 | Recurring streams derived from WebArena and VisualWebArena. |
| [ ] | variant | **SURFPRM** | [arxiv:2609.32351](https://arxiv.org/abs/2609.32351) · 2026-09-26 | WebArena-Lite. |
| [ ] | variant | **WebMRE** | [arxiv:2609.27353](https://arxiv.org/abs/2609.27353) · 2026-09-23 | 541-task offline benchmark derived from successful WebArena trajectories. |
| [ ] | variant | **Growing the Harness** | [arxiv:2609.26760](https://arxiv.org/abs/2609.26760) · 2026-09-22 | WebArena-Verified. |
| [ ] | variant | **AutoTailor** | [arxiv:2609.13548](https://arxiv.org/abs/2609.13548) · 2026-09-11 | 90.6% correctness on 106 WebArena Postmill tasks with ReAct fallback. |
| [ ] | method | **WebArena-Lite evaluator audit** | [arxiv:2610.01491](https://arxiv.org/abs/2610.01491) · 2026-10-01 | Human review recovers 5.45–8.49 percentage points missed by automated evaluation in the audited setup. |

_reviewed: 14 · proposed: 0 · variants: 11 · methodology: 1 · skipped: 2_

## SWE-bench Verified

Current top: Claude Opus 5 (Vals.ai run) (97.00%)

| ✓ | Kind | System / Finding | Source | Score / Claim |
| --- | --- | --- | --- | --- |
| [ ] | proposed | **Chronos + SWE-agent (MiniMax M2.5)** | [arxiv:2610.11578](https://arxiv.org/abs/2610.11578) · 2026-10-08 | 79.8% headline result; two candidate agents and PR-history-guided selection. |
| [ ] | proposed | **RSIGym selected system** | [arxiv:2610.10310](https://arxiv.org/abs/2610.10310) · 2026-10-07 | 50.33% SWE-bench Verified after Opus 5-driven system improvement; exact resulting system needs verification. |
| [ ] | proposed | **TestGRAD** | [arxiv:2610.10242](https://arxiv.org/abs/2610.10242) · 2026-10-07 | 84.2% selected-submission pass@1 with a four-agent patch ensemble. |
| [ ] | proposed | **FC-SWE + SWE-agent (Qwen3.5-4B)** | [arxiv:2610.07898](https://arxiv.org/abs/2610.07898) · 2026-10-06 | 41.7% Resolved@1 / 52.8% Resolved@2 / 70.7% Resolved@11; verifier-assisted, hold from ordinary pass@1 ranking. |
| [ ] | variant | **SWE-CC** | [arxiv:2610.06193](https://arxiv.org/abs/2610.06193) · 2026-10-05 | Repository policy compliance evaluation beyond functional correctness. |
| [ ] | variant | **Teaching Agents to Code Reliably** | [arxiv:2610.03984](https://arxiv.org/abs/2610.03984) · 2026-10-02 | 43.0% pass@1 on a 270-issue held-out subset; verifier/search results use different budgets. |
| [ ] | variant | **HiSentinel** | [arxiv:2609.39957](https://arxiv.org/abs/2609.39957) · 2026-09-30 | SWE-bench Verified Mini. |
| [ ] | variant | **HERO** | [arxiv:2609.38885](https://arxiv.org/abs/2609.38885) · 2026-09-30 | SWE-bench Multilingual. |
| [ ] | method | **RippleCP** | [arxiv:2610.09088](https://arxiv.org/abs/2610.09088) · 2026-10-06 | 49.4 seconds saved per task in a 12-task recovery pilot; no full-suite new score. |
| [ ] | method | **Measurement-first audit** | [arxiv:2610.05830](https://arxiv.org/abs/2610.05830) · 2026-10-05 | Matched-control contamination gap is inconclusive and reproduction scorer fails validation. |
| [ ] | method | **Harness and inference budget** | [arxiv:2610.04433](https://arxiv.org/abs/2610.04433) · 2026-10-03 | Comparisons require matched budgets and repeated runs; observed rankings vary with setup. |
| [ ] | method | **FEAgent patch audit** | [arxiv:2610.04371](https://arxiv.org/abs/2610.04371) · 2026-10-03 | 94/331 test-passing patches behaviorally differ from the reference; this alone does not establish incorrectness. |

_reviewed: 20 · proposed: 4 · variants: 4 · methodology: 4 · skipped: 8_

## Aider

Current top: gpt-5 (high) (88.0%)

_No new candidates this run (reviewed 1, skipped 1)._

## OSWorld

Current top: Qwen3.8-Max (86.1%)

| ✓ | Kind | System / Finding | Source | Score / Claim |
| --- | --- | --- | --- | --- |
| [ ] | proposed | **HybridCUA-9B** | [arxiv:2609.38008](https://arxiv.org/abs/2609.38008) · 2026-09-29 | 53.6% OSWorld accuracy; GUI/CLI model, release and budget still need verification. |
| [ ] | proposed | **MintAct** | [arxiv:2609.22083](https://arxiv.org/abs/2609.22083) · 2026-09-18 | 48.9% OSWorld-Verified; exact model size and budget still need verification. |
| [ ] | variant | **Control OSWorld** | [arxiv:2610.03818](https://arxiv.org/abs/2610.03818) · 2026-10-02 | Adversarial control environment based on OSWorld. |
| [ ] | variant | **DeskForge** | [arxiv:2610.02320](https://arxiv.org/abs/2610.02320) · 2026-10-01 | OSWorld-G. |
| [ ] | variant | **AGW-35B / AutoGUIWorld** | [arxiv:2610.01215](https://arxiv.org/abs/2610.01215) · 2026-10-01 | 40.8% mean task score on 361 tasks excluding Google Drive, retaining partial credit. |
| [ ] | variant | **OSWorld-Science** | [arxiv:2609.39903](https://arxiv.org/abs/2609.39903) · 2026-09-30 | Scientific-software computer-use tasks. |
| [ ] | variant | **Talk2Agent** | [arxiv:2609.38867](https://arxiv.org/abs/2609.38867) · 2026-09-30 | Voice-interface evaluation projected onto text-agent environments. |
| [ ] | variant | **OSWorld-Pro** | [arxiv:2609.24890](https://arxiv.org/abs/2609.24890) · 2026-09-21 | Process-based scoring; does not replace original OSWorld task-success scores. |

_reviewed: 14 · proposed: 2 · variants: 6 · methodology: 0 · skipped: 6_

## OSWorld 2.0

Current top: Claude Fable 5.1 (77.9%)

_No new candidates this run (reviewed 1, skipped 1)._

## GAIA

Current top: OPS-Agentic-Search (92.36%)

_No new candidates this run (reviewed 1, skipped 1)._

## ClawBench

Current top: Claude Sonnet 4.6 (33.3%)

_No new candidates this run (reviewed 0, skipped 0)._

## HealthAdminBench

Current top: Claude Mythos 5 (browser-use) (51.9%)

_No new candidates this run (reviewed 0, skipped 0)._

## Online-Mind2Web

Current top: Browser Use Cloud (bu-max) (97.0%)

| ✓ | Kind | System / Finding | Source | Score / Claim |
| --- | --- | --- | --- | --- |
| [ ] | variant | **TeleTune + GPT-5.4** | [arxiv:2610.05437](https://arxiv.org/abs/2610.05437) · 2026-10-04 | 80.6% ± 4.1 on a filtered 122-task set; full paper changes the abstract-level classification. |

_reviewed: 3 · proposed: 0 · variants: 1 · methodology: 0 · skipped: 2_

## τ-bench

Current top: Step-3.5-Flash (88.2%)

| ✓ | Kind | System / Finding | Source | Score / Claim |
| --- | --- | --- | --- | --- |
| [ ] | proposed | **PROUR** | [arxiv:2609.32255](https://arxiv.org/abs/2609.32255) · 2026-09-26 | 28.17% average retail/airline success; verify backbone, attempts, and aggregation. |
| [ ] | variant | **Generative UI Harness** | [arxiv:2610.11123](https://arxiv.org/abs/2610.11123) · 2026-10-08 | UI-TAUBench. |
| [ ] | method | **SSCBench** | [arxiv:2610.11514](https://arxiv.org/abs/2610.11514) · 2026-10-08 | Fault adoption requires reporting when counterevidence was actually visible. |
| [ ] | method | **Prompt-injection detector transfer** | [arxiv:2610.03448](https://arxiv.org/abs/2610.03448) · 2026-10-02 | Detection rankings transfer poorly to agent tool outputs. |
| [ ] | method | **LiteTrajEval** | [arxiv:2610.03315](https://arxiv.org/abs/2610.03315) · 2026-10-02 | Compressed trajectory diagnosis changes cost and failure-localization agreement. |
| [ ] | method | **Risk-aware evaluation** | [arxiv:2609.38914](https://arxiv.org/abs/2609.38914) · 2026-09-30 | 86% of oracle impact-weighted failures recovered with 50 trials in an offline replay. |
| [ ] | method | **UserProxyBench** | [arxiv:2609.38043](https://arxiv.org/abs/2609.38043) · 2026-09-29 | User-simulator choice shifts the reported reward; record simulator and version. |
| [ ] | method | **Frozen judges, moving agents** | [arxiv:2609.34198](https://arxiv.org/abs/2609.34198) · 2026-09-28 | Judge error depends on agent version; current paired calibration matters. |

_reviewed: 11 · proposed: 1 · variants: 1 · methodology: 6 · skipped: 3_

## AgentBench

Current top: AgentRL w/ Qwen2.5-32B-Instruct (70.4%)

_No new candidates this run (reviewed 0, skipped 0)._

## Patterns worth a look

- Variant proliferation is substantial: BrowseComp-Plus, visual/video search, reduced desktop sets, and new scoring protocols need distinct labels before any shared ranking.
- Harness identity matters across browser, search, and coding results. Store model, tools, attempts, budget, evaluator, and task version alongside the score.
- Delta-only papers and unrelated name collisions were skipped. No results are inferred by adding a reported improvement to a historical baseline.

_Total reviewed: 86 · proposed: 9 · variants: 35 · methodology: 11 · skipped: 31_
