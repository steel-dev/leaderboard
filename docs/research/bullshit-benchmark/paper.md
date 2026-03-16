[Branches](https://github.com/petergpt/bullshit-benchmark/branches)
 [Tags](https://github.com/petergpt/bullshit-benchmark/tags)

BullshitBench measures whether models detect nonsense, call it out clearly, and avoid confidently continuing with invalid assumptions.

- Public viewer (latest): [https://petergpt.github.io/bullshit-benchmark/viewer/index.v2.html](https://petergpt.github.io/bullshit-benchmark/viewer/index.v2.html)

- Updated: 2026-03-12

- Added benchmark runs for the new Grok 4.20 variants across both published datasets:
  - `x-ai/grok-4.20-beta`
  - `x-ai/grok-4.20-multi-agent-beta`
- Published the Grok 4.20 rows into both viewer tracks:
  - `v1` (`data/latest`) with `55` questions
  - `v2` (`data/v2/latest`) with `100` questions
- Simplified the visible model labels in the viewers by dropping the `Beta` suffix from the Grok 4.20 display names while keeping the underlying model IDs unchanged.
- Refined the main chart row-selection treatment to make model selection easier to see without overpowering the chart.
- Updated org color mapping so `xAI` renders in black and `OpenAI` renders in green in the viewers.
- Added click-to-pin labels for scatter-chart dots in the v2 viewer so specific models can be called out on demand.
- Full details: [CHANGELOG.md](https://github.com/petergpt/bullshit-benchmark/blob/main/CHANGELOG.md)

- `100` new nonsense questions in the v2 set.
- Domain-specific question coverage across `5` domains: `software` (40), `finance` (15), `legal` (15), `medical` (15), `physics` (15).
- New visualizations in the v2 viewer, including:
  - Detection Rate by Model (stacked mix bars)
  - Domain Landscape (overall vs domain detection mix)
  - Detection Rate Over Time
  - Do Newer Models Perform Better?
  - Does Thinking Harder Help? (tokens/cost toggle)

The screenshots below follow the same flow as `viewer/index.v2.html`, starting with the main chart.

Primary leaderboard-style view showing each model's green/amber/red split.

[![BullshitBench v2 - Detection Rate by Model](https://github.com/petergpt/bullshit-benchmark/raw/main/docs/images/v2-detection-rate-by-model.png)](https://github.com/petergpt/bullshit-benchmark/blob/main/docs/images/v2-detection-rate-by-model.png)

Detection mix by domain to compare overall performance vs each domain at a glance.

[![BullshitBench v2 - Domain Landscape](https://github.com/petergpt/bullshit-benchmark/raw/main/docs/images/v2-domain-landscape.png)](https://github.com/petergpt/bullshit-benchmark/blob/main/docs/images/v2-domain-landscape.png)

Release-date trend view focused on Anthropic, OpenAI, and Google.

[![BullshitBench v2 - Detection Rate Over Time](https://github.com/petergpt/bullshit-benchmark/raw/main/docs/images/v2-detection-rate-over-time.png)](https://github.com/petergpt/bullshit-benchmark/blob/main/docs/images/v2-detection-rate-over-time.png)

All-model scatter by release date vs. green rate.

[![BullshitBench v2 - Do Newer Models Perform Better](https://github.com/petergpt/bullshit-benchmark/raw/main/docs/images/v2-do-newer-models-perform-better.png)](https://github.com/petergpt/bullshit-benchmark/blob/main/docs/images/v2-do-newer-models-perform-better.png)

Reasoning scatter (tokens/cost toggle in the viewer) vs. green rate.

[![BullshitBench v2 - Does Thinking Harder Help](https://github.com/petergpt/bullshit-benchmark/raw/main/docs/images/v2-does-thinking-harder-help.png)](https://github.com/petergpt/bullshit-benchmark/blob/main/docs/images/v2-does-thinking-harder-help.png)

- `100` nonsense prompts total.
- `5` domain groups: `software` (40), `finance` (15), `legal` (15), `medical` (15), `physics` (15).
- `13` nonsense techniques (for example: `plausible_nonexistent_framework`, `misapplied_mechanism`, `nested_nonsense`, `specificity_trap`).
- `3` -judge panel aggregation (`anthropic/claude-sonnet-4.6`, `openai/gpt-5.2`, `google/gemini-3.1-pro-preview`) using `full` panel mode + `mean` aggregation.
- Published v2 leaderboard currently includes `80` model/reasoning rows.

- `Clear Pushback`: the model clearly rejects the broken premise.
- `Partial Challenge`: the model flags issues but still engages the bad premise.
- `Accepted Nonsense`: the model treats the nonsense as valid.

## Quick Start

1. Set API keys:

```
export OPENROUTER_API_KEY=your_key_here
export OPENAI_API_KEY=your_openai_key_here  # required only for models routed to OpenAI
export OPENAI_PROJECT=proj_xxx              # optional: force OpenAI requests to a specific project
export OPENAI_ORGANIZATION=org_xxx          # optional: force organization context
```

Provider routing is configured per model via `collect.model_providers` and `grade.model_providers` in config (default is OpenRouter), for example:`{"*":"openrouter","gpt-5.3":"openai"}`.

1. Run collection + primary judge (Claude by default):

```
./scripts/run_end_to_end.sh
```

1. Run v2 end-to-end and publish into the dedicated v2 dataset:

```
./scripts/run_end_to_end.sh --config config.v2.json --viewer-output-dir data/v2/latest --with-additional-judges
```

1. Optionally run the default config end-to-end (publishes to `data/latest`):

```
./scripts/run_end_to_end.sh --with-additional-judges
```

1. Open the viewer:

- Published viewer (latest): [https://petergpt.github.io/bullshit-benchmark/viewer/index.v2.html](https://petergpt.github.io/bullshit-benchmark/viewer/index.v2.html)

- Local viewer (optional):

```
./scripts/run_end_to_end.sh --with-additional-judges --serve --port 8877
```

Then open `http://localhost:8877/viewer/index.v2.html`. Use the `Benchmark Version` dropdown in the filters panel to switch between published datasets (for example `v1` and `v2`).

## Published Datasets

- v1 dataset remains in `data/latest`.
- v2 dataset is published in `data/v2/latest`.
- v2 question set comes from `drafts/new-questions.md` via `scripts/build_questions_v2_from_draft.py`.
- Canonical judging is now fixed to exactly 3 judges on every row with mean aggregation (legacy disagreement-tiebreak mode is retired from the main pipeline).
- Release notes and notable changes are tracked in `CHANGELOG.md`.

## Documentation

- [Technical Guide](https://github.com/petergpt/bullshit-benchmark/blob/main/docs/TECHNICAL.md)
    : pipeline operations, publishing artifacts, launch-date metadata workflow, repo layout, env vars.
- [Changelog](https://github.com/petergpt/bullshit-benchmark/blob/main/CHANGELOG.md)
    : v1 to v2 release notes and publish-history highlights.
- [Question Set](https://github.com/petergpt/bullshit-benchmark/blob/main/questions.json)
    : benchmark questions and scoring metadata.
- [Question Set v2](https://github.com/petergpt/bullshit-benchmark/blob/main/questions.v2.json)
    : v2 question pool generated from `drafts/new-questions.md`.
- [Config](https://github.com/petergpt/bullshit-benchmark/blob/main/config.json)
    : default model/pipeline settings.
- [Config v2](https://github.com/petergpt/bullshit-benchmark/blob/main/config.v2.json)
    : v2-ready config (uses `questions.v2.json`).

## Notes

- This README is intentionally audience-facing.
- Technical and maintainer-oriented content lives in `docs/TECHNICAL.md`.

## License

MIT. See [LICENSE](https://github.com/petergpt/bullshit-benchmark/blob/main/LICENSE)
.

## Star History

![Star History Chart](https://camo.githubusercontent.com/51737f68a9094b0a30ec819bc5111b84fb773592b7527da9d95af17d96def327/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f7376673f7265706f733d70657465726770742f62756c6c736869742d62656e63686d61726b26747970653d44617465266361636865627573743d3230323630333136)

## About

BullshitBench measures whether AI models challenge nonsensical prompts instead of confidently answering them, created by Peter Gostev.

[x.com/petergostev](https://x.com/petergostev"https://x.com/petergostev")

[Readme](https://github.com/petergpt/bullshit-benchmark#readme-ov-file)

[MIT license](https://github.com/petergpt/bullshit-benchmark#MIT-1-ov-file)

[Activity](https://github.com/petergpt/bullshit-benchmark/activity)

[**1.1k** stars](https://github.com/petergpt/bullshit-benchmark/stargazers)

[**9** watching](https://github.com/petergpt/bullshit-benchmark/watchers)

[**43** forks](https://github.com/petergpt/bullshit-benchmark/forks)

[Report repository](https://github.com/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fpetergpt%2Fbullshit-benchmark&report=petergpt+%28user%29)

## Releases

No releases published

## Packages

## Contributors

## Languages

- [HTML 56.1%](https://github.com/petergpt/bullshit-benchmark/search?l=html)

- [Python 39.2%](https://github.com/petergpt/bullshit-benchmark/search?l=python)

- [Shell 4.7%](https://github.com/petergpt/bullshit-benchmark/search?l=shell)

