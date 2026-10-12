# Featured benchmark charts

The homepage opens on **WebVoyager** and offers BrowseComp, WebArena, and OSWorld
in the chart heading's benchmark picker. It contains the chart and benchmark
directory. Each featured benchmark page has a compact chart and its full results
table; other benchmark pages retain their existing tables.

| Benchmark  | Classified results |
| ---------- | -----------------: |
| BrowseComp |                102 |
| WebVoyager |                 22 |
| WebArena   |                 50 |
| OSWorld    |                 23 |
| Total      |                197 |

## Interaction and presentation

- The card header reads **Scores**, followed by the repeated yellow rules.
  Homepage headings switch benchmarks; benchmark-page headings are fixed.
- Weight and multi-select size filters apply to both chart and results. Filter
  state and benchmark selection survive shared URLs and Back/Forward navigation.
- Top 20, Top 50, and All results control the plotted bars. The chart scrolls
  horizontally within its card, with a fixed 0–100 percent axis.
- Open weights use yellow, closed weights use Radix gray-12, and mixed/uncertain
  stacks use a distinct pattern. The legend and text labels identify each class.
- Hover, keyboard focus, and touch expose a compact details card. Homepage result
  activation navigates to the matching benchmark result. Benchmark pages expand
  the results and focus that result's evaluation details, including rows beyond
  the initial preview. Result fragments preserve exact names and punctuation.
- Benchmark pages retain the original 48rem content column, smaller controls,
  shorter bars, and less left padding. The homepage retains its larger chart.
- Removed plotted/matching counts and redundant metric/instruction labels from
  the graph. Full benchmark tables retain their result count.

## Classification and evidence

Size categories use total parameters: Tiny ≤4B, Small >4–40B, Medium >40–150B,
and Large >150B. Active MoE parameters are recorded separately. When published
parameters are unavailable, standard uncached USD token prices use a 3:1
input/output blend: Small <$0.15/M, Medium $0.15–$1/M, and Large >$1/M.

Price categories are labeled **Price proxy**; provisional classifications are
labeled **Estimated** and remain filterable. Multi-model systems inherit their
largest component category, with their components and caveats disclosed. Open
weights require released weights for every required model. Open harness code
alone does not establish an open model stack.

The registry validates evidence fields, parameter/price boundaries, conflicting
model definitions, exact result coverage, and required model references. The
chart preserves the input result fields; source corrections are made in the
underlying benchmark dataset so tables, charts, Markdown, and result images agree.
The methodology includes a correction link.

Research notes:

- BrowseComp: [batch 1](browsecomp/models-1.md), [batch 2](browsecomp/models-2.md),
  [batch 3](browsecomp/models-3.md).
- [WebVoyager](webvoyager/model-classification.md).
- [WebArena](webarena/model-classification.md).
- [OSWorld](osworld/model-classification.md).

## Brave filter crash regression

The renderer crash occurred when the size-picker summary had focus and the user
pressed the **Large label text**, rather than the checkbox. That press temporarily
moves focus to the document with a null `relatedTarget`. Closing the native details
element in that blur handler hid the clicked text while Chromium was hit testing.
Matching Brave symbols and a fresh reproduction dump identified the
[display-lock assertion in HitTestResult::GetPosition](https://github.com/chromium/chromium/blob/153.0.8010.53/third_party/blink/renderer/core/layout/hit_test_result.cc#L215).

The handler closes only when focus has a known destination outside the picker.
Outside pointer presses, Tab, and Escape retain their dismissal paths. Regression
checks exercise the label text after summary focus, repeated toggles, multiple
sizes, keyboard activation, Escape, and click-away.

Equivalent chart rows also retain their animation revision during filter changes.
Changed values, labels, ordering, row counts, and explicit replay tokens restart
animation. This optimization is separate from the confirmed crash fix.

## Verification

`npm run test:charts` covers classifications, coverage of all four datasets,
filter intersections, URL/result-fragment round trips, sorting, chart geometry,
and animation revisions. Required release checks are `npm run lint`,
`npx tsc --noEmit`, `npm run build`, and `git diff --check`. Regenerate the README
when benchmark data changes.

Release evidence and source corrections are recorded in the [BrowseComp audit](browsecomp/verification-2026-10-11.md),
[WebVoyager/WebArena/OSWorld audit](chart-data-verification-2026-10-11.md), and
[release QA report](chart-release-qa-2026-10-11.md). Browser checks cover all featured charts, filtered chart/table agreement,
empty states, history restoration, exact-result navigation, desktop keyboard
controls, and narrow layouts. Automated checks do not constitute a manual screen
reader audit or independent reproduction of the reported benchmark evaluations.
