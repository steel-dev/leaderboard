# Featured benchmark chart rollout

Implemented October 10, 2026. Extends the approved BrowseComp Dither chart to the
homepage and three more representative benchmarks: WebVoyager (live browsing),
WebArena (controlled websites), and OSWorld (desktop computer use).

| Benchmark  | Classified results |
| ---------- | -----------------: |
| BrowseComp |                100 |
| WebVoyager |                 21 |
| WebArena   |                 50 |
| OSWorld    |                 23 |
| Total      |                194 |

The homepage defaults to BrowseComp, offers these four benchmarks in a selector,
and previews five results beneath the chart. Model-weight and multi-size filters
carry across benchmark changes. Benchmark selection and filters are restored from
direct URLs and browser history. Full-leaderboard links preserve the filters.
Other benchmark pages retain their existing tables.

All four charts use the same compact hover/focus/tap card. More details expands
the table and focuses the matching evidence entry, including results outside the
initial preview. The methodology explains provisional estimates, price proxies,
multi-model classifications, and how to suggest a correction.

## Research and data integrity

The shared registry validates category boundaries, parameter and price evidence,
duplicate model consistency, exact submission coverage, and required runtime
components. Existing result names, ranks, scores, dates, notes, and source links
remain unchanged; tests compare every original result field.

Uncertain historical model identities and unreleased evaluated checkpoints remain
explicitly uncertain. Open harness code does not qualify a closed or uncertain
runtime for the open-weight filter. The researched WebVoyager submissions have
no fully verified all-open stack, so its open-weight filter correctly shows an
empty state.

Benchmark-specific evidence and caveats:

- BrowseComp: [batch 1](browsecomp/models-1.md), [batch 2](browsecomp/models-2.md),
  [batch 3](browsecomp/models-3.md).
- [WebVoyager](webvoyager/model-classification.md).
- [WebArena](webarena/model-classification.md).
- [OSWorld](osworld/model-classification.md).

## Validation

- All 18 classification, registry, URL, chart geometry, and full-coverage tests
  pass with `npm run test:charts`.
- `npm run lint`, `npx tsc --noEmit`, and `git diff --check` pass.
- `npm run build -- --outDir tmp/benchmark-charts-dist` passes: 17 pages plus
  endpoints and images, completed at 15:16 local time in 164.56 seconds. Isolated
  output avoids the concurrent development work's `dist/` directory.
- Browser checks cover all four homepage selections, combined weight/size
  filters, empty-state recovery, Back/Forward restoration, and filtered links
  from the homepage to benchmark pages.
- Each benchmark page was checked with all results plotted and the final bar
  selected by keyboard. More details opens the correct table entry and expands
  all rows (100, 21, 50, and 23 respectively).
- Homepage benchmark changes retain keyboard focus on the selector. Shared
  table controls retain the existing New badges. The static GAIA table still
  expands independently; its script no longer attaches to React table controls.
- At 320px, the homepage, filters, and OSWorld hover card remain within the
  viewport. Desktop keyboard navigation, dismissal, and details focus work.
  The shared pointer/touch handlers retain the behavior verified in the
  [BrowseComp hover-card checks](browsecomp/chart-qa.md).
- The compiled production preview passes filtered-route checks for all four
  benchmarks and homepage selection, preserved filters, Back navigation, the
  Share view success state, keyboard cards, and table-details focus. No browser
  errors or warnings were recorded in the final preview. A duplicate SMTL source
  citation found during development was consolidated before the final build.

These checks do not constitute a manual screen-reader audit. Research estimates
remain provisional and can be corrected through the on-page source links.

Local QA artifacts are kept in the ignored `tmp/` directory, including
`tmp/home-chart-mobile.jpg`, `tmp/home-chart-rollout-final.jpg`, and the production build log
`tmp/qa/build-rollout.log`.

## Chart simplification

The follow-up revision moves filters and actions above the graph card. Its header
now matches the Results header's monospace text and repeated rules, with a
benchmark-specific score label and percentage units. Removed the plotted/matching
counter, generic success-rate axis title, higher-is-better label, and introductory
paragraph. Weight-color keys sit beneath the graph; hover cards use the same
benchmark score name.

Model sizes use a compact checkbox dropdown with multiple selection, an All sizes
reset, keyboard operation, Escape dismissal, and outside-click dismissal. Existing
size URLs, Back navigation, benchmark switching, and shared chart/table filtering
are preserved. Share confirmation and Reset filters remain in the control strip.

Verified desktop interaction, direct-link and history restoration, multiple size
choices, share feedback, and the 320px dropdown/header/hover-card layout. The 18
existing tests, lint, and TypeScript checks pass. Final build output is isolated
at `tmp/benchmark-charts-simple-dist`; its log is `tmp/qa/build-simple.log`.
