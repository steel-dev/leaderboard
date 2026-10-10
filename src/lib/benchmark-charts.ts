import { browsecompResearch } from "./browsecomp-classification";
import { getBenchmarkPage, type BenchmarkResultRow } from "./benchmark-hub";
import { buildModelRegistry, classifyBenchmarkRows } from "./model-registry";
import type { ChartBenchmark } from "./model-classification";
import osworldResearch from "../data/model-research/osworld.json";
import webvoyagerResearch from "../data/model-research/webvoyager.json";
import webarenaResearch from "../data/model-research/webarena.json";

const researchByBenchmark: Record<string, unknown[]> = {
  browsecomp: browsecompResearch,
  webvoyager: [webvoyagerResearch],
  webarena: [webarenaResearch],
  osworld: [osworldResearch],
};

export const chartBenchmarkSlugs = Object.keys(researchByBenchmark);
const models = buildModelRegistry(Object.values(researchByBenchmark).flat());

export function getBenchmarkChartRows(slug: string, rows: BenchmarkResultRow[]) {
  const batches = researchByBenchmark[slug];
  return batches ? classifyBenchmarkRows(rows, batches, models) : null;
}

export function getChartBenchmarks(): ChartBenchmark[] {
  return chartBenchmarkSlugs.map((slug) => {
    const page = getBenchmarkPage(slug);
    if (!page) throw new Error(`Chart benchmark has no page: ${slug}`);
    return {
      slug,
      name: page.meta.name,
      description: page.meta.description,
      rows: classifyBenchmarkRows(page.results, researchByBenchmark[slug], models),
    };
  });
}
