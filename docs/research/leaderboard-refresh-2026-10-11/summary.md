# Leaderboard refresh research — October 11, 2026

This refresh adds seven score rows for six approved systems: Wuying-Browser-Agent-27B on WebVoyager and Online-Mind2Web, CUAWright + GPT-5.5 on Online-Mind2Web, AREX-2 and Traverse-35B on BrowseComp, and Claude Opus 5.5 / Haiku 5.5 on DRACO. Each row retains the primary source and material protocol caveats. Ramain and the coding ensembles remain on hold. This refresh adds no OSWorld results; new computer-use results need release and task-set separation before insertion.

The September 11–October 11 arxiv sweep returned 86 benchmark-paper matches representing 81 unique papers across 14 tracked benchmarks. I reviewed abstracts for triage and inspected primary papers, launch posts, or model cards for the shortlist below. The sweep returns at most 20 recent papers per benchmark query; SWE-bench reached that cap. This is a targeted refresh, not an exhaustive literature review. August backfill and release posts supplement the sweep. See [the discovery tables](./discovery.md) for the abstract-level triage.

## Credibility and repository curation rules

The [contributor guide](../../../CONTRIBUTING.md#evidence-standard) requires a public source supporting the exact score, metric, system, reporting organization, date, and relevant evaluation setup. Its evidence hierarchy prefers benchmark-maintainer leaderboards, then papers/reports, official provider cards/posts, reproducible repositories, and inspectable third-party evaluations. Public, specific self-reports are admissible when labeled; this policy does not establish independent reproduction.

Wuying, CUAWright, AREX-2, Traverse, and the Claude cards have primary-source evidence sufficient for the approved additions, with protocol-specific notes. Ramain's vendor post supports the numbers but leaves important run details unresolved, so it remains on hold for verification. Chronos and TestGRAD also remain on hold; any future addition must name the multi-candidate system. Filtered tasks, different benchmark releases, and selected/retried aggregates require separate treatment.

The [contributor comparability rules](../../../CONTRIBUTING.md#comparability-and-admission), research and judge prompts, final-review prompt, and discovery skill now agree: documented custom setups are admissible with caveats; filtered sets require explicit page permission and a stated denominator/exclusions; incompatible releases and metrics remain separate; exact printed chart labels are admissible but visual estimates are not. Genuine older missing results can be intentional backfills. The [apply script](../../../src/scripts/discover-apply.ts) now labels its source check as score/system-token co-occurrence requiring manual attribution review. That check does not reproduce a run or establish correct table-row attribution.

## Additions to existing benchmark tables

All scores below are author- or provider-reported. Source verification confirms what the source reports; it does not independently reproduce the result. Record the full model-and-harness name, evaluation setup, and reporting organization in each row.

| Candidate                | Benchmark and score                             | Primary source                                                                                               | Recommendation                                                                                              |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Ramain Browser Agent     | WebVoyager **99.2%**; Online-Mind2Web **99.3%** | [September 24 release](https://ramain.ai/resources/introducing-ramain-browser-agent)                         | Hold for verification of denominator, evaluator, and attempt policy; vendor claim with incomplete protocol. |
| Wuying-Browser-Agent-27B | WebVoyager **80.6%**; Online-Mind2Web **66.7%** | [Paper, Table 2](https://arxiv.org/html/2608.17319v1) · August 18                                            | Added both results with the custom browser-use harness and 100-step budget.                                 |
| CUAWright + GPT-5.5      | Online-Mind2Web **89.4%**                       | [Paper, Table 1 and §3.1](https://arxiv.org/html/2610.04116v1) · October 2                                   | Added a named harness row on the full 300-task suite.                                                       |
| AREX-2 (Qwen3.8-27B)     | BrowseComp **84.0%**                            | [Paper, Table 2 and §4](https://arxiv.org/html/2609.38288v1) · September 29                                  | Added the trained research-agent system and its long-horizon budget.                                        |
| Traverse-35B             | BrowseComp **72.83%**                           | [Paper, abstract, §4.1, and Table 1](https://arxiv.org/html/2609.37082v2) · September 30 (v2)                | Added the model plus search/memory harness; Table 1 rounds the result to 72.8.                              |
| Claude Opus 5.5 (max)    | DRACO **87.4%**                                 | [System card, p. 187, Figure 8.11.2.A](https://www.anthropic.com/claude-opus-5-5-system-card) · September 22 | Added a new model row. Existing Opus 5 is a different model.                                                |
| Claude Haiku 5.5 (max)   | DRACO **81.5%**                                 | [System card, p. 121, Figure 8.8.2.A](https://www.anthropic.com/claude-haiku-5-5-system-card) · October 7    | Added a new model row using Anthropic's grading protocol.                                                   |

Ramain's post identifies the standard 300-task Online-Mind2Web suite, but does not supply enough detail to reconstruct retries, judge, or all evaluation denominators. Preserve that limitation. Its WebVoyager number differs from the current top's 99.19 by only 0.01 percentage points; these reports do not establish a meaningful performance advantage. Its **84.2% WebArena** claim is on **WebArena-Verified Hard, 258 tasks**, so it belongs in a separate variant table.

Wuying's flagship result uses DOM access with screenshots when needed and reports pass@1. The 9B and 4B models also have browser results, but the 27B row is the highest-priority backfill. Its τ²-bench / ClawEval / BFCL average should not be imported into τ-bench or ClawBench.

CUAWright exposes a terminal and filesystem for creating tools dynamically. The same paper reports **88.1%** on full Online-Mind2Web with GPT-5.4, which is another valid configuration if we want both backbones. Its desktop score uses a different task subset, discussed below.

AREX-2's research protocol allows up to 300 inner turns and 1,500 overall turns. Its **92.2% GAIA** result needs the validation/test split established before insertion into our GAIA table. Traverse uses Rubric → Answer → Verify states, explicit memory tools, a 256K context, and a 512-turn limit. Its BrowseComp-Lite ablations are separate from the headline result.

For DRACO, Anthropic uses an Opus 4.6 judge, a 980K token budget, search/fetch/code tools, and repeated grading. These scores should retain that evaluator label alongside any results obtained with other judges. Sonnet 5.5 at **87.0%** is already tracked.

## Separate the new OSWorld results

The official [OSWorld-V2 repository](https://github.com/xlang-ai/OSWorld-V2) recommends the 2.1 release. Our `osworld2` table contains several versions and task subsets. Distinguish release, full/offline/custom task set, partial credit versus strict success, and evaluator before adding new results.

The latest comparison in the [Haiku 5.5 system card, pp. 126–128 and Figure 8.9.3.A](https://www.anthropic.com/claude-haiku-5-5-system-card) uses **OSWorld 2.1's 82 offline tasks**, 500 steps, 1080p screenshots, an Opus 4.8 grader, and the mean of five runs. Anthropic evaluated all of these systems, including the OpenAI models. Scores are at max effort.

| System            | Partial credit | Strict success |
| ----------------- | -------------: | -------------: |
| Claude Opus 5.5   |          87.2% |          53.2% |
| Claude Sonnet 5.5 |          83.9% |          48.8% |
| GPT-6.1 Sol       |          76.6% |          39.8% |
| Claude Haiku 5.5  |          72.4% |          37.1% |
| GPT-6 Luna        |          48.9% |          17.1% |

These are candidates for a clearly labeled **2.1 offline** table or filter. Opus 5.5's launch reports **81.8%** on the full September task set; that is a different evaluation from 87.2% offline. Do not overwrite existing GPT-6.1 Sol **70.5%** or Gemini 4 Argon **69.2%** rows: both are already present and have different provenance.

Other desktop harness findings need separate treatment:

| System                                                                      | Reported result                                              | Disposition                                                                                                                                                |
| --------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CUAWright + GPT-5.6 Sol max](https://arxiv.org/html/2610.04116v1), Table 2 | 67.9% partial / 27.6% strict; GPT-5.5 xhigh is 63.2% / 25.7% | OSWorld 2.0, **105/108 tasks**, 300 steps. A custom-subset result.                                                                                         |
| [RSIAgent, GLM-5.3 + Kimi-K3](https://arxiv.org/html/2609.15364v1), §10.4   | 78.98% partial / 42.68% binary                               | August 8 offline, 82-task aggregate combining **41 RSI results and retained baseline scores**, including retries. Hold out of the ordinary pass@1 ranking. |
| [HybridCUA-9B](https://arxiv.org/abs/2609.38008)                            | 53.6% OSWorld accuracy                                       | Promising GUI/CLI model. Verify release, attempts, and step budget from the full evaluation record.                                                        |
| [MintAct](https://arxiv.org/abs/2609.22083)                                 | 48.9% OSWorld-Verified                                       | Verify the exact model size, task release, and step budget.                                                                                                |
| [AGW-35B / AutoGUIWorld](https://arxiv.org/html/2610.01215v1), Appendix C   | 40.8% mean OSWorld task score                                | **361 tasks excluding eight Google Drive tasks**, retaining partial credit. Do not treat it as full-suite binary success.                                  |

## Coding harness additions

These are missing systems with absolute SWE-bench Verified results. They warrant named harness entries if the board is expanded beyond its current emphasis on models.

| System                             | Result and evidence                                                                                                        | What the row must say                                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chronos + SWE-agent (MiniMax M2.5) | **79.8%**, [October 8 paper](https://arxiv.org/html/2610.11578v1), full 500 tasks. Five runs average **80.0% ± 0.17 SEM**. | PR-history memory, two patch-generating agents, and a selecting steward. Distinguish the headline run from the five-run mean; document history cutoff. |
| TestGRAD ensemble                  | **84.2% pass@1**, [October 7 paper](https://arxiv.org/html/2610.10242v1), full 500 tasks                                   | MiniMax M2.7 selector with a **four-agent candidate-patch ensemble**. Pass@1 describes the selected submission, not a single generation by one model.  |

Do not assign either score to the underlying model alone. [FC-SWE](https://arxiv.org/abs/2610.07898)'s 41.7% Resolved@1 / 52.8% Resolved@2 / 70.7% Resolved@11 are explicitly verifier-assisted and require separate protocol labels. RSIGym also has a 50.33% candidate result, but its selected system and evaluation setup need further checking.

## Benchmark and evaluation follow-ups

- **Search:** [Exa Agent Ultra](https://exa.ai/blog/exa-agent-ultra) reports on WANDR, DeepSearchQA, WideSearch, and FindAll; there is no verified BrowseComp or DRACO score to import from that announcement. [ATLAS](https://exa.ai/blog/atlas-benchmark), announced October 8, is a 547-task research benchmark with row-level F1 and cost comparisons. Consider it for a future research-agent board after checking dataset/grader availability and independent reproduction. Exa's reported BrowseComp memorization finding is a provider-authored audit, not a measured correction to every existing score.
- **Browser skills:** [TeleTune](https://arxiv.org/html/2610.05437v2) reports **80.6% ± 4.1** with GPT-5.4 on **122 category-filtered Online-Mind2Web tasks**, not the full 300. Keep it as a variant candidate. Its WorkArena average combines L1/L2 and does not match Ramain's L3 result.
- **Tool agents:** [PROUR](https://arxiv.org/abs/2609.32255) reports **28.17%** across τ-bench retail/airline. Establish the backbone, attempt metric, and averaging protocol before adding it; do not mix its τ³-bench transfer with original τ-bench.
- **Judges and harnesses:** [WebArena-Lite audit](https://arxiv.org/abs/2610.01491), [UserProxyBench](https://arxiv.org/abs/2609.38043), and [What Does a Harness Buy?](https://arxiv.org/abs/2610.04433) support recording judge/simulator versions, inference budget, repeated runs, and tool access. Their findings do not justify a uniform numerical adjustment to existing rows.

## Implementation status and follow-ups

1. Completed the seven approved score additions, classification records required by the charts, board dates, README refresh, and curation-rule alignment. Existing scores and source notes are preserved.
2. Leave new OSWorld results out of this update. A future change can retain one OSWorld page with independently ranked tables or filters for each release/task set, with partial credit and strict success shown as distinct metrics. Add the 2.1 offline candidates only after that structure is agreed.
3. Hold Ramain, Chronos, and TestGRAD as requested. Do not insert their scores into this refresh.
4. Keep filtered, ensemble, retry-selected, and verifier-assisted results visibly labeled; track the remaining candidates in review notes until their setup is verified.

No directly usable new original-benchmark result emerged from the sweep for Aider, AgentBench, ClawBench, or HealthAdminBench. That is a finding about this search window, not evidence that those leaderboards are complete.
