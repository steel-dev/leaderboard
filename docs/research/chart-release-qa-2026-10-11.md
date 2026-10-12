# Chart release QA — October 11, 2026

## Scope

The release contains the four featured charts, 197 classified results, the WebVoyager homepage default, reviewed data/source corrections, and the Brave size-picker fix. Source evidence and remaining uncertainties are recorded in the [BrowseComp audit](browsecomp/verification-2026-10-11.md) and [WebVoyager/WebArena/OSWorld audit](chart-data-verification-2026-10-11.md).

Checks use an isolated export of the intended PR tree, served by Astro preview. Unrelated in-progress branding, discovery-pipeline, DRACO, and Online-Mind2Web edits in the shared checkout are excluded. The staged runtime source was compared byte-for-byte with the isolated build source. The working README was regenerated separately to preserve the other task's changes.

## Automated checks

- README regeneration passed.
- ESLint passed.
- TypeScript `--noEmit` passed.
- Full Astro production build passed: 17 HTML pages, generated share images, Markdown/text endpoints, and sitemap.
- Compiled link audit passed: 953 local routes/assets and 482 fragments resolve; zero duplicate IDs; all 165 static note buttons target their own row tooltip. All 197 chart/homepage result destinations and 756 model/submission source hrefs match the serialized data. The audit also checks 18 Markdown/text endpoints, JS/CSS imports, manifest and sitemap references.
- All 24 chart tests passed: registry validation, parameter/price boundaries, complete result mappings, stack aggregation, sorting/ties, URL/filter/result-fragment handling, bar hit testing, and animation revision behavior.
- `git diff --check` passed.

## Browser checks

Tested the compiled site in Brave at its normal desktop viewport and 375px/320px phone widths. These are responsive viewport checks, not physical-phone testing.

- Homepage defaults to WebVoyager before and after hydration. Explicit benchmark selection, weight/size filters, and Back/Forward restoration work together. A filtered homepage hover card opens the exact benchmark result beyond the first 20 rows, expands its details, and preserves filters.
- All results render: BrowseComp 102, WebVoyager 22, WebArena 50, OSWorld 23. Verified corrected o4-mini, Qwen3-VL, UiPath, BrowserGym and Patel labels/scores, plus AREX-2, Traverse, Wuying, and GBOX classifications.
- Repeated the original crash sequence: focus/open size summary, then click the Large label text. Repeated Large toggles, multiple size labels, keyboard Space, Escape and click-away completed without a renderer crash.
- BrowseComp Open/Large filters produce the same ordered 26 systems in chart and expanded table. OSWorld Open gives six models; Small/Large gives five.
- Keyboard End reaches an offscreen bar; Enter expands its exact result beyond the initial 20 rows and focuses Evaluation & model details. Back/Forward and reload restore the result fragment and filters.
- Empty filter combinations show matching chart/table empty states. Reset restores results.
- Share view reports Link copied; URL helper tests cover filter/fragment preservation. The automation clipboard bridge did not expose the copied text, so clipboard payload contents were not independently read back.
- Narrow layouts retain horizontal scrolling inside chart/table containers. At 320px the page has no horizontal overflow and the size menu stays within the viewport.
- No application warnings/errors were observed in the checked console output. Installed browser extensions produced unrelated messages.

## Review and limits

Independent code review found no confirmed functional blocker. It identified duplicate note IDs for tied ranks in the static results table; IDs now use row positions, keeping each note paired with its own button. Upstream Dither Kit MIT-manifest provenance is recorded with the vendored source.

This pass does not rerun benchmark evaluations, establish identical evaluation protocols, test every assistive technology/browser, or turn estimated runtime identities into published facts. The source audits identify unresolved provenance, version differences and blocked evidence explicitly.

## Screenshots

- [WebVoyager homepage default, desktop](screenshots/charts-home-desktop.png)
- [Compact BrowseComp chart, desktop](screenshots/charts-browsecomp-desktop.png)
- [WebVoyager chart and hover card, phone viewport](screenshots/charts-webvoyager-mobile.png)
