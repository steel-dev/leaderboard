// ABOUTME: Central config for the Atlas callout — Steel's open-source research agent.
// ABOUTME: Holds the CTA link, copy, and the per-benchmark notes for callout placement.

export const ATLAS_REPO_URL = "https://github.com/steel-dev/atlas";

export const ATLAS_INSTALL = "npm install @steel-dev/atlas";

// Slugs that show the contextual Atlas callout, with a benchmark-specific line.
// Atlas ships BrowseComp and DRACO evals; GAIA gets an open-web-reach line.
export const atlasBenchmarkNotes: Record<string, string> = {
  browsecomp:
    "It ships with a BrowseComp eval, so you can benchmark your own build on the same tasks.",
  draco: "It ships with a DRACO eval, so you can benchmark your own build on the same tasks.",
  gaia: "It reaches JavaScript-rendered and login-gated pages through Steel, with multiple search providers built in.",
};

export function getAtlasNote(slug: string): string | undefined {
  return atlasBenchmarkNotes[slug];
}
