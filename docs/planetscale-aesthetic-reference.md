# PlanetScale Aesthetic Reference

Last verified against PlanetScale on 2026-03-21.

Reference pages:
- https://planetscale.com/
- https://planetscale.com/pricing
- https://planetscale.com/benchmarks
- https://planetscale.com/assets/styles-B1nkZfXH.css

## Goal

Use PlanetScale as the visual reference for the Steel leaderboard refactor.

This means matching the design logic, token behavior, information density, and interaction style. It does not mean copying their markup or rebuilding their pages one-to-one.

## High-Level Read

PlanetScale’s site is:

- Mono-first, editorial, and technical.
- Flat and border-led rather than card-led.
- Restrained with accent color.
- Dense with information, but never visually noisy.
- More documentation/product-console adjacent than startup-landing-page adjacent.

The visual hierarchy comes from contrast, spacing, border treatments, and section structure more than from huge type, glossy gradients, or deep shadows.

## Core Principles

1. Default to structure over decoration.
2. Prefer typography, rules, and grids over background effects.
3. Keep surfaces flat.
4. Use color sparingly and semantically.
5. Make data views feel crisp and technical, not playful.
6. Let whitespace and separators do the grouping.

## Color System

### Canonical Tokens Observed On PlanetScale

Light-mode base tokens from the live stylesheet:

```css
:root {
  --gray-50: #fafafa;
  --gray-100: #ebebeb;
  --gray-200: #e1e1e1;
  --gray-300: #c1c1c1;
  --gray-400: #a1a1a1;
  --gray-500: #818181;
  --gray-550: #737373;
  --gray-600: #616161;
  --gray-700: #414141;
  --gray-800: #2b2b2b;
  --gray-850: #1a1a1a;
  --gray-900: #111111;

  --orange-500: #f35815;
  --blue-600: #0b6ec5;
  --green-600: #13862e;
  --red-600: #d92038;
  --yellow-200: #fed54a;

  --text-contrast: #000000;
  --text-primary: #414141;
  --text-secondary: #737373;
  --text-decoration: #c1c1c1;
  --text-disabled: #a1a1a1;
  --text-red: #d92038;
  --text-orange: #f35815;
  --text-green: #13862e;
  --text-blue: #0b6ec5;

  --bg-primary: #fafafa;
  --bg-secondary: #ebebeb;
  --bg-focus: 235 235 235;
  --bg-inverted: #111111;
  --border-primary: #414141;
}
```

Dark-mode equivalents from the live stylesheet:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-contrast: #ffffff;
    --text-primary: #e1e1e1;
    --text-secondary: #a1a1a1;
    --text-decoration: #414141;
    --text-disabled: #616161;
    --text-red: #ff7082;
    --text-green: #27b648;
    --text-blue: #47b7f8;

    --bg-primary: #111111;
    --bg-secondary: #1a1a1a;
    --bg-focus: 65 65 65;
    --bg-inverted: #ffffff;
    --border-primary: #c1c1c1;
  }
}
```

### How To Use Color

- Backgrounds stay close to `#fafafa` or `#111111`.
- Body text is gray, not pure black.
- High-contrast headings can jump to `#000000` or `#ffffff`.
- Orange is for primary emphasis only:
  - CTA fills
  - left-rule emphasis
  - selective hover/open states
- Blue is for:
  - links
  - focus rings
  - selected/active interactive states
- Green and red are for status or benchmark outcomes, not general decoration.
- Yellow is a small annotation/highlight color, not a brand background.

### Avoid

- Neon palettes.
- Large color fields unless they are deliberate section inversions.
- Multiple accent colors in the same viewport without semantic reason.
- Purple-heavy “AI” gradients. PlanetScale does have purple tokens, but they are secondary.

## Typography

### Core Observation

PlanetScale’s live site is primarily mono-driven. The body font is set to a system monospace stack, not a flashy display sans.

Observed base rule:

```css
body {
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
  font-size: 16px;
  text-wrap: pretty;
}
```

### Typography Rules

- Default body copy: `16px / 1.5`.
- Use monospace as the main voice.
- Weight lives mostly between `500` and `700`.
- Tight tracking appears selectively on supporting UI text, not everywhere.
- Headings are not oversized by default. They are sharp, compact, and structural.

### Heading Treatment Patterns

Observed content styles:

- `h1`: bold, high-contrast, with a `2px` orange left rule and `16px` inset.
- `h2`: underlined with muted gray decoration and `4px` underline offset.
- `h3`: bold only.
- Blockquotes: `2px` left rule with subdued gray.

This is important: hierarchy is being created with rules, underlines, contrast, and spacing, not giant display type.

### Recommended Direction For This Repo

- Do not keep JetBrains Mono as the dominant aesthetic just because the current site uses it.
- Prefer a system mono or a more restrained mono stack.
- If a sans family is retained at all, keep it secondary and minimal.

## Spacing And Layout

### Observed Rhythm

PlanetScale’s spacing cadence is highly regular:

- `4`
- `8`
- `12`
- `16`
- `24`
- `32`
- `40`
- `48`
- `56`
- `80`
- `96`

### Containers

Observed container behavior:

- max width reaches `80rem`
- horizontal padding scales from `16px` upward
- layout stays left-aligned and editorial, not centered into a narrow card column

### Layout Rules

- Prefer wide, usable content areas over the current `max-w-3xl` constraint.
- Build pages out of sections, rows, and grids.
- Use whitespace between sections, then reinforce with separators.
- When showing dense data, use full-width grids/tables rather than stacked cards.
- When building matrix layouts, collapse borders with `-0.5px` techniques so cells feel continuous.

## Surfaces, Borders, Radius, Shadow

### Surface Model

PlanetScale is overwhelmingly flat:

- primary surface = base background
- secondary surface = subtle gray step up/down
- very little elevation
- almost no decorative blur

### Borders

- `1px` borders are everywhere.
- `2px` borders are reserved for emphasis.
- Border color is a meaningful structural tool, not a faint afterthought.

### Radius

Observed radius usage is small:

- `0`
- `2px`
- `4px`
- full pill only on small badges or dots

### Shadows

- Rare.
- Small shadow only on controls where needed.
- Never use heavy drop shadows as a primary grouping mechanism.

### Signature Border Motifs

PlanetScale uses two recurring separators:

1. Dashed frame borders built with `repeating-linear-gradient(...)`, not typical dashed `border-style`.
2. Dotted horizontal rules rendered as repeated punctuation.

These details matter. The site feels crafted because borders are treated as graphic elements.

## Components

### Navigation

- Compact mono nav.
- Inline links separated by `|`.
- Very little chrome.
- One clear CTA button.

### Buttons

Observed primary button pattern:

```css
.btn {
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-inline: 16px;
  background: #f35815;
  color: white;
  font-weight: 600;
  line-height: 1;
  transition: all 150ms ease;
}
```

Use this logic:

- one strong orange primary action
- no oversized pill softness
- no ghost button overload
- clear blue focus ring

### Forms And Controls

- Flat white or dark backgrounds.
- `1px` borders.
- Minimal or zero radius.
- Blue focus ring.
- Little to no inset shadow.

### Tables

Observed table behavior:

- `16px` text
- left alignment
- `24px` vertical cell padding
- `24px` horizontal gap between columns
- strong row separators

For the leaderboard, this is a much better reference than the current terminal box treatment.

### Callouts And Quotes

- Left border callouts beat filled cards.
- Quotes are quiet, not oversized testimonial blocks.
- Secondary metadata sits in muted gray.

### Code And Inline Labels

- Inline `code` and `pre` use a subtle gray slab.
- Underline decoration is used instead of rounded chip styling.
- `mark` uses a tight yellow highlight.

### Logo Or Partner Grids

On the homepage, PlanetScale uses bordered cell grids for brand logos:

- equal-height cells
- simple borders
- very restrained hover treatment
- no floating cards

That pattern is a good reference for benchmark families, registry groupings, or sponsor-style rows if needed.

## Motion And Interaction

Motion is restrained:

- mostly `150ms`
- color changes
- opacity shifts
- small state rotations, like chevrons rotating `180deg`
- focus rings that are crisp and technical

Avoid:

- springy movement
- large-scale hover transforms
- float animations
- blurred parallax backgrounds

## Content Styling Rules

- Paragraph blocks usually separate with `24px`.
- Lists keep generous `24px` rhythm.
- Underlines and left rules are part of the system.
- Captions and secondary metadata use muted gray.
- Images stay bounded and left-oriented rather than exploding full-bleed.

## Repo Translation Notes

These are the main files the refactor agent should treat as first-touch surfaces:

- `src/styles/global.css`
- `src/layouts/Layout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/LeaderboardTable.astro`
- `src/components/BenchmarkRegistry.astro`
- `src/components/RegistryPage.astro`
- `src/pages/index.astro`
- `src/pages/registry.astro`

### Immediate Changes The Refactor Should Make

1. Replace the current terminal token system in `src/styles/global.css`.
2. Remove the neon-on-black grid language from the global background.
3. Expand layout width beyond the current narrow centered column.
4. Rebuild navigation into a restrained mono nav with one orange CTA.
5. Rework the leaderboard into a crisp bordered table/grid rather than a terminal shell.
6. Use subdued surfaces and strong separators instead of bright fills and glowing accents.

### Things To Remove From The Current Steel Site

- neon green primary text
- terminal grid background overlay
- boxed terminal chrome bars
- all-caps hacker framing as the dominant voice
- oversized rounded pills with bright outlines

## Suggested Starter Token Map For This Repo

This is not PlanetScale’s exact variable schema. It is a practical starting map for this repo:

```css
:root {
  --color-bg: #fafafa;
  --color-surface: #ebebeb;
  --color-surface-strong: #e1e1e1;
  --color-text: #414141;
  --color-text-muted: #737373;
  --color-text-strong: #111111;
  --color-border: #414141;
  --color-accent: #f35815;
  --color-link: #0b6ec5;
  --color-success: #13862e;
  --color-error: #d92038;
  --color-highlight: #fed54a;
  --color-focus-rgb: 235 235 235;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111111;
    --color-surface: #1a1a1a;
    --color-surface-strong: #2b2b2b;
    --color-text: #e1e1e1;
    --color-text-muted: #a1a1a1;
    --color-text-strong: #ffffff;
    --color-border: #c1c1c1;
    --color-accent: #f35815;
    --color-link: #47b7f8;
    --color-success: #27b648;
    --color-error: #ff7082;
    --color-highlight: #d19f03;
    --color-focus-rgb: 65 65 65;
  }
}
```

## Design Guardrails For The Refactor Agent

- Do not introduce generic SaaS gradients.
- Do not switch the whole site to soft rounded cards.
- Do not rely on shadows to create hierarchy.
- Do not make every section a colored panel.
- Do not mix multiple visual metaphors.
- Do keep the result technical, composed, and editorial.
- Do make the information architecture feel cleaner and more premium than the current terminal theme.

## Practical Definition Of “Looks Like PlanetScale”

If the refactor is on track, the new UI should feel like this:

- a technical product site
- mono-first
- structured by borders and spacing
- high signal, low decoration
- selective orange emphasis
- blue interactive affordances
- flat surfaces
- precise tables and documentation-like sections

If it starts feeling like a cyberpunk terminal, glassmorphism dashboard, or generic AI startup landing page, it has drifted away from the reference.
