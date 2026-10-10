# BrowseComp chart prototype

Implemented on October 10, 2026, on `codex/browsecomp-dither-chart`. This first
iteration adds a Dither Kit bar chart and linked results table to BrowseComp.
Homepage charts and other benchmarks remain outside this iteration.

The subsequent [featured benchmark rollout](../chart-rollout.md) adds the homepage,
WebVoyager, WebArena, and OSWorld. The checks below record the initial prototype.

## Behavior and research

- Defaults to the top 20 reported scores, with top 50 and all-results options.
- Uses a fixed 0–100% axis, descending scores, and the existing Steel palette.
- Model-weight and multiple size filters update both chart and table. URLs
  preserve these filters across reloads, sharing, and browser history.
- Hover, keyboard focus, and touch open a compact card beside the bar. The card
  shows the system, score, weights, size, and classification basis. More details
  opens the corresponding table entry with evaluation notes, models, and sources.
- All 100 original submissions have research mappings. Original scores, names,
  ranks, dates, and result-source links are preserved.
- Size categories use total parameters, then a disclosed token-price proxy, then
  an explicit provisional estimate. Multi-model entries use the largest component
  category. Every required model must have available weights to qualify as open.
- Research caveats are retained in the three accompanying model research notes
  and exposed in the interface. Unknown stacks are not asserted to be open.

## Validation

`npm run lint`, `npx tsc --noEmit`, and all 15 `npm run test:charts` tests pass.
`npm run update-readme` reports that the README is already current.

The production build passes with
`npm run build -- --outDir tmp/browsecomp-dist` (17 pages plus endpoints and
images). An earlier default-output build collided with concurrent logo work
writing to `dist/`; the separate output directory avoids that shared-output
race. The verified build is served locally on port 4323.

Chrome automation verifies chart/table agreement against the research mappings,
all 100 score labels and descending positions, combined filters, empty states,
shared-link reloads, browser Back, clipboard sharing, arrow/Home/End navigation,
touch selection, and horizontal scrolling within the mobile chart. The other
benchmark layout is preserved. No uncaught browser errors were recorded.

The 320px layout required wrapping size buttons and containing the existing
header dropdown. The SVG tap targets also suppress the native blue tap highlight
and touch-focus outline to retain the site palette. Keyboard focus retains a
yellow dashed indicator. Axe reported no WCAG A/AA violations within the
explorer at 320px, 768px, and 1440px.

The production preview also passes desktop, iPhone-sized, and 320px smoke checks
for hydration, result counts, filters, touch selection, header containment, and
focus styling. The homepage was verified in the dev server without a chart
rollout. Final screenshots were captured from the production preview.

Local screenshots and machine-readable browser QA reports are under `tmp/`:

- `tmp/browsecomp-chart-desktop.png`
- `tmp/browsecomp-chart-mobile.png`
- `tmp/browsecomp-chart-320.png`
- `tmp/qa/browsecomp-report.json`
- `tmp/qa/accessibility-report.json`
- `tmp/qa/production-report.json`

Automated accessibility checks supplement keyboard and touch interaction checks;
they do not constitute a manual screen-reader audit. Classification estimates
remain provisional and have a correction link in the chart methodology.

## Hover-card revision

Replaced the persistent result panel with a compact, viewport-clamped hover card.
It remains open while moving onto the card, closes with Escape or an outside
interaction, and clears when scrolling or changing filters. Arrow keys preview
results; Enter or the More details button opens and focuses the corresponding
table evidence, including entries beyond the first 20 rows. Touch opens the card
on the first tap. Detailed sources and research remain in the results table.

Follow-up browser checks cover slow pointer movement between a bar and its card,
first/last bars, keyboard focus and dismissal, 390px touch interaction, narrow-screen
containment at a 320px viewport override, and visible focus when opening tall
model-evidence rows. Screenshots: `tmp/browsecomp-hover-final.jpg`,
`tmp/browsecomp-hover-desktop.png`, and `tmp/browsecomp-hover-mobile.png`.
