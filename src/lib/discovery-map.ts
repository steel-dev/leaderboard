// ABOUTME: Single source of truth for discovery slug -> dataKey -> file resolution.
// ABOUTME: A benchmark's URL slug (meta.slug in benchmark-hub.ts) differs from its dataKey
// ABOUTME: (the sole top-level key in src/data/<dataKey>.json AND the export name in
// ABOUTME: src/data/index.ts AND the filename stem) for 4 of the 13 benchmarks:
// ABOUTME:   swe-bench-verified -> sweBenchVerified
// ABOUTME:   aider             -> aiderPolyglot
// ABOUTME:   online-mind2web   -> mind2web
// ABOUTME:   tau-bench         -> tauBench
// ABOUTME: Both discover-judge and discover-apply import this map so the resolution can never
// ABOUTME: drift between them. validateDiscoveryMap() asserts every page slug is mapped and
// ABOUTME: each data file's sole top-level key matches the dataKey — run it at the start of
// ABOUTME: both passes so a stale map fails loud, not silent.

import fs from "fs";
import path from "path";
import { getAllBenchmarkPages } from "./benchmark-hub.js";

const DATA_DIR = path.join(process.cwd(), "src", "data");

// URL slug -> dataKey (JSON top-level key + index.ts export name + filename stem).
export const BENCHMARK_SLUG_TO_DATA_KEY: Record<string, string> = {
  webvoyager: "webvoyager",
  browsecomp: "browsecomp",
  draco: "draco",
  webarena: "webarena",
  "swe-bench-verified": "sweBenchVerified",
  aider: "aiderPolyglot",
  osworld: "osworld",
  gaia: "gaia",
  clawbench: "clawbench",
  healthadminbench: "healthAdminBench",
  "online-mind2web": "mind2web",
  "tau-bench": "tauBench",
  agentbench: "agentBench",
};

export function dataKeyForSlug(slug: string): string | undefined {
  return BENCHMARK_SLUG_TO_DATA_KEY[slug];
}

export function dataFileForDataKey(dataKey: string): string {
  return path.join(DATA_DIR, `${dataKey}.json`);
}

export function dataFileForSlug(slug: string): string | undefined {
  const dataKey = dataKeyForSlug(slug);
  return dataKey ? dataFileForDataKey(dataKey) : undefined;
}

export interface DiscoveryMapProblem {
  slug: string;
  message: string;
}

// Asserts every page slug is mapped and each data file's sole top-level key === dataKey.
// Reads the files from disk (the actual files apply will edit), not the in-memory imports.
export function validateDiscoveryMap(): DiscoveryMapProblem[] {
  const problems: DiscoveryMapProblem[] = [];
  for (const page of getAllBenchmarkPages()) {
    const slug = page.meta.slug;
    const dataKey = BENCHMARK_SLUG_TO_DATA_KEY[slug];
    if (!dataKey) {
      problems.push({ slug, message: "no dataKey mapping in BENCHMARK_SLUG_TO_DATA_KEY" });
      continue;
    }
    const file = dataFileForDataKey(dataKey);
    if (!fs.existsSync(file)) {
      problems.push({ slug, message: `data file missing: ${file}` });
      continue;
    }
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      problems.push({ slug, message: `data file unparseable: ${(e as Error).message}` });
      continue;
    }
    const keys = Object.keys(parsed);
    if (keys.length !== 1 || keys[0] !== dataKey) {
      problems.push({
        slug,
        message: `data file top-level key(s) [${keys.join(", ")}] !== dataKey "${dataKey}"`,
      });
    }
  }
  return problems;
}
