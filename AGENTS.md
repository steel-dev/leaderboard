# Repository Guidelines

## Project Structure & Module Organization
This is an Astro + TypeScript site for the Steel browser-agent leaderboard. The main page is `src/pages/index.astro`. Markdown-style endpoints `index.md.ts` and `llms-full.txt.ts` expose leaderboard data for tools and LLMs. Shared UI lives in `src/components/`, page shells in `src/layouts/`, and leaderboard data in `src/lib/leaderboard.ts`. Static assets belong in `public/` or `src/assets/`. Research notes may live under `docs/research/<slug>/`.

## Build, Test, and Development Commands
Use `npm install` to set up dependencies. Key scripts:

- `npm run dev`: start the Astro dev server.
- `npm run build`: produce the production build in `dist/`.
- `npm run preview`: serve the built site locally.
- `npm run lint`: run ESLint across the repo.
- `npm run lint:fix`: apply autofixes where possible.
- `npm run update-readme`: rebuild the README leaderboard table from `src/lib/leaderboard.ts`.

## Coding Style & Naming Conventions
Follow the existing Prettier config: 2-space indentation, semicolons, double quotes, `printWidth: 100`, and trailing commas where valid in ES5. ESLint enforces no unused variables and disallows `any` in TypeScript. Keep Astro components and layouts in `PascalCase` (for example, `LeaderboardTable.astro`), use `camelCase` for exported helpers, and keep slug-like files and folders in `kebab-case` (for example, `docs/research/webvoyager/`).

## Testing Guidelines
There is no automated test suite yet. For every change, run `npm run lint` and `npm run build` before opening a PR. If you update leaderboard data, also run `npm run update-readme` and verify the homepage in `npm run dev`.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit style, e.g. `feat(seo): add custom 404 page` and `feat(analytics): add Google Analytics`. Keep subjects imperative and scoped when useful. PRs should include a brief summary, note any benchmark or source updates, link related issues, and attach screenshots for visible UI changes. If you touch scraping scripts in `scripts/`, call out any required local path or Steel CLI setup in the PR description.
