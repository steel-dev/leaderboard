import batch1 from "../data/model-research/browsecomp-1.json";
import batch2 from "../data/model-research/browsecomp-2.json";
import batch3 from "../data/model-research/browsecomp-3.json";
import batch4 from "../data/model-research/browsecomp-4.json";
import type { BenchmarkResultRow } from "./benchmark-hub";
import { buildModelRegistry, classifyBenchmarkRows } from "./model-registry";

export const browsecompResearch = [batch1, batch2, batch3, batch4];

export function getBrowsecompChartRows(rows: BenchmarkResultRow[]) {
  return classifyBenchmarkRows(rows, browsecompResearch, buildModelRegistry(browsecompResearch));
}
