# Dither Kit — BrowseComp chart subset

Component source retrieved from [Dither Kit](https://github.com/Boring-Software-Inc/dither-kit) on October 10, 2026. `upstream.json` records registry URLs and original file hashes. Only the bar component and its transitive dependencies are included; the leaderboard provides its own axes, legend, and accessible result details.

Local changes: repository formatting, Steel/stone/warm palettes, an optional fixed Y domain, an accessible name and group role for the interactive SVG, decorative canvas semantics, a larger backing-width limit for horizontal scrolling, selected-bar highlighting, and skipping zero-height series. The canvas uses Dither Kit's ordered Bayer texture and reduced-motion behavior. Recheck these changes when updating upstream.
