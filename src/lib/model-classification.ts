import type { ModelRecord, SubmissionRecord } from "./model-registry-schema";
export type { ModelRecord, SubmissionRecord } from "./model-registry-schema";
import type { BenchmarkResultRow } from "./benchmark-hub";

export const sizes = ["tiny", "small", "medium", "large"] as const;
export type ModelSize = (typeof sizes)[number];
export const sizeLabels: Record<ModelSize, string> = {
  tiny: "Tiny",
  small: "Small",
  medium: "Medium",
  large: "Large",
};
export const sizeDescriptions: Record<ModelSize, string> = {
  tiny: "≤4B parameters",
  small: ">4–40B parameters, or token price below $0.15/M",
  medium: ">40–150B parameters, or token price $0.15–$1/M",
  large: ">150B parameters, or token price above $1/M",
};
export const weightLabels = {
  open: "Open weights",
  closed: "Closed weights",
  mixed: "Mixed weights",
  uncertain: "Uncertain weights",
} as const;
export type Weights = keyof typeof weightLabels;
export type WeightFilter = "all" | "open" | "closed" | "other";
export const basisLabels = {
  parameters: "Published size",
  price: "Price proxy",
  estimate: "Estimated",
} as const;

export interface ClassifiedResult extends BenchmarkResultRow {
  classification: SubmissionRecord & {
    models: ModelRecord[];
    size: ModelSize;
    weights: Weights;
    basis: ModelRecord["basis"];
    confidence: ModelRecord["confidence"];
  };
}

export interface ChartBenchmark {
  slug: string;
  name: string;
  description: string;
  rows: ClassifiedResult[];
}

export function sizeFromParameters(parametersB: number): ModelSize {
  if (parametersB <= 4) return "tiny";
  if (parametersB <= 40) return "small";
  if (parametersB <= 150) return "medium";
  return "large";
}

export function blendedPrice(input: number, output: number): number {
  return (3 * input + output) / 4;
}

export function sizeFromPrice(input: number, output: number): ModelSize {
  const price = blendedPrice(input, output);
  return price < 0.15 ? "small" : price <= 1 ? "medium" : "large";
}

export function classifyModels(models: ModelRecord[]) {
  if (!models.length)
    throw new Error("A submission must identify at least one model or inferred stack.");
  const largest = models.reduce((a, b) => (sizes.indexOf(a.size) >= sizes.indexOf(b.size) ? a : b));
  const weights: Weights = models.some((model) => model.weights === "uncertain")
    ? "uncertain"
    : models.every((model) => model.weights === "open")
      ? "open"
      : models.every((model) => model.weights === "closed")
        ? "closed"
        : "mixed";
  const basis = models.some((model) => model.basis === "estimate")
    ? "estimate"
    : models.some((model) => model.size === largest.size && model.basis === "price")
      ? "price"
      : "parameters";
  const confidence = models.some((model) => model.confidence === "low")
    ? "low"
    : models.some((model) => model.confidence === "medium")
      ? "medium"
      : "high";
  return { size: largest.size, weights, basis, confidence } as const;
}

export interface ChartFilters {
  weights: WeightFilter;
  sizes: ModelSize[];
}
export const defaultFilters: ChartFilters = { weights: "all", sizes: [] };

export function readChartFilters(params: URLSearchParams): ChartFilters {
  const weights = params.get("weights");
  return {
    weights: weights === "open" || weights === "closed" || weights === "other" ? weights : "all",
    sizes: sizes.filter((size) => params.get("sizes")?.split(",").includes(size)),
  };
}

export function writeChartFilters(url: URL, filters: ChartFilters): URL {
  const next = new URL(url);
  next.searchParams.delete("weights");
  next.searchParams.delete("sizes");
  if (filters.weights !== "all") next.searchParams.set("weights", filters.weights);
  const selected = sizes.filter((size) => filters.sizes.includes(size));
  if (selected.length) next.searchParams.set("sizes", selected.join(","));
  return next;
}

export function readChartBenchmark(params: URLSearchParams, slugs: readonly string[]): string {
  const requested = params.get("benchmark");
  return slugs.find((slug) => slug === requested) ?? slugs[0];
}

export function writeChartBenchmark(url: URL, slug: string): URL {
  const next = new URL(url);
  next.searchParams.set("benchmark", slug);
  return next;
}

export function benchmarkChartHref(slug: string, filters: ChartFilters): string {
  const url = writeChartFilters(
    new URL(`/leaderboards/${slug}/`, "https://leaderboard.steel.dev"),
    filters
  );
  return `${url.pathname}${url.search}`;
}

export function filterResults(rows: ClassifiedResult[], filters: ChartFilters): ClassifiedResult[] {
  return rows
    .filter(
      ({ classification: c }) =>
        (filters.weights === "all" ||
          (filters.weights === "other"
            ? c.weights === "mixed" || c.weights === "uncertain"
            : c.weights === filters.weights)) &&
        (!filters.sizes.length || filters.sizes.includes(c.size))
    )
    .sort((a, b) => (b.scoreValue ?? -Infinity) - (a.scoreValue ?? -Infinity) || a.rank - b.rank);
}
