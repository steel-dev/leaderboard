## Discovery sweep — 2026-06-27
_Source: deterministic arXiv discovery sweep (arXiv API) + Atlas deep-research sweep (Exa search + Steel browser fetch); lookback since 2026-06-13 (ISO week 2026-W26)._

### BrowseComp
Current top: GPT-5.5 Pro — 90.1%

| ✓ | Kind | System / Finding | Source | Score / Claim |
|---|------|------------------|--------|---------------|
| [ ] | proposed | **AgentCPM-Explore** | [paper](https://arxiv.org/html/2606.18831) · 2026-06-17 | 27.00% on BrowseComp (100-example subset, single-run Pass@3); self-reported. Search + fetch + Python, 240K ctx. |
| [ ] | proposed | **AgentCPM-Explore (Average Pass@3)** | [paper](https://arxiv.org/html/2606.18831) · 2026-06-17 | 17.3% on BrowseComp (100-example subset, Average Pass@3); self-reported. |
| [ ] | proposed | **AgentCPM-Explore + Ours (25 steps, Average Pass@3)** | [paper](https://arxiv.org/html/2606.18831) · 2026-06-17 | 17.8% on BrowseComp (100-example subset, Average Pass@3); long-context-RL checkpoint; self-reported. |
| [ ] | proposed | **AgentCPM-Explore + Ours (50 steps)** | [paper](https://arxiv.org/html/2606.18831) · 2026-06-17 | 34.00% on BrowseComp (100-example subset, single-run Pass@3); long-context-RL checkpoint; self-reported. |
| [ ] | proposed | **AgentCPM-Explore + Ours (50 steps, Average Pass@3)** | [paper](https://arxiv.org/html/2606.18831) · 2026-06-17 | 19.7% on BrowseComp (100-example subset, Average Pass@3); long-context-RL checkpoint; self-reported. |
| [ ] | proposed | **MiniMax M3** | [model card](https://www.minimax.io/models/text/m3) · 2026-06-27 | 83.5% on BrowseComp; self-reported (vendor model card, no setup details; page date unconfirmed). |

_reviewed: 7 · proposed: 6 · variants: 0 · methodology: 0 · skipped: 1_

---

### Patterns worth a look

- **AgentCPM-Explore 25-step single-run Pass@3 dropped on evidence grounds.** Atlas carried a 29.00% Pass@3 row for "AgentCPM-Explore + Ours (25 steps)", but its `quotedEvidence` quoted the base-model line ("… \| 27.00 \| …") — 29.00 is not verbatim in any captured quote, so it was skipped rather than admitted alongside the other five AgentCPM rows. Re-fetching the Table 5 row would let it land. Note the same paper reports each checkpoint twice (single-run Pass@3 vs. Average Pass@3); the two are not directly comparable.
- **More BrowseComp variants in the wings.** The report surfaced (and correctly did not admit as original-BrowseComp candidates) BrowseComp-Plus, BrowseComp+, XBCP, and EvoBrowseComp. Four variants in one sweep is sibling-page pressure worth a maintainer call; none are original-BrowseComp scores.
