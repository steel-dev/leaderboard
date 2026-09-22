---
name: benchmark-discovery
description: Surface new benchmark result candidates for the Steel leaderboard repo by running the arxiv discovery pipeline, filtering out off-topic and unscorable papers (e.g. ESA Gaia space-telescope hits vs the GAIA agent benchmark), and producing a standardised review-ready markdown summary with sections for proposed additions, variant candidates, and methodology notes — optionally posted to the rolling discovery issue on GitHub. Use this skill whenever the user mentions "discovery", "discovery sweep", "check arxiv", "survey new benchmark results", "find new leaderboard candidates", "what's new on the leaderboards", "any new agents on BrowseComp/GAIA/SWE-bench/WebVoyager", "see what's been published this week", "anyone reporting new scores", or any variation that involves scanning recent papers for fresh agent or model scores to potentially add to the leaderboard. Always trigger this skill before running an ad-hoc arxiv search by hand — the skill already knows the project's schema, dedupe rules, known false-positive patterns, the standardised comment format that the rolling discovery issue expects, and which evidence is too thin to surface to a maintainer.
---

# Benchmark discovery for the Steel leaderboard

Surface candidate benchmark results for maintainer review. The skill drives the deterministic arxiv discovery script in this repo, applies project-specific filtering rules, and renders a standardised markdown summary that a maintainer can scan and selectively add to `src/data/<slug>.json`.

This skill never modifies leaderboard data on its own. The output is review material; merging is always a human step. The discovery issue exists so candidates accumulate in one inbox rather than getting lost across notebooks and tabs.

## Automated weekly sweep (Atlas research → deductive judge → deterministic PR)

A scheduled GitHub Actions pipeline runs this discovery loop weekly so a maintainer doesn't have to. It is **Propose-Dispose**: the LLM stages only *propose* — they have no tools and never touch git — and a *deterministic* apply step validates, re-ranks, and opens the PR a human merges. The workflows live in `.github/workflows/`:

- **`discovery-scheduler.yml`** — cron (Mondays ~07:27 UTC) that dispatches the sweep via `gh workflow run` with `since_days=9` (weekly + 2-day margin). Kill-switch: set repo variable `ENABLE_DISCOVERY=false` to pause without editing YAML.
- **`discover-results.yml`** — the sweep itself, four jobs:
  1. `arxiv-baseline` — free, deterministic `pnpm run discover` → `.discovery/run.json` (§1 below).
  2. `discover` — **read-only**. `pnpm run discover:research` (the **Atlas** driver at `src/scripts/discover-research.ts`: Exa search + Steel browser fetch, z.ai `glm-5.2`) produces cited, structured candidates in **`.discovery/atlas-candidates.json`** (plus `atlas-report.md`, `atlas-trace.jsonl`, `atlas-errors.json`). Then `pnpm run discover:judge` — a **deductive `generateObject` pass** at `src/scripts/discover-judge.ts`, with **no tools and no fetches** — reads the candidates + the FULL current leaderboard rows + `CONTRIBUTING.md` and emits one declarative **proposal** per benchmark to `.discovery/proposals/<dataKey>-<week>.json` (adds + dismissals, each with a reason and a category).
  3. `apply` — the ONLY job with `contents:write` + `pull-requests:write`. `pnpm run discover:apply --write` (deterministic TypeScript at `src/scripts/discover-apply.ts`, **no LLM**) hard-gates each add (`src/data/schema.json`, finite score, dedup, freshness), does a soft SSRF-guarded evidence re-fetch, **stably re-ranks** (existing rows keep their order; new rows slot in by score), writes `src/data/<dataKey>.json` + `README.md`, runs `update-readme`/`lint`/`build`, and opens **one PR per leaderboard** with per-row reasoning for every add AND dismissal.
  4. `notify` — on success posts PR links (or "no fresh results") to the rolling issue; on any failure — including a *silent* gate/build failure where survivors were proposed but no PR opened — it opens a **`discovery-alert`** issue. The alert label is deliberately separate from the rolling tracker's **`discovery`** label so the tracker's find-or-create never misroutes a comment into an alert.

**Cardinal rule — a human always merges `src/data`.** The discovery LLMs (research, judge) never touch git/gh: they emit a declarative proposal and have **zero tools** (`generateObject` returns an object — there is no Bash/Write/git surface to escape). The deterministic `apply` step owns all git/`gh`: it validates, re-ranks, and opens a PR. **Auto-merge is OFF and the token has no merge permission**, so merging is always a human click. `apply` also edits only `src/data/<dataKey>.json` + `README.md` (it asserts `git diff --name-only` equals exactly those two); `lastUpdated` in `src/lib/benchmark-hub.ts` stays **human-owned** (the PR checklist reminds).

**Secrets** (env→provider headers only; never into a prompt/arg/proposal/PR-body/URL): `ZAI_API_KEY` + `ZAI_API_ENDPOINT` (the funded Anthropic-compatible endpoint for `glm-5.2`), `EXA_API_KEY` (Atlas search), `STEEL_API_KEY` (optional, JS-rendered pages), `GITHUB_TOKEN` (apply push/PR). `ANTHROPIC_API_KEY` is an accepted fallback when ZAI is unset. `.env` and `.discovery/` stay gitignored.

**SSRF.** The research fetch uses Atlas's built-in `safety:{allowPrivateNetworks:false}` (blocks 0/10/127/100.64/169.254/172.16/192.168 + a DNS check). The `apply` step re-fetches each candidate's `sourceUrl` *independently* to confirm the score, so `src/lib/ssrf-guard.ts` enforces the same host/IP rules itself: http(s)-only, `dns.lookup` per hop, redirect-safe, metadata-IP block.

**A quiet week is valid.** If nothing survives the gates, `apply` opens zero PRs and `notify` posts "no fresh results" — that is success, not failure.

## Process (manual, interactive arxiv sweep)

> This section is the **manual** path: an ad-hoc arxiv-only sweep you run by hand and render as a review comment. The **automated** weekly path (research → judge → PR) above is fully scripted and does not use these steps — it is described in its own section. The four-way taxonomy and evidence rules below still apply if you ever judge candidates by hand.

### 1. Run the discovery script

The script lives at `src/scripts/discover-results.ts` and is exposed as `npm run discover`. It hits arxiv's public API (no auth, ~1 req per 3 seconds per benchmark), filters candidates by date, dedupes by arxiv URL against existing rows, and writes a consolidated `.discovery/run.json`.

Default invocation:

```bash
npm run discover -- --since-days 10
```

Adjust to user intent:

- Specific benchmarks: `--slug browsecomp,gaia,webvoyager`
- Catching up after weeks off: `--since-days 60`
- Available slugs match those declared in `src/lib/benchmark-hub.ts` (e.g. `webvoyager`, `browsecomp`, `webarena`, `swe-bench-verified`, `osworld`, `gaia`, `clawbench`, `online-mind2web`, `tau-bench`, `agentbench`).

### 2. Read `.discovery/run.json`

Each benchmark entry contains:

- `slug`, `benchmarkName`
- `existingTopSystems` — the top 8 rows currently tracked, used for the "Current top" line in the output
- `candidates[]` — papers with `arxivId`, `url`, `title`, `authors`, `publishedAt`, `summary` (full abstract)

The script has already dropped anything whose arxiv ID matches an existing `sourceUrl`. Anything in `candidates` is genuinely unmatched at the URL level — but may still be a duplicate by system name (many existing rows source to blog posts/HF, not arxiv), or off-topic entirely. Classification is the skill's job.

### 3. Classify each candidate by reading its abstract

Decide one of four outcomes per candidate. The reason for being strict here is that the maintainer reviews this output as a triage inbox — every entry they skim is time, and a noisy feed gets ignored.

**Off-topic — drop silently, do not list.**

- Name collision (e.g. "Gaia FGK Benchmark Stars" is stellar spectroscopy, not the AI benchmark).
- The paper only cites the benchmark in passing in related-work without reporting a score on it.

**Proposed addition.** Requires *all* of the following:

- A complete, citable absolute score quotable from the abstract (e.g. "86.2 on BrowseComp", "78.2% pass@1 on WebVoyager", "67.5% on SWE-bench Verified after SFT+RL").
- The score is on the *original* benchmark, not a variant.
- The system or method name can be extracted cleanly from the abstract.

If the abstract gives only an improvement delta ("improves by 8 points"), a truncated number ("achieves state-of-the-art scores of 41..."), or claims SOTA without a concrete number, do NOT propose it — drop silently. The maintainer should not be asked to chase down a number we couldn't read; that work belongs upstream, in our discovery loop, not on their plate.

**Variant candidate.** The paper scores on a *variant* benchmark — these vary by parent, but examples include BrowseComp-Plus, BrowseComp-V³, LiveBrowseComp, MM-BrowseComp, BrowseComp-ZH, BrowseComp-lite, BrowseComp+, SWE-bench Multilingual, SWE-bench Pro, RepoMirage (built-on SWE-bench Verified), Online-Mind2Web. List the paper under the *parent* benchmark in a variants subsection. Variants do not need an absolute score — even mentioning the variant is useful signal because the project might want to spin up a sibling leaderboard page.

**Methodology note.** The paper makes a claim *about* the benchmark itself rather than reporting a new agent's score — e.g. "filtering bad tasks shifts SWE-bench Verified ranks by +9pp", "the WebVoyager judge has ≥45% false-positive rate", "evaluator disagreement is X% on this benchmark". These feed the benchmark's `importantNotes` in `benchmark-hub.ts`, not new rows. They go in a separate methodology subsection so the maintainer can route them differently.

### 4. Render the standardised markdown

The output is verification material. A maintainer needs to scan each row, click the source, and decide whether to verify in one motion. Use tables — they pack the signal density a busy reviewer needs.

Begin with this header (use today's date in YYYY-MM-DD):

```
## Discovery sweep — <YYYY-MM-DD>
_Source: arxiv API, lookback window per run.json._
```

Then one section per benchmark, in the order the benchmark appears in `run.json`. Each benchmark uses a single table containing all classified candidates (proposed, variant, methodology mixed), with the `Kind` column distinguishing them:

```
### <benchmarkName>
Current top: <existingTopSystems[0]>

| ✓ | Kind | System / Finding | Source | Score / Claim |
|---|------|------------------|--------|---------------|
| [ ] | proposed | **<System name>** | [arxiv:<arxivId>](<url>) · <YYYY-MM-DD> | <score and scope, e.g. "86.2 on BrowseComp with 64 parallel Searchers"> |
| [ ] | variant | **<System name>** | [arxiv:<arxivId>](<url>) · <YYYY-MM-DD> | <variant name + score if available, e.g. "27.1% on BrowseComp-Plus"> |
| [ ] | method | **<Finding label>** | [arxiv:<arxivId>](<url>) · <YYYY-MM-DD> | <terse claim, e.g. "+9pp ranking shift when filtering audited tasks"> |

_reviewed: N · proposed: M · variants: V · methodology: T · skipped: K_
```

Column rules:

- **✓** column is literally `[ ]` (a markdown checkbox). When the output is posted to GitHub the box is interactive; in chat it's a visual placeholder. Don't include filled `[x]` boxes — that's the maintainer's job.
- **Kind** is one of `proposed` / `variant` / `method`. Lowercase, no other values. Sort rows by kind in that order so the actionable items are first.
- **System / Finding** is bold. For proposed/variant, the system or method name. For method, a short label for the finding (e.g. `**IKD**`, `**ABA**`, `**Universal Verifier critique**`).
- **Source** is `[arxiv:<id>](<https url>) · <YYYY-MM-DD>`. The interpunct separator keeps the cell narrow. Use the canonical `https://arxiv.org/abs/<id>` form — never `arxiv.org` bare or with a `v<n>` suffix.
- **Score / Claim** is one sentence max. Lead with the number when there is one. For variants without an absolute score, say so plainly ("BrowseComp-Plus, no abs. score in abstract"). For methodology, lead with the claim, not the methodology name.

Formatting rules:

- One table per benchmark with rows for all classified candidates, sorted `proposed` → `variant` → `method`. Don't split into three tables — extra headers cost more than they clarify.
- If a benchmark has zero rows after filtering, omit the table and write just: `_No new candidates this run (reviewed N, skipped K)._` followed (optionally) by a one-line reason if the skip pattern is notable (e.g. "All hits were ESA Gaia stellar-spectroscopy papers" or "All five papers reported improvement deltas only").
- Multiple benchmarks with zero candidates AND zero papers in window can be collapsed into a single trailing line: `### WebVoyager · ClawBench · Online-Mind2Web` followed by `_No papers within the lookback window._`.
- The footer counts must add up: `N = M + V + T + K`. If they don't, you've miscategorised something.
- Author lists are never in the output — too much noise per row. The paper link covers attribution.

### 5. Cross-cutting observations (only when there's something to say)

After all per-benchmark tables, if the sweep surfaced patterns that span multiple benchmarks or warrant project-level decisions, add a short closing section:

```
---

### Patterns worth a look

- **<observation>.** <one-or-two sentence explanation>.
- **<observation>.** ...
```

Reserve this for things like:
- Variant proliferation across multiple parents in one sweep (e.g. BrowseComp variants stacking)
- A paper that scores on 3+ benchmarks we track (cross-cutting system)
- A methodology finding that affects multiple `importantNotes`

If there's nothing cross-cutting worth flagging, omit this section entirely. Don't pad with filler.

### 6. Optional: post the comment

If the user explicitly asks to post — "post it", "send to GitHub", "put it on the issue", "comment it" — append to the rolling discovery issue:

```bash
# Render the markdown to a file first (use a tmp path or .discovery/COMMENT.md)
COMMENT_PATH=.discovery/COMMENT.md

# Ensure the discovery label exists; ignore failure if it already does
gh label create discovery \
  --description "Automated benchmark candidate sweeps" \
  --color C2E0C6 2>/dev/null || true

# Find the existing rolling issue, or create one if absent
ISSUE=$(gh issue list --label discovery --state open --json number --jq '.[0].number // empty')
if [ -z "$ISSUE" ]; then
  ISSUE=$(gh issue create \
    --title "Benchmark discovery — rolling arxiv sweep" \
    --label discovery \
    --body "Rolling tracker for benchmark candidate sweeps. Each run appends a comment below; maintainers verify candidates manually before adding to src/data/." \
    | grep -oE '[0-9]+$')
fi

gh issue comment "$ISSUE" --body-file "$COMMENT_PATH"
```

If the user did NOT ask to post, render the markdown into the conversation. They will often iterate on what to include — drop a candidate, expand one's context, ask to fetch the PDF for a truncated score — before deciding whether to post. Honour that flow; don't post pre-emptively.

## Tips and edge cases

- **GAIA almost always has astronomy false positives.** Even with the per-slug query override in the script, expect 2–4 stellar-spectroscopy hits per run. They're easy to recognise from the title alone ("Gaia FGK Benchmark Stars", "Gaia DR3", "globular clusters"). Drop without comment.
- **One paper can land under multiple benchmarks.** A multi-benchmark paper like "Orchard" appears under WebVoyager (Orchard-GUI, 74.1%) and SWE-bench Verified (Orchard-SWE, 67.5%). List it in both — under its appropriate sub-system name — and note the duplication in the Context line so the maintainer isn't surprised when they see the same arxiv ID twice.
- **Improvement-only papers feel valuable but aren't.** Many high-quality papers report "+8 points on SWE-bench Verified" without giving the final number. For leaderboard purposes those are unactionable, so they get dropped. If the maintainer wants such papers tracked, they'll add a methodology note manually.
- **Variant proliferation is itself a signal.** When you see 5+ variants for one parent in a single run (BrowseComp has lately spawned Plus, V³, ZH, lite, MM, Live, Video), call this out conversationally to the user. Spinning up dedicated variant pages is a project-level decision the maintainer makes off-line, but the skill should be the one to flag the pressure.
- **Re-running is cheap.** If the user asks for a different window, a different slug set, or a re-classification with different rules, just re-run `npm run discover` with new args — it overwrites `.discovery/run.json`. Don't try to mutate the JSON in place.
- **Scores are sometimes truncated in arxiv abstracts.** When you see "achieves 41..." or "$+0..." that's a real artefact of the source abstract, not a parsing bug in the skill. Drop the candidate — the maintainer cannot use a half-number.

## What success looks like

A good run produces a comment the maintainer can skim in under a minute and walk away with:

- A short list of concrete additions they can verify against the source paper in another minute each.
- A separate variant list that informs whether to spin up sibling pages.
- A separate methodology list that informs the benchmark page's caveats.
- Counts at the footer that make the noise floor visible — if `skipped: 18` consistently dwarfs `proposed: 1`, the search query for that slug probably needs tightening.

If a run produces no actionable rows but the maintainer reads all the counts and the variant section and learns something useful about the landscape, that's also success — the feed has to model the world even when nothing should land in `src/data/` this week.
