# WebVoyager model classification

Initially checked **2026-10-10**; audited **2026-10-11** including the refresh to 22 submissions.
Classification lives in `src/data/model-research/webvoyager.json`. The audit repaired Magnitude and
Runner H result links and pointed Operator directly to its numeric evaluation report. The separate
refresh added Wuying; its 80.6% primary-paper result and Qwen3.5-27B policy were checked here.

## Evidence and method

Read the repository's model-classification research skill and the OpenAI Docs skill. Retrieved the
authors' reports, paper HTML, evaluation configurations, official provider prices and actual Hugging
Face checkpoint inventories. Static requests supplied repository files and model inventories. Kura's
pages required JavaScript; `steel scrape` successfully retrieved their rendered text after static
extraction returned an empty application shell.

Total parameters take precedence over token prices. Price classifications use standard uncached USD
per million tokens and `(3 × input + output) / 4`, with no cache, batch, quota or subscription discount.
Unknown historical identities retain explicitly named provisional records. Multi-model runtimes keep
every identified required component and use the largest category, not summed parameters or prices.
External scoring judges and training-only teachers are excluded.

## Evaluated stacks and meaningful caveats

| Submission                 | Runtime identified from primary evidence                         | Identity or release caveat                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| browser-control (Fable 5)  | Fable 5 through Claude Code and browser-control                  | Author runner names the model; Fable availability subsequently changed. GPT-5.5 scores completed runs only.                                                   |
| Alumnium                   | Sonnet 4.6 orchestrator + GPT-5 nano browser subagent            | Both participate in execution. GPT-5 scoring is excluded.                                                                                                     |
| Surfer 2                   | o3 + Sonnet 4.5 + GPT-4.1 validator + Holo1.5-7B localizer       | Use the paper's WebVoyager configuration, not its different WebArena stack. Exact Surfer 2 harness release unverified.                                        |
| Magnitude                  | Sonnet 4, pinned `claude-sonnet-4-20250514`                      | Recovered author evaluation repository after original marketing route became a 404.                                                                           |
| Surfer-H + Holo1           | Holo1-7B policy/localizer + GPT-4o validator                     | 92.2% uses the closed validator and ten-attempt configuration; all-Holo results differ. GPT-4o snapshot unpinned.                                             |
| browser-control (Opus 4.8) | Opus 4.8 through Claude Code and browser-control                 | Public harness, closed weights; external judge excluded.                                                                                                      |
| Browserable                | Gemini 2.0 Flash + GPT-4o/Sonnet 3.5 rate-limit fallbacks        | Source does not establish released custom fine-tuned weights. Fallback invocation shares and snapshots unspecified.                                           |
| Browser Use                | GPT-4o                                                           | Evaluation code uses Azure deployment aliases; no exact historical checkpoint verified.                                                                       |
| GLM-5V-Turbo               | Named Z.ai API model                                             | No parameter total or evaluated downloadable checkpoint verified. Independent OpenRouter $1.20/$4 tariff matches the shared OSWorld record's Vercel evidence. |
| Agent Kura                 | o1 initial planner + four GPT-4o agent roles                     | Historical snapshots unpinned. Current primary pages cannot prove an exact November 2024 checkpoint or release of full agent code.                            |
| Operator                   | Original January 2025 OpenAI CUA                                 | Do not replace with later computer-use-preview API model or its tariff.                                                                                       |
| Notte                      | Gemini 2.0 Flash reasoning and perception                        | 86.2% is self-reported completion on WebVoyager30, 30 tasks × eight runs. Handler overrides the default Llama perception helper.                              |
| Skyvern 2.0                | GPT-4o + GPT-4o-mini                                             | Updated author page retains historical setup; GPT-4o snapshot unpinned. Evaluation ran on Skyvern Cloud.                                                      |
| Project Mariner            | December 2024 Gemini 2.0 prototype                               | Author does not identify it as Flash or provide a model-specific tariff. Provisional Large could be revised downward.                                         |
| Wuying-Browser-Agent-27B   | Qwen3.5-27B post-trained browser policy                          | Paper Table 2 gives 80.6%; no matching released checkpoint verified. Training teachers and post-run judges excluded.                                          |
| Agent-E                    | GPT-4 Turbo for planner and navigator                            | Stable April 2024 snapshot mapping follows the historical recommended API alias, not an explicit run log.                                                     |
| WebSight                   | WebSight-7B action model + GPT-4.1 mini reasoning                | Open action checkpoint plus closed planner is a mixed stack.                                                                                                  |
| Runner H 0.1               | H-VLM 3B + H-LLM 2B + undisclosed external models                | No verified original weight release; later Holo weights are not evidence for this run. External runtime is provisionally Large.                               |
| WebVoyager                 | GPT-4 Vision preview                                             | Original evaluation model; task-generation and scoring models excluded.                                                                                       |
| Anthropic Computer Use 3.5 | October 2024 Sonnet computer-use demo                            | Release-date inference rather than snapshot log; Kura comparison covers 50 tasks.                                                                             |
| WILBUR                     | GPT-4-0125-preview + text-embedding-3-large + learned MLP ranker | No public trained ranker download/full harness verified; retain uncertainty.                                                                                  |
| GPT-4 (All Tools)          | Historical ChatGPT tool-enabled product                          | No pinned API checkpoint or full runtime disclosure; provisional Large.                                                                                       |

Runtime validators in Surfer 2 and Surfer-H feed corrective feedback into another attempt. They are
part of the evaluated agent, unlike the post-run judge. Open harness code never establishes open model
weights. Unverified checkpoints remain uncertain even when the base model or a later release is open.

## Counts and prices

The actual public ungated inventories for [Holo1-7B](https://huggingface.co/api/models/Hcompany/Holo1-7B),
[Holo1.5-7B](https://huggingface.co/api/models/Hcompany/Holo1.5-7B), and
[WebSight-7B](https://huggingface.co/api/models/tanvirb/websight-7B) each contain four complete weight
shards and report **8,292,166,656** parameters, including vision components. All are Small. Their 7B
product labels are not substituted for the inspected tensor total. WebSight's merged checkpoint is
the one loaded by the published agent, not merely an available base model or archived adapter.

[WILBUR's paper](https://arxiv.org/html/2404.05902) specifies a 7680→200→200→1 fully connected ranker.
The recorded 1,576,601 parameters include linear-layer biases and are derived from that architecture,
not from an inspected released checkpoint. The Tiny classification is robust to bias accounting.
Its embedding helper has only a published input tariff: no output price of zero was invented.
That helper is Small/Estimated with low confidence, so WILBUR's aggregate basis remains Estimated.

| New priced record              | Standard input / output, USD per 1M tokens |  Blend | Category |
| ------------------------------ | -----------------------------------------: | -----: | -------- |
| GPT-5 nano                     |                                0.05 / 0.40 | 0.1375 | Small    |
| GPT-4.1                        |                                      2 / 8 |   3.50 | Large    |
| GPT-4.1 mini                   |                                0.40 / 1.60 |   0.70 | Medium   |
| GPT-4-0125-preview             |                                    10 / 30 |     15 | Large    |
| GPT-4 Vision preview           |                                    10 / 30 |     15 | Large    |
| Claude Sonnet 4                |                                     3 / 15 |      6 | Large    |
| Claude 3.5 Sonnet October 2024 |                                     3 / 15 |      6 | Large    |
| Gemini 2.0 Flash, Google Cloud |                                0.15 / 0.60 | 0.2625 | Medium   |

OpenAI prices came from its retrieved model documentation and legacy Vision deprecation table;
Claude 3.5 pricing combines the original launch tariff with the October announcement that pricing was
unchanged. Gemini uses the verified Google Cloud tariff because the current Developer API pricing
page no longer includes 2.0 Flash. This is a disclosed provider proxy, not the benchmark's free-tier
bill. No total parameter counts are inferred from these tariffs.

## Primary sources retrieved

- [browser-control evaluated runs](https://github.com/omxyz/webvoyager) and
  [CDP harness](https://github.com/keon/browser-control).
- [Alumnium setup](https://alumnium.ai/blog/webvoyager-benchmark/).
- [Surfer 2 report](https://arxiv.org/html/2510.19949v1),
  [Surfer-H report](https://arxiv.org/html/2506.02865), and
  [released Surfer-H implementation](https://github.com/hcompai/surfer-h-cli).
- [Magnitude evaluation runner](https://github.com/magnitudedev/webvoyager/blob/main/wv-runner.ts).
- [Browserable configuration](https://www.browserable.ai/blog/web-voyager-benchmark),
  [Browser Use report](https://browser-use.com/posts/sota-technical-report), and
  [Azure model aliases](https://github.com/browser-use/eval/blob/main/run_browser_use.py).
- [GLM-5V model guide](https://docs.z.ai/guides/vlm/glm-5v-turbo),
  [OpenRouter serving tariff](https://openrouter.ai/z-ai/glm-5v-turbo/pricing), and publisher inventory.
- [Kura benchmark page](https://www.trykura.com/benchmarks) and
  [five-agent architecture](https://www.trykura.com/technical-deep-dive).
- [Notte benchmark repository](https://github.com/nottelabs/open-operator-evals),
  [Gemini configuration](https://github.com/nottelabs/open-operator-evals/blob/main/configs/notte.headless.gemini.toml),
  and [perception override](https://github.com/nottelabs/open-operator-evals/blob/main/eval/agent_handlers/falco.py).
- [Skyvern historical setup](https://www.skyvern.com/blog/skyvern-2-0-webvoyager-benchmark-results/),
  [Mariner December 2024 announcement](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/google-gemini-ai-update-december-2024/),
  and [Runner H historical update](https://lp.hcompany.ai/blog/a-research-update).
- [Agent-E paper](https://arxiv.org/html/2407.13032) and
  [July 2024 README](https://github.com/EmergenceAI/Agent-E/blob/205d1bf9da7eb14d612de0d9a2ee8f94df3050cb/README.md).
- [WebSight paper](https://arxiv.org/html/2508.16987),
  [runtime model constants](https://github.com/SuperAce100/websight/blob/main/src/websight/agent/agent.py),
  and merged checkpoint inventory above.
- [Original WebVoyager paper](https://arxiv.org/html/2401.13919),
  [Anthropic October computer-use release](https://www.anthropic.com/news/3-5-models-and-computer-use),
  and [WILBUR author page](https://michael-lutz.github.io/WILBUR/).

Per-model registry sources also contain the exact provider price URLs. Shared model records retain
their independently checked evidence in the other benchmark batches.

## Retrieval limits and validation

Magnitude's old marketing route and Runner H's original source route no longer supplied the report;
author repositories/archive pages recovered the relevant evidence. GPT-4o, Kura's o1, Browserable's
Sonnet fallback and several proprietary prototypes remain historically unpinned. The GLM-5V
publisher search returned no matching downloadable checkpoint; that is not proof that no release
could exist elsewhere. No release assertion is based solely on a public GitHub repository.

Validated the batch with `researchBatchSchema`, exact name coverage for 22 source rows,
unique owned model IDs, parameter/category boundaries, standard-price calculations, low confidence
on every provisional record, and references against the combined registry. Parent integration runs
lint/build and combined tests; this research task does not build or change benchmark scores.

## October 11 verification

The [verification report](../chart-data-verification-2026-10-11.md) records all 22 score checks, source
repairs, evaluation differences, and shared-registry validation. Wuying adds one Small/Uncertain row.
