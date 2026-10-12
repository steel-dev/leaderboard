import { getBenchmarkPage, type BenchmarkResultRow } from "./benchmark-hub";
import {
  buildModelRegistry,
  classifyBenchmarkRows,
  findResearchGaps,
  parseResearchBatches,
} from "./model-registry";
import type { ChartBenchmark } from "./model-classification";
import browsecompResearch1 from "../data/model-research/browsecomp-1.json";
import browsecompResearch2 from "../data/model-research/browsecomp-2.json";
import browsecompResearch3 from "../data/model-research/browsecomp-3.json";
import browsecompResearch4 from "../data/model-research/browsecomp-4.json";
import osworldResearch from "../data/model-research/osworld.json";
import webvoyagerResearch from "../data/model-research/webvoyager.json";
import webarenaResearch from "../data/model-research/webarena.json";

// Parsed once per build; every chart page and the homepage share the same registry.
const researchByBenchmark: Record<string, ReturnType<typeof parseResearchBatches>> = {
  browsecomp: parseResearchBatches([
    browsecompResearch1,
    browsecompResearch2,
    browsecompResearch3,
    browsecompResearch4,
  ]),
  webvoyager: parseResearchBatches([webvoyagerResearch]),
  webarena: parseResearchBatches([webarenaResearch]),
  osworld: parseResearchBatches([osworldResearch]),
};

export const chartBenchmarkSlugs = Object.keys(researchByBenchmark);
const models = buildModelRegistry(Object.values(researchByBenchmark).flat());
const reportedGaps = new Set<string>();

function classify(slug: string, rows: BenchmarkResultRow[]) {
  const batches = researchByBenchmark[slug];
  if (!reportedGaps.has(slug)) {
    reportedGaps.add(slug);
    const { unresearched, orphaned } = findResearchGaps(rows, batches);
    if (unresearched.length)
      console.warn(
        `[charts] ${slug}: no model research for ${unresearched.join(", ")}; shown as unclassified.`
      );
    if (orphaned.length)
      console.warn(
        `[charts] ${slug}: model research has no matching result: ${orphaned.join(", ")}`
      );
  }
  return classifyBenchmarkRows(rows, batches, models);
}

export function getBenchmarkChartRows(slug: string, rows: BenchmarkResultRow[]) {
  return researchByBenchmark[slug] ? classify(slug, rows) : null;
}

export function getChartBenchmarks(): ChartBenchmark[] {
  return chartBenchmarkSlugs.map((slug) => {
    const page = getBenchmarkPage(slug);
    if (!page) throw new Error(`Chart benchmark has no page: ${slug}`);
    return { slug, name: page.meta.name, rows: classify(slug, page.results) };
  });
}

export function getChartResearchGaps(slug: string, rows: BenchmarkResultRow[]) {
  const batches = researchByBenchmark[slug];
  return batches ? findResearchGaps(rows, batches) : null;
}
