# Atlas deep-research report — week 2026-06-19

## Aider (aider)

_1 candidate(s), ~$0.90, stop=tokens_

# Aider Benchmark — New Absolute Scores Published 2026-06-19 through 2026-06-28

## Bottom Line

**Zero new absolute scores on the original Aider benchmark (pass_rate_2, 225 exercises) were published during the 2026-06-19 to 2026-06-28 lookback window.** The official Aider leaderboard page contains exactly the same 15 pre-tracked entries — no additions. One candidate score was found in an open (unmerged) GitHub pull request proposing "DeepSeek V4 Pro" at 94.2%, but it uses a non-standard edit format, was submitted by a third party, and has not been accepted. The DeepSeek V4 Pro HuggingFace model card reports no Aider score. Both arXiv papers from the deterministic sweep contain no absolute Aider benchmark scores.

**One candidate (low confidence, flagged with caveats):**

| System | Score | Source | Status | Setup |
|---|---|---|---|---|
| DeepSeek V4 Pro | **94.2%** (212/225, pass_rate_2) | GitHub PR #5282 [1] | **OPEN/unmerged** — not on official leaderboard | Non-standard "atomic" edit format; third-party submission |

---

## 1. Official Aider Leaderboard — Current Contents

The official Aider leaderboard at `aider.chat/docs/leaderboards/` [2] was fetched and verified as of the lookback window. It is titled **"Aider polyglot coding leaderboard"** and the page defines its benchmark as: *"Aider's polyglot benchmark tests LLMs on 225 challenging Exercism coding exercises across C++, Go, Java, JavaScript, Python, and Rust"* [2]. The polyglot benchmark **is** the original Aider benchmark — there is no separate non-polyglot variant tracked on this leaderboard.

All 15 displayed entries match the pre-tracked set exactly, with no new additions:

| # | Model | pass_rate_2 | Config label |
|---|---|---|---|
| 1 | gpt-5 (high) | 88.0% | diff |
| 2 | gpt-5 (medium) | 86.7% | diff, reasoning_effort: medium |
| 3 | o3-pro (high) | 84.9% | — |
| 4 | gemini-2.5-pro-preview-06-05 (32k think) | 83.1% | --thinking-tokens 32k |
| 5 | gpt-5 (low) | 81.3% | reasoning_effort: low |
| 6 | o3 (high) | 81.3% | diff, reasoning_effort: high |
| 7 | grok-4 (high) | 79.6% | — |
| 8 | gemini-2.5-pro-preview-06-05 (default think) | 79.1% | — |
| 9 | o3 (high) + gpt-4.1 | 78.2% | architect mode |
| 10 | o3 | 76.9% | — |
| 11 | Gemini 2.5 Pro Preview 05-06 | 76.9% | diff |
| 12 | DeepSeek-V3.2-Exp (Reasoner) | 74.2% | diff |
| 13 | Gemini 2.5 Pro Preview 03-25 | 72.9% | diff-fenced |
| 14 | claude-opus-4-20250514 (32k thinking) | 72.0% | --thinking-tokens 32k |
| 15 | o4-mini (high) | 72.0% | diff, reasoning_effort: high |

Source: aider.chat/docs/leaderboards/ [2]. Page footer: *"By Paul Gauthier, last updated November 20, 2025."* [2].

**No new system or score has been added to the official leaderboard during the 2026-06-09 through 2026-06-28 window.**

---

## 2. Candidate Score: DeepSeek V4 Pro — 94.2% (Open PR, Not Merged)

### The score

A GitHub pull request (**PR #5282**, titled *"[codex] Add atomic edit format and DeepSeek V4 Pro polyglot result"*) was submitted on **2026-06-19** by user **danielgonzagat** [1]. It proposes adding the following entry to `aider/website/_data/polyglot_leaderboard.yml`:

- **System**: DeepSeek V4 Pro
- **pass_rate_2**: 94.2% (212/225 exercises passing on try 2)
- **pass_rate_1**: 36.4% (82/225 passing on try 1)
- **Command**: `aider --model deepseek/deepseek-v4-pro`
- **Edit format**: `atomic` (a **new** edit format introduced in this same PR)
- **Benchmarked commit**: `c4d9f23`
- **Benchmark date**: 2026-06-18

**Verbatim prose** from the PR description body (danielgonzagat, Jun 19, 2026):

> "The submitted leaderboard row reports: `212/225` passing on try 2, `94.2%`" [1]

(Full sentence continues: "`82/225` passing on try 1, `36.4%` model: `DeepSeek V4 Pro` command: `aider --model deepseek/deepseek-v4-pro` edit format: `atomic`".) An independent cross-check later in the PR body confirms: "independent aggregate cross-check from the 225 r11 per-case JSONs matched the leaderboard row: `pass_num_2=212`, `pass_rate_2=94.2`" [1].

### Why this is a low-confidence candidate

| Dimension | Assessment |
|---|---|
| **Merged status** | **NOT merged.** The PR is marked "Open" — *"danielgonzagat wants to merge 61 commits into Aider-AI:main"* [1]. The main-branch `polyglot_leaderboard.yml` (fetched from `raw.githubusercontent.com/Aider-AI/aider/main/`) [3] does **not** contain any DeepSeek V4 Pro entry. The last entries in the data file are DeepSeek-V3.2-Exp (Reasoner) at 74.2% and DeepSeek-V3.2-Exp (Chat) at 70.2%, dated 2025-10-03 [3]. |
| **Benchmark variant** | **Original benchmark** (225 polyglot exercises, pass_rate_2, two attempts). The PR explicitly targets the standard polyglot benchmark ref `7e0611e77b54e2dea774cdc0aa00cf9f7ed6144f` [1]. `isVariant = false`. |
| **Edit format (non-standard)** | Uses **"atomic"** — a brand-new whole-file edit format created in this same PR (commit `22b51fc`: *"feat: add atomic whole-file edit format"*). This is not one of Aider's standard formats (diff, whole, diff-fenced, architect). Results may not be directly comparable to other leaderboard entries using standard formats. |
| **Test-error reflection (reverted)** | The PR initially included commits that *"inject[ed] hidden test source into the model's retry prompt"* (test-error reflection augmentation). These were **reverted** in commit `8d21c87` (*"Removes the test-error reflection augmentation that injected hidden test source into the model's retry prompt. base_coder.py now matches upstream; the benchmark passes the raw test output through. Scores are comparable to the official harness."*) [1]. The final 94.2% score was obtained after this revert, using the standard retry harness. |
| **isSelfReported** | **false.** The submitter is `danielgonzagat` (a third party), not DeepSeek. DeepSeek's own model card does not report this score. |
| **Reporting organization** | danielgonzagat (independent contributor), not DeepSeek |
| **sourceTier** | 3 (open/unmerged pull request by a third party, not an official benchmark-author publication) |

---

## 3. DeepSeek V4 Pro HuggingFace Model Card — No Aider Score

The official DeepSeek V4 Pro model card (`huggingface.co/deepseek-ai/DeepSeek-V4-Pro`) [4] was fetched in full. Its evaluation tables span:

- **Base model**: AGIEval, MMLU, MMLU-Redux, MMLU-Pro, MMMLU, C-Eval, CMMLU, MultiLoKo, Simple-QA verified, SuperGPQA, FACTS Parametric, TriviaQA, BBH, DROP, HellaSwag, WinoGrande, CLUEWSC, BigCodeBench, HumanEval, GSM8K, MATH, MGSM, CMath, LongBench-V2
- **Instruct model (vs. frontier)**: MMLU-Pro, SimpleQA-Verified, Chinese-SimpleQA, GPQA Diamond, HLE, LiveCodeBench, Codeforces, HMMT 2026 Feb, IMOAnswerBench, Apex, Apex Shortlist, MRCR 1M, CorpusQA 1M, Terminal Bench 2.0, SWE Verified, SWE Pro, SWE Multilingual, BrowseComp, HLE w/ tools, MCPAtlas, GDPval-AA, Toolathlon
- **Mode comparison (non-think / high / max)**: same benchmarks across V4-Flash and V4-Pro reasoning modes

**No Aider, Aider Polyglot, or pass_rate_2 entry appears anywhere in the model card.** DeepSeek's self-reported evaluation omits the Aider benchmark entirely.

---

## 4. arXiv Paper Sweep

### arXiv:2606.24429 — "Detecting AI Coding Agents in Open Source" (2026-06-23)

This paper does **not** report any Aider benchmark score. "Aider" appears solely as one of several AI coding agents whose usage is detected in open-source repositories:

> *"PR-deployed cloud agents (Codex, Cursor) surface as feature work, while commit-deployed in-editor agents (Claude Code, OpenHands, Aider) surface as maintenance."* [5]

The paper is a census of agent usage across 180M repositories — it contains no benchmark performance numbers of any kind.

### arXiv:2606.24020 — "You Don't Need to Run Every Eval" (2026-06-22)

This paper mentions "Aider Polyglot" as one of 133 benchmarks in its BenchPress suite, used for rank-2 matrix completion to predict model scores. It does **not** report any individual absolute Aider pass_rate_2 score for any specific model:

> *"a cheaper set {GPQA-D, MMLU-Pro, Aider Polyglot, MATH-500, AIME 2026} can predict a model's evals to within 4.55."* [6]

The paper uses Aider Polyglot as a predictor input, not as a score-reporting benchmark. No individual model × Aider cell values are disclosed in the abstract.

### Other arXiv papers

Broad searches for *"aider benchmark"*, *"aider leaderboard"*, *"pass_rate_2"*, and *"aider polyglot"* in combination with 2026 dates surfaced no additional arXiv papers reporting absolute Aider scores in the window.

---

## 5. Vendor Blog / Model Card Sweep

Searches targeted at OpenAI, Google DeepMind, Anthropic, xAI, DeepSeek, Alibaba/Qwen, Moonshot/Kimi, MiniMax, z.ai, Mistral, Cohere, and Meta model cards and blogs for Aider pass_rate_2 scores in this window returned no results. No HuggingFace model card for any model released or updated in the window reports an Aider polyglot pass_rate_2 absolute score. No X/Twitter post linking to a primary source with a new Aider score was identified.

---

## 6. Summary of All Candidates

| # | System | Score | Source | Date | isVariant | isSelfReported | sourceTier | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | DeepSeek V4 Pro | 94.2% (pass_rate_2) | GitHub PR #5282 [1] | 2026-06-19 | false (original benchmark) | false (third party: danielgonzagat) | 3 | **Low confidence.** Open/unmerged PR. Non-standard "atomic" edit format. Not on official leaderboard. Test-error reflection augmentation was reverted before final score. |

**No other new absolute Aider original-benchmark scores were found** in vendor blogs, model cards, arXiv papers, or the official leaderboard during the 2026-06-19 to 2026-06-28 window.

---

## Source Tiers

- **Tier 1** (official benchmark-author publication): None found in window
- **Tier 2** (vendor self-report in primary blog/card/PDF): None found in window
- **Tier 3** (third-party submission, open PR): DeepSeek V4 Pro 94.2% [1]

- DeepSeek V4 Pro HuggingFace model card, huggingface.co/deepseek-ai/DeepSeek-V4-Pro) does NOT report any Aider/Aider Polyglot score. The evaluation tables include MMLU-Pro, GPQA Diamond, LiveCodeBench, SWE Verified, SWE Pro, SWE Multilingual, BrowseComp, Terminal Bench 2.0, HLE, Codeforces, HMMT, etc. — but NO Aider entry whatsoever. The card was published ~2026-06-27 (paper arXiv:2606.19348).

## Sources

1. [[codex] Add atomic edit format and DeepSeek V4 Pro polyglot result by danielgonzagat · Pull Request #5282 · Aider-AI/aider](https://github.com/Aider-AI/aider/pull/5282)
2. [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
3. [polyglot_leaderboard.yml](https://raw.githubusercontent.com/Aider-AI/aider/main/aider/website/_data/polyglot_leaderboard.yml)
4. [deepseek-ai/DeepSeek-V4-Pro · Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)
5. [Detecting AI Coding Agents in Open Source: A Validated Multi-Method Census of 180 Million Repositories](https://arxiv.org/abs/2606.24429)
6. [You Don't Need to Run Every Eval](https://arxiv.org/abs/2606.24020)

## ClawBench (clawbench)

_2 candidate(s), ~$0.86, stop=tokens_

# ClawBench — New Absolute Scores on the Original Benchmark (Lookback: 2026-06-19 onward)

## Bottom Line

**Two low-confidence candidates surface for scores on the original V1 corpus (153 tasks): claude-opus-4-6 (61.4%, 94/153) and gpt-5.4-mini (24.8%, 38/153), both from the claw-bench.com V1 (Hermes) leaderboard.** These are the only models with absolute scores on the original 153-task corpus that are absent from the existing 7 tracked rows. They carry a significant caveat: they are scored by the two-stage HTTP-interception + LLM-judge scheme, not the paper's Agentic Evaluator SR, so they are not directly comparable to the existing tracked rows and should be treated as variant-metric candidates (`isVariant` applies). No source was updated within the 2026-06-19 to 2026-06-28 lookback window — the claw-bench.com snapshot remains dated 2026-05-20 (re-verified 2026-06-28), and all official dataset pages, vendor blogs, and recent preprints either predate the window or report on different benchmarks (V2, or name-collision projects).

---

## What the Evidence Shows

### The Original Benchmark and Its Canonical Scores

The original ClawBench is the **V1 corpus: 153 tasks across 144 live websites in 15 life categories**, scored via the Agentic Evaluator that compares agent trajectories against human ground-truth reference trajectories over five behavioral layers (session replay, screenshots, HTTP traffic, agent reasoning traces, browser actions), producing a binary pass/fail with success rate (SR) as the primary metric [1]. The benchmark paper (arXiv:2604.08523) reports SR for 7 frontier models [1]:

| Rank | Model | Overall SR | Source |
|------|-------|-----------|--------|
| 1 | Claude Sonnet 4.6 | 33.3% | [1] |
| 2 | GLM-5 | 24.2% | [1] |
| 3 | Gemini 3 Flash | 19.0% | [1] |
| 4 | Claude Haiku 4.5 | 18.3% | [1] |
| 5 | GPT-5.4 | 6.5% | [1] |
| 6 | Gemini 3.1 Flash Lite | 3.3% | [1] |
| 7 | Kimi K2.5 | 0.7% | [1] |

These are the **existing tracked rows**. The task asks for NEW scores since 2026-06-19, not a re-report of these.

### Official Leaderboard Activity Post-2026-06-19

The canonical leaderboard sources are:

- **claw-bench.com/leaderboard** [2]: V1 (Hermes) snapshot dated **2026-05-20**; V2 (Hermes) snapshot from the same date. Latest changelog entry: `2026.05.20 — V2 default + lenient judge + 6 harnesses` [2]. No news entry, no new model row, and no snapshot refresh appears after this date.
- **HuggingFace TIGER-Lab/ClawBench dataset page** [3]: "What's New" latest entry is `[2026.05.12]` [3]. The leaderboard section references `results.csv` but no new V1 rows have been added since the May 2026 snapshot.
- **HuggingFace NAIL-Group/ClawBench**: Same May 2026 "What's New" entries; V2 snapshot "refreshed 2026-05-12" [3].
- **GitHub TIGER-AI-Lab/ClawBench**: Latest changelog entry is `2026.05.20` across all indexed commits and branches.
- **clawbench-eval PyPI**: Latest version `v0.6.0` (and incremental releases up through late May 2026); no June 2026 release.
- **HF Spaces leaderboard** (TIGER-Lab/ClawBench, NAIL-Group/clawbench-leaderboard): Content could not be fetched (dynamic Gradio app); however, these Spaces pull from the same `results.csv` and changelog, which show no June updates.

**No source associated with the benchmark authors shows any update, new model submission, or new score after 2026-05-20.**

### V1 (Hermes) Leaderboard — Original V1 Corpus, Different Judge Methodology

The claw-bench.com V1 (Hermes) section lists 6 models evaluated on the **original V1 corpus (153 tasks)**, but scored via a **different two-stage methodology** than the paper's Agentic Evaluator: Stage 1 (Intercepted) deterministically checks whether the final HTTP request matched the task's URL/method; Stage 2 (Reward) adds an LLM judge (`deepseek/deepseek-v4-pro`) under a lenient rubric [2]. The page was re-fetched on 2026-06-28; it remains unchanged — snapshot still dated **2026-05-20**, latest changelog entry still **2026.05.20**, no silent post-2026-06-19 updates.

| Model | Intercepted | Reward (lenient) | Pass/Total | In existing tracked rows? |
|-------|------------|-------------------|------------|--------------------------|
| claude-opus-4-6 | 61.4% | 61.4% | 94/153 | **No — new model** |
| claude-sonnet-4-6 | 56.9% | 56.9% | 87/153 | Yes (33.3% SR, different metric) |
| claude-haiku-4-5-20251001 | 30.1% | 30.1% | 46/153 | Yes (18.3% SR, different metric) |
| gpt-5.4-2026-03-05 | 25.5% | 25.5% | 39/153 | Yes (6.5% SR, different metric) |
| gpt-5.4-mini-2026-03-17 | 24.8% | 24.8% | 38/153 | **No — new model** |
| kimi-k2.5 | 17.6% | 17.6% | 27/153 | Yes (0.7% SR, different metric) |

Two models — **claude-opus-4-6** and **gpt-5.4-mini** — are absent from the existing 7 tracked rows entirely. Their scores represent absolute performance on the original V1 corpus. However, they are **not directly comparable** to the paper's Agentic Evaluator SR: the two-stage Intercepted + LLM-judge scheme is a substantially different judge, and the leaderboard itself reports different numbers for models that overlap (e.g., gpt-5.4 shows 25.5% here vs. 6.5% SR in the paper; sonnet-4-6 shows 56.9% here vs. 33.3% SR). Per the breadth-first directive, these are surfaced as low-confidence candidates below, not silently excluded.

### GitHub Issue #129 — Incomplete Eval Plan, No Results

GitHub issue #129 ("EVAL: 3 harnesses × 2 corpora × 8 models — due 2026-05-16") is a planning issue opened May 8, 2026 by `reacher-z` to run a 48-cell evaluation sweep across 3 harnesses (OpenClaw, HermesAgent, Claude Code) × 2 corpora (V1 original + V2) × 8 models (GPT-5.5, Claude Opus 4.7, Gemini 3.1 M2.7, Kimi K2.6, GLM 5.1, DeepSeek V4 Flash, DeepSeek V4 Pro) [4]. As of 2026-06-28, **all 48 run-matrix checkboxes remain unchecked** — no results, no linked PRs, no comments, no development branches. The issue contains no V1 original-benchmark scores and no post-2026-06-19 activity.

### V2 Corpus — Variant, Not Original

The V2 (Hermes) section lists 8 models on **130 different tasks** [2]. V2 is explicitly a separate corpus ("V2 — 130 newer tasks, expanded coverage" [3]). Any V2 scores would be variant rows (`isVariant=true`, `variantName="V2"`), not original-benchmark scores. They are also dated 2026-05-12/2026-05-20, outside the lookback window.

### Vendor Blogs and Model Cards — No ClawBench References

- **Anthropic Claude Opus 4.8** (published 2026-05-28) [5]: Reports Terminal-Bench 2.1, OSWorld-Verified, and Finance Agent v2 scores but **does not mention ClawBench at all**.
- **Z.AI GLM-5 blog** (z.ai/blog/glm-5): References internal benchmarks (Humanity's Last Exam, AIME, etc.) but the ClawBench score for GLM-5 comes from the benchmark paper, not a vendor self-report.
- No HuggingFace model card for any system was found reporting a new ClawBench V1 score in this window.

### Recent arXiv Preprints — All Are Different Benchmarks (Name Collisions or Variants)

Multiple June 2026 arXiv papers use "Claw" in their names but are **distinct benchmarks**, not the original ClawBench:

| Paper | Benchmark | Relation to Original ClawBench |
|-------|-----------|-------------------------------|
| arXiv:2606.23654 | EnterpriseClawBench | Enterprise agent benchmark; separate benchmark |
| arXiv:2606.03889 | RealClawBench | OpenClaw developer-session benchmark; references original ClawBench as a comparison row but does not report new original scores |
| arXiv:2606.12344 | Claw-SWE-Bench | SWE-bench adapter for agent harnesses; separate |
| arXiv:2606.18356 | SafeClawBench | Safety/tool-use benchmark; separate |
| arXiv:2605.10912 | WildClawBench | Long-horizon agent benchmark; separate |
| arXiv:2604.05172 | ClawsBench (note: "Claws") | Productivity agent benchmark with mock services; separate |

None of these report a new absolute score on the **original ClawBench V1** benchmark. They are either entirely separate benchmarks or cite the original ClawBench's existing published scores for comparison.

### Name Collision Sites — Excluded

Three sites use "ClawBench" branding but are **completely different products**:
- **clawbench.net** / benchmarklist.com's "Claw Bench" [6]: A coding/agent competition platform with "Claw Score" and speed metrics; no relationship to the TIGER-AI-Lab web-agent benchmark.
- **clawbenchlabs.com**: An independent LLM benchmark with "CLAW SCORE" (GLM-5-Turbo 93.9, etc.); different methodology and scope entirely.
- **openclaw/clawbench** (GitHub): A separate reproducibility benchmark with 19 tasks; last push 2026-06-22 but uses a different task set and methodology.

These are omitted as name collisions per the hard rules.

---

## Conclusion

The original ClawBench V1 corpus (153 tasks) has received **no new score reports in the 2026-06-19 to 2026-06-28 window** from any source — all leaderboard snapshots, dataset pages, vendor blogs, and preprints either predate the window or report on different benchmarks. However, two models on the V1 (Hermes) leaderboard — **claude-opus-4-6** and **gpt-5.4-mini** — are not in the existing 7 tracked rows and do report absolute scores on the original 153-task corpus, albeit under a different judge methodology. These are surfaced as low-confidence, variant-metric candidates rather than silently excluded.

---

## Candidate Entries

### Candidate 1: claude-opus-4-6

| Field | Value |
|-------|-------|
| Model | claude-opus-4-6 |
| Score | 61.4% (94/153 Intercepted; 61.4% Reward lenient) |
| Metric | Intercepted = final HTTP request matched task URL/method (Stage 1, deterministic); Reward = deepseek/deepseek-v4-pro LLM judge, lenient rubric (Stage 2) |
| Corpus | Original V1 (153 tasks) |
| isVariant | Yes — different judge methodology from the paper's Agentic Evaluator SR; not directly comparable to existing tracked SR scores |
| variantName | V1 (Hermes) — two-stage HTTP interception + LLM judge |
| sourceTier | Official leaderboard (claw-bench.com) |
| sourceURL | https://claw-bench.com/leaderboard |
| sourceID | |
| publishedDate | Snapshot 2026-05-20 (pre-lookback) |
| quotedEvidence | "claude-opus-4-6 \| hermes \| 61.4% \| 61.4% \| — \| — \| 94 / 153" |
| setupNote | Score is on the original V1 corpus (153 tasks) but uses two-stage interception+LLM-judge scoring, not the Agentic Evaluator 5-layer SR from arXiv:2604.08523. The leaderboard describes its method: "Intercepted = final HTTP request matched the task's URL/method (Stage 1, deterministic). Reward (lenient) = additionally judged by deepseek/deepseek-v4-pro." Models that overlap with the paper show substantially different numbers under this judge (e.g., gpt-5.4: 25.5% here vs. 6.5% SR in paper). |

### Candidate 2: gpt-5.4-mini

| Field | Value |
|-------|-------|
| Model | gpt-5.4-mini (gpt-5.4-mini-2026-03-17) |
| Score | 24.8% (38/153 Intercepted; 24.8% Reward lenient) |
| Metric | Intercepted = final HTTP request matched task URL/method (Stage 1, deterministic); Reward = deepseek/deepseek-v4-pro LLM judge, lenient rubric (Stage 2) |
| Corpus | Original V1 (153 tasks) |
| isVariant | Yes — different judge methodology from the paper's Agentic Evaluator SR; not directly comparable to existing tracked SR scores |
| variantName | V1 (Hermes) — two-stage HTTP interception + LLM judge |
| sourceTier | Official leaderboard (claw-bench.com) |
| sourceURL | https://claw-bench.com/leaderboard |
| sourceID | |
| publishedDate | Snapshot 2026-05-20 (pre-lookback) |
| quotedEvidence | "gpt-5.4-mini-2026-03-17 \| hermes \| 24.8% \| 24.8% \| — \| — \| 38 / 153" |
| setupNote | Same caveat as claude-opus-4-6: original V1 corpus but two-stage interception+LLM-judge scoring, not the paper's Agentic Evaluator SR. |

## Sources

1. [ClawBench: Can AI Agents Complete Everyday Online Tasks?](https://arxiv.org/html/2604.08523v1)
2. [ClawBench Leaderboard — Browser Agents on Real Websites](https://claw-bench.com/leaderboard)
3. [NAIL-Group/ClawBench · Datasets at Hugging Face](https://huggingface.co/datasets/NAIL-Group/ClawBench)
4. [EVAL: 3 harnesses × 2 corpora × 8 models — due 2026-05-16 · Issue #129 · TIGER-AI-Lab/ClawBench](https://github.com/TIGER-AI-Lab/ClawBench/issues/129)
5. [Introducing Claude Opus 4.8](https://www.anthropic.com/research/claude-opus-4-8)
6. [Claw Bench Benchmark Scores & AI Model Leaderboard | BenchmarkList](https://benchmarklist.com/benchmarks/clawbench/)

## Online-Mind2Web (online-mind2web)

_0 candidate(s), ~$0.89, stop=tokens_

# Online-Mind2Web: New Absolute Scores Since 2026-06-19

## Bottom Line

**No new absolute Online-Mind2Web scores were found published since 2026-06-19** in any source retrieved. The three tracking leaderboards (steel.dev, HAL, osunlp HF) have not been updated since April 2026 or earlier. The lookback window is inclusive of the start date (≥ June 19, 2026); under this convention, Fara-1.5 — which reports 63.4% (9B) and 72.3% (27B) on Online-Mind2Web and was submitted to arXiv on **June 18, 2026** — falls one day **outside** the window. No vendor blog, model card, system card, or arXiv paper published June 19–28, 2026 reports a complete, absolute Online-Mind2Web score on the original benchmark.

## Candidates Evaluated and Disposition

| System | Score | Source | Published | In Window? | Disposition |
|---|---|---|---|---|---|
| Fara1.5-9B | 63.4% | arXiv:2606.20785 [1] | 2026-06-18 | ✗ (1 day early) | Below: borderline candidate |
| Fara1.5-27B | 72.3% | arXiv:2606.20785 [1] | 2026-06-18 | ✗ (1 day early) | Below: borderline candidate |
| WebChallenger (GLM-4-32B) | 51.0% | arXiv:2606.10423 [2] | 2026-06-09 | ✗ (10 days early) | Dropped — outside window |
| SuperBrowser | 89.47% | arXiv:2606.09399 [3] | 2026-06-08 | ✗ | Dropped — Mind2Web Hard (66 tasks), NOT Online-Mind2Web |
| OpenThoughts-Agent v2 | — | arXiv:2606.24855 [4] | 2026-06-25 | ✓ | Dropped — benchmarks are SWE-Bench, Terminal-Bench, coding tasks; Online-Mind2Web not evaluated |
| HANSEL | — | arXiv:2606.18671 [5] | 2026-06-17 | ✗ | Dropped — no OM2W success-rate score; uses 45 OM2W tasks only for evidence-retrieval eval |
| Claude Opus 4.8 | 84% | anthropic.com [6] | 2026-05-28 | ✗ | Dropped — outside window (May 28); score verifiable in fetched page |

## Borderline Candidates (Outside Strict Window by ≤1 Day)

### Fara1.5-9B — 63.4% on Online-Mind2Web

- **System:** Fara1.5-9B (native CUA built on Qwen3.5-9B)
- **Reporting org:** Google DeepMind (authors: Awadallah, Gupta, Rajeswaran et al.)
- **Score:** 63.4% (scoreDisplay: "63.4%", scoreValue: 63.4)
- **Source URL:** https://arxiv.org/abs/2606.20785 [1]
- **Publication date:** 2026-06-18 (Submitted on 18 Jun 2026, v1)
- **Setup note:** SFT on FaraGen1.5 data pipeline (live websites + synthetic environments, GPT-5.4 solver harness, triple verifier)
- **isSelfReported:** true (vendor == reporting org)
- **isVariant:** false
- **quotedEvidence:** "Fara1.5-9B reaches 63.4% on Online-Mind2Web and 86.6% on WebVoyager" [1]
- **sourceTier:** arXiv preprint (peer review status: preprint)
- **coverageNote:** Submitted June 18, 2026 — one day before the 2026-06-19 lookback start. Whether this qualifies depends on boundary inclusivity. The score is absolute, complete, and on the original benchmark.

### Fara1.5-27B — 72.3% on Online-Mind2Web

- **System:** Fara1.5-27B (native CUA built on Qwen3.5-27B)
- **Reporting org:** Google DeepMind
- **Score:** 72.3% (scoreDisplay: "72.3%", scoreValue: 72.3)
- **Source URL:** https://arxiv.org/abs/2606.20785 [1]
- **Publication date:** 2026-06-18
- **Setup note:** Same FaraGen1.5 SFT pipeline as 9B; described as "competitive with much larger proprietary systems"
- **isSelfReported:** true
- **isVariant:** false
- **quotedEvidence:** "Fara1.5-27B achieves 72.3% on Online-Mind2Web, which is competitive with much larger proprietary systems" [1]
- **sourceTier:** arXiv preprint
- **coverageNote:** Same date boundary issue as 9B variant.

## Sources Checked and Exhausted

### Leaderboards (no new entries)

- **Steel.dev Online-Mind2Web leaderboard:** Last updated **2026-04-16**. All 22 entries already tracked. No entries added since April 2026. [7]
- **HAL Online-Mind2Web leaderboard (Princeton):** Explicitly paused — "We have paused updating HAL leaderboard with new models." Top entry: GPT-5 Medium at 42.33% (Aug 2025). [8]
- **Official osunlp HF Leaderboard:** Entries from 2025–early 2026. No new submissions visible in the current dataset. [9]

### arXiv Papers With OM2W Mentions (no qualifying score)

- **WebChallenger** (2606.10423, Jun 9): Reports **51.0% on Online-Mind2Web** using GLM-4-32B + Qwen2.5-VL-7B with human evaluation. Verbatim: "our system achieves 56.3% on WebArena, 48.7% on VisualWebArena, 51.0% on Online-Mind2Web, and 70.9% on WorkArena" [2]. Outside window (June 9 < June 19). Not previously tracked.
- **OpenWebRL** (2606.02031, submitted Jun 1, revised Jun 4): The truncated snippet was resolved. The paper reports a complete absolute score: "OpenWebRL-4B achieves **67.0% success on Online-Mind2Web** and 64.0% on DeepShop" [10]. However, submission date of June 1 is well before the June 19 window — outside. Not previously tracked.
- **Process-Level Evaluation** (2606.15673, Apr 8): Lists Online-Mind2Web as a benchmark in a comparison table but does not report an absolute OM2W success rate.
- **MACU: Multi-Agent Computer Use** (2606.01533): No OM2W score in abstract; full text not fetched.
- **"Are Online Skill and Memory Modules Always Worth Their Tokens"** (2606.15017): Mentions OM2W in related work; no absolute score reported in accessible text.

### Vendor Blogs and Model Cards

- **Anthropic Claude Opus 4.8** (anthropic.com, May 28): The fetched launch page contains: "Claude Opus 4.8 is the strongest computer-use and browser-agent model we've tested, scoring 84% on Online-Mind2Web" [6]. Published May 28, 2026 — outside the lookback window (May 28 < June 19). Not previously tracked on the steel.dev leaderboard.
- **OpenThoughts-Agent v2** (arXiv:2606.24855, Jun 25): Within window, but its 7 benchmarks are SWE-Bench Verified (54.0%), Terminal-Bench 2.0 (26.2%), Aider-Polyglot (32.4%), BFCL, and other coding/terminal tasks. **Online-Mind2Web is not evaluated.** [4]

### Name Collisions and Off-Topic Results

- **Mind2Web 2** (osu-nlp-group): A separate benchmark for agentic search with Agent-as-a-Judge — not Online-Mind2Web. Omitted.
- **Mind2Web Hard** (66-task subset from original Mind2Web): SuperBrowser reports 89.47% here [3], but this is the original static Mind2Web Hard split, not the 300-task Online-Mind2Web live benchmark. Omitted.
- **MolmoWeb** (2604.08516, submitted Apr 9): Reports Online-Mind2Web pass@1 = 35.3% and pass@4 = 60.5% (MolmoWeb-8B): "achieving 94.7% and 60.5% pass@4 (compared to 78.2% and 35.3% pass@1) on WebVoyager and Online-Mind2Web respectively" [11]. April 2026 — well outside the June 19 window. Exhausted.

## Methodology Notes

- The lookback window is defined as **since 2026-06-19**, inclusive of the start date (i.e., dates ≥ June 19, 2026 qualify). Under this convention, the Fara-1.5 arXiv submission of **June 18, 2026 falls one day outside the window** and is categorically excluded from the strict window — though it remains the most recent new candidate if a boundary convention shift of one day were applied.
- "Original Online-Mind2Web" means the 300-task, 136-website live-web benchmark introduced by Xue et al. (2025), not Mind2Web Hard, Mind2Web 2, or any variant.
- Primary metric is task success rate stratified across Easy (1–5 human steps), Medium (6–10), and Hard (11+).
- Judge methodology varies across tracked entries (human eval, WebJudge, custom agentic judges); cross-system comparison requires attention to the evaluator, as noted on the steel.dev leaderboard: "human eval, WebJudge, and custom agentic judges can produce different scores for the same agent" [7].

## Verdict

The window 2026-06-19 through 2026-06-28 yielded **zero new absolute Online-Mind2Web scores** from any fetched primary source. The Fara-1.5 scores (63.4% / 72.3%) are the most recent new scores found, but their June 18 arXiv submission date places them one day outside the strict window boundary. Under the ≥ June 19 convention, they are excluded.

- emergentmind.com Online-Mind2Web topic page: Last updated January 14, 2026. Only references the original Xue et al. 2025 paper (arXiv:2504.01382). All scores shown are from the original benchmark paper (SeeAct 30.7%, Browser Use 30.0%, Agent-E 28.0%, Claude Computer Use 29.0%, OpenAI Operator 61.3%). No new scores since June 19, 2026. No new candidates.

## Sources

1. [Fara-1.5: Scalable Learning Environments for Computer Use Agents](https://arxiv.org/abs/2606.20785)
2. [WebChallenger: A Reliable and Efficient Generalist Web Agent](https://arxiv.org/abs/2606.10423)
3. [RunAgent SuperBrowser: A Theory of Autonomous Web Navigation Grounded in Human Browsing Behaviour](https://arxiv.org/html/2606.09399v1)
4. [Data Recipes for Agentic Models](https://arxiv.org/html/2606.24855v1)
5. [HANSEL: Extracting Breadcrumbs from Web Agent Trajectories for Interactive Verification](https://arxiv.org/abs/2606.18671)
6. [Introducing Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8)
7. [Online-Mind2Web Leaderboard 2026: Latest Live Web Agent Scores | Steel.dev](https://leaderboard.steel.dev/leaderboards/online-mind2web/)
8. [HAL: Online Mind2Web Leaderboard](https://hal.cs.princeton.edu/online_mind2web)
9. [human_Mind2Web-Online - Leaderboard_data.csv](https://huggingface.co/spaces/osunlp/Online_Mind2Web_Leaderboard/raw/main/human_Mind2Web-Online%20-%20Leaderboard_data.csv)
10. [OpenWebRL: Demystifying Online Multi-turn Reinforcement Learning for Visual Web Agents](https://arxiv.org/abs/2606.02031)
11. [MolmoWeb: Open Visual Web Agent and Open Data for the Open Web](https://arxiv.org/abs/2604.08516v1)

## τ-bench (tau-bench)

_0 candidate(s), ~$0.70, stop=tokens_

# τ-bench (Original) Absolute Scores: Sweep Results, 2026-06-19 Onward

## Bottom Line

**No qualifying new absolute scores on the original τ-bench benchmark were found in the lookback window (2026-06-19 onward).** The two arXiv papers flagged as leads both use original τ-bench data but report proxy metrics (retrieval recall, policy-classification F1, judge-agreement rates) rather than agent task-completion pass rates. The official leaderboard infrastructure is either inaccessible or stale. No vendor blog, HuggingFace model card, or system-card PDF published in this window reports an original τ-bench absolute score for a system not already tracked.

---

## Source-by-Source Findings

### 1. Official Leaderboard / Index Pages

| Source | Status | Finding |
|--------|--------|---------|
| github.com/sierra-research/tau-bench [1] | Fetched | Displays a deprecation warning: "The tasks in this repo are not updated." Redirects users to τ²-bench / τ³-bench. Contains **no leaderboard data**. |
| taubench.com [2] | Fetched | Page loads as a JavaScript-rendered shell ("Loading leaderboard…") with no leaderboard entries, scores, or dates present in the static HTML. Links to sierra-research/tau2-bench and highlights new features (τ³-bench, τ-knowledge, τ-voice, banking domain). No absolute scores recoverable from this fetch. |
| leaderboard.steel.dev (mirror) [3] | Fetched | Last updated **April 16, 2026** — before the June 19 window. Shows only the 12 existing tracked systems. No new entries. |

**No new entries on any official or mirror leaderboard since June 19.**

### 1b. llm-stats.com — Generic τ-bench Page [4]

llm-stats.com's generic τ-bench page (covering retail+airline combined, not a separate airline-domain leaderboard) was last updated **June 28, 2026** — within the lookback window. It lists 6 models, all marked self-reported with **0 verified**:

| Model | Score |
|-------|-------|
| Step-3.5-Flash | 0.882 |
| GLM-4.7 | 0.874 |
| MiMo-V2-Flash | 0.803 |
| GLM-4.7-Flash | 0.795 |
| MiniMax M2 | 0.772 |
| o3 | 0.630 |

All six are already-tracked systems; no new system outside the existing list appears. Despite falling within the lookback window, these rows yield no qualifying new scores because every entry is unverified (self-reported) and represents a system already tracked.

### 2. arXiv: 2606.23937 — "When Retrieval Metrics Mislead: Measuring Policy Signal in Long-Horizon Tool-Use Agents" (AWS, 2026-06-22) [5]

**No absolute τ-bench scores.** This paper uses original τ-bench airline and retail task states as data for measuring retrieval recall and policy-signal identification. It reports classification metrics — macro-F1 values ranging from 0.21 (no-policy control) to 0.60 (structured gate input at 3B scale) for policy-gate classifiers — not agent task-completion pass@1 rates. The paper explicitly frames its contribution as showing that "exact-match clause recall can underestimate downstream policy utility," not as benchmarking agent performance. The original τ-bench benchmark data is used as input to a proxy/classification metric, not evaluated with the standard DB-state-matching pass-rate metric.

### 3. arXiv: 2606.21627 — "Counsel: A Meta-Evaluation Dataset for Agentic Tasks" (Atla AI / Cohere / Mistral / Google DeepMind, 2026-06-19) [6]

**No absolute τ-bench scores.** This paper uses the original τ-bench retail subset (115 tasks) to generate agent trajectories with two agent backends: GPT-OSS-20B (with reasoning) and Qwen3-235B-A22B-Instruct-2507 (no reasoning). However, the paper's objective is to build a meta-evaluation dataset for LLM-as-a-Judge (LLMJ) systems. It reports **judge-quality metrics** — e.g., Qwen3's critique precision is 43% on DA-Code and 63% on τ-bench retail, and the strongest judge achieves ~88% human agreement on error location and ~65% on reasoning quality — not agent pass@1 success rates. No absolute task-completion scores for any system on original τ-bench are reported.

### 4. HuggingFace Model Cards

No HuggingFace model cards published or updated since June 19, 2026, were found that report original τ-bench results. HuggingFace search returned only: (a) τ²-bench and τ³-bench trajectory datasets (variants), (b) synthetic training-data datasets built from τ-bench templates, and (c) the original τ-bench paper page (2406.12045). None contained new absolute scores on the original benchmark.

### 5. Vendor / Research Blogs

All Anthropic product announcements fall outside the lookback window:
- **Claude Fable 5 / Mythos 5**: Announced June 9, 2026 [7] — before the June 19 window.
- **Claude Sonnet 4.6**: Announced February 17, 2026 [8].
- **Claude Opus 4.6**: Announced February 5, 2026 [9].

None of these blog posts mention τ-bench (original) scores. Searches for openai.com, deepmind.google, deepseek.com, qwenlm.github.io, kimi.com/blog, minimax.io, and z.ai/blog within the window returned no new τ-bench original scores.

### 6. System-Card / Evaluation PDFs

The **Claude Sonnet 4.6 System Card** (PDF, February 17, 2026, updated March 6, 2026) [10] contains a section **2.5 τ²-bench** that reports scores on **τ²-bench** — the successor/variant benchmark from Sierra, not the original τ-bench:

| System | τ²-bench Telecom | τ²-bench Retail |
|--------|-------------------|-----------------|
| Claude Sonnet 4.6 | 97.9% | 91.7% |

These are explicitly labeled "τ2-bench" in the system card and are classified as variant scores (isVariant=true, variantName="τ²-bench"). The system card does **not** report any original τ-bench scores.

The **OpenAI gpt-oss model card** (oai_gpt-oss_model_card.pdf, dated **August 5, 2025**) [11] contains a "Tau-Bench Retail (Function Calling)" section with absolute scores in Table 3: gpt-oss-120b scores 49.4 / 62.0 / 67.8 (low / medium / high reasoning) and gpt-oss-20b scores 35.0 / 47.3 / 54.8 on Tau-Bench Retail, plus Tau-Bench Airline scores (120b: 42.6 / 48.6 / 49.2; 20b: 32.0 / 42.6 / 38.0). Because the card's publication date (August 2025) predates the June 19, 2026 lookback window, these scores are **omitted** from candidate consideration per the recency criterion.

No other system-card or evaluation PDFs released since June 19 were found containing original τ-bench results.

### 7. BenchLM Aggregator (benchlm.ai/benchmarks/tauBench) [12]

BenchLM lists 38 models with τ-bench scores, with a snapshot dated **June 18, 2026** — one day before the lookback window opens. Critically, BenchLM explicitly states these scores are "display-only reference" rows where "exact-source verification records for these rows are still being attached" and "until exact-source attachments are completed they should not be treated as fully verified public benchmark rows." All model links point to the generic taubench.com homepage rather than to primary sources. The scores shown (e.g., Claude Mythos 5: 89.2%, Claude Sonnet 4.6: 87.5%) have **no verifiable primary-source backing** and the snapshot predates the window. These are **omitted** as they fail the hard rule requiring every scoreValue to be backed by quotedEvidence at a fetched primary sourceUrl.

Additionally, several scores on BenchLM diverge substantially from the existing tracked leaderboard (e.g., Step-3.5-Flash shows 76.2% on BenchLM vs. 88.2% in the tracked list), indicating different aggregation methodology rather than a comparable metric.

### 8. LLMDB Aggregator (llmdb.com/benchmarks/tau-bench) [13]

LLMDB lists 9 model rows with a "Top Score: 90.7" (Gemini 3 Pro). All listed "Released" dates predate the June 19, 2026 window — the most recent entry is Nemotron 3 Nano at 2025-12-15, followed by Gemini 3 Pro at 2025-11-18. No model row has a release or update date on or after 2026-06-19. The listed scores (Gemini 3 Pro: 90.7, Claude 3.7 Sonnet: 81.2, Kimi K2: 74.3, o3: 73.9, o4-mini: 71.8, GPT-OSS-120B: 67.8, GPT-OSS-20B: 54.8, Claude 3.5 Haiku: 51, Nemotron 3 Nano: 49) represent systems already tracked or predate the window. No qualifying new scores found.

---

## Candidate Summary Table

| System | Score | Source | Status | Reason |
|--------|-------|--------|--------|--------|
| (none) | — | — | — | No qualifying candidates found |

**Zero new, citable, absolute scores on the original τ-bench benchmark were identified in the 2026-06-19 onward lookback window across official leaderboards, arXiv full texts, vendor blogs, HuggingFace cards, and system-card PDFs.**

---

## Coverage Note

No vendor blogs from openai.com, deepmind.google, deepseek.com, qwenlm.github.io, kimi.com/blog, minimax.io, or z.ai/blog with τ-bench scores are in the store beyond the Anthropic blog posts already covered.

If that page has been updated since June 19 with new entries, those scores would not be captured here. All other source categories — the GitHub repo, steel.dev mirror, both arXiv papers (full text), three Anthropic blog posts, one system-card PDF (135 pages), HuggingFace search, and vendor-blog search — were fetched and searched exhaustively.

## Sources

1. [When Retrieval Metrics Mislead: Measuring Policy Signal in Long-Horizon Tool-Use Agents](https://arxiv.org/abs/2606.23937)
2. [τ-bench](https://taubench.com)
3. [tau-bench Leaderboard 2026: Latest Tool Use Agent Scores | Steel.dev](https://leaderboard.steel.dev/leaderboards/tau-bench/)
4. [Tau-bench Leaderboard](https://llm-stats.com/benchmarks/tau-bench)
5. [2606.23937](https://arxiv.org/pdf/2606.23937)
6. [2606.21627](https://arxiv.org/pdf/2606.21627)
7. [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
8. [Introducing Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6)
9. [Claude Opus 4.6](https://www.anthropic.com/research/claude-opus-4-6)
10. [bbd8ef16d70b7a1665f14f306ee88b53f686aa75.pdf](https://www-cdn.anthropic.com/bbd8ef16d70b7a1665f14f306ee88b53f686aa75.pdf)
11. [oai_gpt-oss_model_card.pdf](https://cdn.openai.com/pdf/419b6906-9da6-406c-a19d-1bb078ac7637/oai_gpt-oss_model_card.pdf)
12. [TAU-bench Benchmark 2026: 38 tracked score rows](https://benchlm.ai/benchmarks/tauBench)
13. [TAU-bench - LLM Benchmark](https://llmdb.com/benchmarks/tau-bench)

## AgentBench (agentbench)

_0 candidate(s), ~$0.75, stop=tokens_

# AgentBench — New Absolute Scores on the Original Benchmark (2026-06-19 to 2026-06-28)

## Bottom Line

**No new absolute scores on the ORIGINAL AgentBench benchmark were published in the 2026-06-19 to 2026-06-28 window.** Every source checked — the official THUDM GitHub repo and its linked Google Sheet leaderboard, third-party aggregators (BenchmarkList, Steel.dev), HuggingFace model cards, vendor blogs (openai.com, anthropic.com), and arXiv — either predates the window or reports approximate ("~") figures that fail the "absolute, complete, citable" standard. The official leaderboard was last materially updated months before the window, and the scores it contains are identical to those already tracked.

A critical structural finding also applies: the current official AgentBench leaderboard is for **AgentBench FC (Function Calling)**, a variant of the original benchmark, not the original itself.

---

## 1. Official Leaderboard Status

The AgentBench authors (THUDM, Tsinghua University) maintain an official leaderboard on a Google Sheet linked from the GitHub repo README [1]. The link is labeled "Leaderboard (new)" and resolves to the FC edition:

> `AgentBench [🌐 Leaderboard (new)](https://docs.google.com/spreadsheets/d/e/2PACX-1vRR3Wl7wsCgHpwUw1_eUXW_fptAPLL3FkhnW_rua0O1Ji_GIVrpTjY5LaKAhwO-WeARjnY_KNw0SYNJ/pubhtml)` [1]

**Recency of the official leaderboard:**

| Indicator | Date | Source |
|---|---|---|
| GitHub repo last push | 2026-02-08 | GitHub metadata |
| FC edition announcement | 2025-10-10 | GitHub README [1] |
| BenchmarkList last sampled | 2026-05-06 | |
| Steel.dev last updated | 2026-04-16 | |

All of these predate the 2026-06-19 window start. The Google Sheet itself could not be rendered by the fetcher (dynamic content), but the third-party aggregators that import directly from it (BenchmarkList sampled 2026-05-06; Steel.dev updated 2026-04-16) show the same scores already tracked — no new entries.

**Systems and scores on the official FC leaderboard (as of last sampling, all matching existing tracked rows):**

| Rank | System | AVG Pass@1 | Organization | Already Tracked? |
|---|---|---|---|---|
| 1 | AgentRL w/ Qwen2.5-32B-Instruct | 70.4% | Tsinghua | ✅ |
| 2 | AgentRL w/ Qwen2.5-14B-Instruct | 67.7% | Tsinghua | ✅ |
| 3 | AgentRL w/ GLM-4-9B-0414 | 65.0% | Tsinghua | ✅ |
| 4 | AgentRL w/ Qwen2.5-7B-Instruct | 62.0% | Tsinghua | ✅ |
| 5 | AgentRL w/ Qwen2.5-3B-Instruct | 60.0% | Tsinghua | ✅ |
| 6 | Claude Sonnet 4.5 | 58.9% | Anthropic | ✅ |
| 7 | Claude Sonnet 4.5 Thinking | 58.3% | Anthropic | ✅ |
| 8 | Claude Sonnet 4 Thinking | 58.2% | Anthropic | ✅ |
| 9 | Claude Sonnet 4 | 57.4% | Anthropic | ✅ |
| 10 | Claude Sonnet 3.7 | 53.2% | Anthropic | ✅ |
| 11 | GPT-5 (2025-08-07) | 52.2% | OpenAI | Not tracked (pre-window, not new) |
| 12 | AgentLM-70B | 51.4% | Tsinghua | Not tracked (pre-window) |
| 13 | Claude Sonnet 3.7 Thinking | 50.0% | Anthropic | Not tracked (pre-window) |
| 14 | DeepSeek-R1 (2025-05-28) | 49.3% | DeepSeek | Not tracked (pre-window) |

(24 models total in the BenchmarkList import; all sampled 2026-05-06 [2].)

**Verbatim evidence for the four "Not tracked" rows** (all from the BenchmarkList FC page,, imported from the official Google Sheet on 2026-05-06):

- **GPT-5 52.2%**: `| 11 | GPT-5 (2025-08-07) | [GPT-5](https://benchmarklist.com/models/openai-gpt-5/) openai-gpt-5 | 52.2% | 65.4% | 63.2% | 64.1% | 34.5% | 33.7% | [Imported](https://docs.google.com/spreadsheets/d/e/2PACX-1vRR3Wl7wsCgHpwUw1_eUXW_fptAPLL3FkhnW_rua0O1Ji_GIVrpTjY5LaKAhwO-WeARjnY_KNw0SYNJ/pubhtml) | 2026-05-06 |` [2]
- **AgentLM-70B 51.4%**: `| 12 | AgentLM-70B | UN AgentLM-70B agentlm-70b | 51.4% | 86% | 37.7% | 47% | 21.5% | 64.9% | [Imported](https://docs.google.com/spreadsheets/d/e/2PACX-1vRR3Wl7wsCgHpwUw1_eUXW_fptAPLL3FkhnW_rua0O1Ji_GIVrpTjY5LaKAhwO-WeARjnY_KNw0SYNJ/pubhtml) | 2026-05-06 |` [2]
- **Claude Sonnet 3.7 Thinking 50.0%**: `| 13 | Claude Sonnet 3.7 Thinking (2025-02-19) | [Claude 3.7 Sonnet (thinking)](https://benchmarklist.com/models/anthropic-claude-3.7-sonnet-thinking/) anthropic-claude-3.7-sonnet-thinking | 50% | 54.1% | 68.4% | 38.2% | 53.1% | 36% | [Imported](https://docs.google.com/spreadsheets/d/e/2PACX-1vRR3Wl7wsCgHpwUw1_eUXW_fptAPLL3FkhnW_rua0O1Ji_GIVrpTjY5LaKAhwO-WeARjnY_KNw0SYNJ/pubhtml) | 2026-05-06 |` [2]
- **DeepSeek-R1 49.3%**: `| 14 | DeepSeek-R1 (2025-05-28) | [R1 0528](https://benchmarklist.com/models/deepseek-deepseek-r1-0528/) deepseek-deepseek-r1-0528 | 49.3% | 51.4% | 60.4% | 50.2% | 53.6% | 31% | [Imported](https://docs.google.com/spreadsheets/d/e/2PACX-1vRR3Wl7wsCgHpwUw1_eUXW_fptAPLL3FkhnW_rua0O1Ji_GIVrpTjY5LaKAhwO-WeARjnY_KNw0SYNJ/pubhtml) | 2026-05-06 |` [2]

Each row's "[Imported](...)" link points to the same official Google Sheet (`2PACX-1vRR3Wl7wsCgH...`), confirming BenchmarkList imported these from the primary source.

---

## 2. Original Benchmark vs. Variant Distinction

**Verdict:** The original AgentBench (ICLR 2024, v0.1/v0.2) uses 8 environments with free-form text action modes: Operating System (OS), Database (DB), Knowledge Graph (KG), Digital Card Game (DCG), Lateral Thinking Puzzles (LTP), House-Holding (ALFWorld), Web Shopping (WebShop), and Web Browsing (Mind2Web) [1].

The current official leaderboard is for **AgentBench FC (Function Calling)**, introduced 2025-10-10, which is a **variant**:

- Uses function-calling style prompts instead of free-form text actions
- Integrated with the AgentRL framework
- Covers only 5 of the original 8 environments: ALFWorld, DBBench, KnowledgeGraph, OS Interaction, WebShop (dropping DCG, LTP, and Web Browsing)
- The original benchmark is only accessible by reverting to v0.1/v0.2 git tags [1]

The GitHub README states explicitly:

> "Comparing to the original AgentBench, this version uses a function-calling style prompt" [1]

Therefore, **every score currently on the official leaderboard is technically a variant score (AgentBench FC), not an original AgentBench score.** The already-tracked rows (AgentRL variants, Claude Sonnet family) are all FC scores. The original benchmark has not had a maintained leaderboard since the FC transition.

For any candidate scoring: FC leaderboard scores should be flagged as `isVariant=true`, `variantName="AgentBench FC (Function Calling)"`. No original-benchmark (8-environment, free-form action) leaderboard is currently maintained.

---

## 3. Sources Searched With No New Scores

### Vendor blogs (openai.com, anthropic.com, deepmind.google, ai.google.dev, etc.)
No vendor blog posts published on or after 2026-06-19 cite an absolute original-AgentBench number. The GPT-5.6 Sol announcement page (openai.com/index/previewing-gpt-5-6-sol/, published ~2026-06-26) contains **zero mentions of AgentBench** in its text [3]. No Anthropic, DeepMind, Google AI, Zhipu (z.ai), DeepSeek, Qwen, Kimi, or MiniMax blog posts in the window report AgentBench scores.

### HuggingFace model cards
The only HuggingFace results related to AgentBench are individual-environment LoRA adapters (e.g., `melon1891/agentbench-qwen3-4b-alf-*` trained on ALFWorld and DBBench only), not full AgentBench aggregate scores [HuggingFace search results]. These do not report overall AgentBench scores and are not relevant candidates.

### System cards and evaluation PDFs
None found in the window reporting original AgentBench scores.

### arXiv papers
No arXiv papers posted or revised on or after 2026-06-19 report an absolute original-AgentBench score. The arXiv paper "Benchmark Test-Time Scaling of General LLM Agents" (arXiv:2602.18998) uses a composite called "General AgentBench" which aggregates scores across BrowseComp, SWE-bench Verified, Terminal-Bench, etc. — a different benchmark entirely, not the original AgentBench.

### Third-party aggregator sites
- **Presenc AI** (presenc.ai/research/agentic-benchmark-leaderboard-june-2026, "Last updated: June 2026"): Lists an AgentBench column with tilde-approximate scores for 10 models: GPT-5.6 Pro (~78%), Claude Mythos 5 (~80%), Claude Opus 4.7 (~76%), Gemini 3.2 Pro (~73%), GPT-5.6 (~70%), DeepSeek V4.1 Pro (~65%), Claude Sonnet 4.6 (~62%), Qwen 3.7 (~58%), GLM-6 (~52%), Llama 4.5 Maverick (~46%). The methodology states: *"Scores compiled from vendor disclosures and the public leaderboards for WebArena, OSWorld, AgentBench, and TerminalBench. Agentic benchmark evaluation is highly sensitive to scaffolding choices; numbers should be treated as directional. Updated monthly."* [4].

 **Classification: low-confidence indicative-range candidates (not tracked as absolute scores).** Per the instruction to return candidates even when low-confidence (breadth matters; a downstream judge decides), these are presented here as **indicative-range candidates** with the following flags rather than discarded outright:

 | Model | AgentBench (~) | isVariant | coverageNote |
 |---|---|---|---|
 | Claude Mythos 5 | ~80% | true (edition uncertain) | Directional approximation from composite aggregator; no primary source; benchmark edition unspecified |
 | GPT-5.6 Pro | ~78% | true | Directional; composite aggregator; no vendor confirmation |
 | Claude Opus 4.7 | ~76% | true | Directional; composite aggregator |
 | Gemini 3.2 Pro | ~73% | true | Directional; composite aggregator |
 | GPT-5.6 | ~70% | true | Directional; composite aggregator |
 | DeepSeek V4.1 Pro | ~65% | true | Directional; composite aggregator |
 | Claude Sonnet 4.6 | ~62% | true | Directional; composite aggregator |
 | Qwen 3.7 | ~58% | true | Directional; composite aggregator |
 | GLM-6 | ~52% | true | Directional; composite aggregator |
 | Llama 4.5 Maverick | ~46% | true | Directional; composite aggregator |

 These survive the low-confidence bar (they are explicitly AgentBench-attributed, dated June 2026, and named-model) but fail the absolute-score bar on three grounds: (1) all values are tilde approximations, not exact numbers; (2) the source itself disclaims precision ("numbers should be treated as directional"); (3) the benchmark edition (original vs. FC) is unspecified. They are returned for downstream judgment, not as confirmed scores.

- **RapidClaw** (rapidclaw.dev/blog/agentbench-leaderboard-2026): Published **May 6, 2026** (before the window). Reports Claude Opus 4.7 at "~73% overall", GPT-5.3 Codex at "~70%", Claude Opus 4.6 at "~68%". All approximate; outside the time window [5].

- **AgentWiki** (agentwiki.org): Lists a generic "Benchmark Leaderboard" with Claude Opus 4.5 at 80.9%, MiniMax M2.5 at 80.2%, etc., but does not specify which benchmark edition these scores belong to, and the page has no clear date attribution for individual scores.

---

## 4. New Scores Found: None

**No candidate scores meet all the required criteria** (absolute number, from a fetched source, published 2026-06-19 to 2026-06-28, on the original AgentBench benchmark). The candidates that surfaced either:

1. **Use approximate values** (Presenc AI ~78%, RapidClaw ~73%) — fail the "absolute, complete" standard
2. **Predate the window** (RapidClaw May 6; BenchmarkList sampled May 6; Steel.dev April 16)
3. **Are variant scores** (all FC leaderboard entries — AgentBench FC is a variant)
4. **Don't mention AgentBench at all** (GPT-5.6 Sol announcement)
5. **Report single-environment subscores** (HuggingFace LoRA adapters), not the overall benchmark

---

## 5. Already-Tracked Systems: No New Scores

None of the already-tracked systems (AgentRL w/ Qwen2.5-32B/14B/7B/3B-Instruct, AgentRL w/ GLM-4-9B-0414, Claude Sonnet 4.5/4.5-Thinking/4-Thinking/4/3.7) have a new, different AgentBench score published in the 2026-06-19 to 2026-06-28 window. The official leaderboard scores for these systems are unchanged from the values already tracked.

## Sources

1. [GitHub - THUDM/AgentBench: A Comprehensive Benchmark to Evaluate LLMs as Agents (ICLR'24)](https://github.com/THUDM/AgentBench)
2. [AgentBench FC Benchmark Scores & AI Model Leaderboard | BenchmarkList](https://benchmarklist.com/benchmarks/agentbench_fc/)
3. [Previewing GPT-5.6 Sol: a next-generation model](https://openai.com/index/previewing-gpt-5-6-sol/)
4. [Agentic Benchmark Leaderboard June 2026 | Presenc AI](https://presenc.ai/research/agentic-benchmark-leaderboard-june-2026)
5. [AgentBench Leaderboard [2026 Methodology]](https://rapidclaw.dev/blog/agentbench-leaderboard-2026)

