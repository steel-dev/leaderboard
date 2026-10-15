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

export type Classification = SubmissionRecord & {
  models: ModelRecord[];
  size: ModelSize;
  weights: Weights;
  basis: ModelRecord["basis"];
  confidence: ModelRecord["confidence"];
};

export interface ClassifiedResult extends BenchmarkResultRow {
  // null until model research for the row lands in src/data/model-research/.
  classification: Classification | null;
}

export interface ChartBenchmark {
  slug: string;
  name: string;
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
  // Only components in the largest category determine the stack's size, so only they set its basis.
  // Uncertainty in smaller helpers still lowers the confidence below.
  const sizing = models.filter((model) => model.size === largest.size);
  const basis = sizing.some((model) => model.basis === "estimate")
    ? "estimate"
    : sizing.some((model) => model.basis === "price")
      ? "price"
      : "parameters";
  const confidence = models.some((model) => model.confidence === "low")
    ? "low"
    : models.some((model) => model.confidence === "medium")
      ? "medium"
      : "high";
  return { size: largest.size, weights, basis, confidence } as const;
}

// Plain-language reason for a stack's size badge, naming the models that set its size class.
export function sizeBasisNote(c: Classification): string {
  const names = (basis: ModelRecord["basis"]) =>
    c.models
      .filter((model) => model.size === c.size && model.basis === basis)
      .map((model) => model.name)
      .join(", ");
  const note =
    c.basis === "estimate"
      ? `Estimated for ${names("estimate")}: no verified parameter count or standard token price, so the size class is provisional.`
      : c.basis === "price"
        ? `Price proxy: the size class comes from the standard token price of ${names("price")}; parameters are undisclosed.`
        : `Published size: from the parameter count of ${names("parameters")}.`;
  return c.models.length > 1
    ? `${note} Size reflects the largest of ${c.models.length} models; parameters are not summed.`
    : note;
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

export const defaultChartBenchmark = "webvoyager";

export function readChartBenchmark(params: URLSearchParams, slugs: readonly string[]): string {
  const requested = params.get("benchmark");
  return (
    slugs.find((slug) => slug === requested) ??
    slugs.find((slug) => slug === defaultChartBenchmark) ??
    slugs[0]
  );
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

export function chartResultId(systemName: string, occurrence = 1): string {
  // encodeURIComponent always escapes "/", so the suffix cannot collide with a system name.
  return `result-${encodeURIComponent(systemName)}${occurrence > 1 ? `/${occurrence}` : ""}`;
}

// One DOM id per row, in board order, so repeated system names still get distinct ids.
export function chartResultIds(rows: { systemName: string }[]): string[] {
  const seen = new Map<string, number>();
  return rows.map(({ systemName }) => {
    const occurrence = (seen.get(systemName) ?? 0) + 1;
    seen.set(systemName, occurrence);
    return chartResultId(systemName, occurrence);
  });
}

/**
 * Axis labels cut to `max` characters. Names that would collide once cut (variants of one
 * model) keep their last word instead: "Nemotron 3.5…74B-A9B-24GB" vs "Nemotron 3.5…74B-A9B-BF16".
 */
export function chartLabels(names: string[], max: number): string[] {
  const cut = names.map((name) => (name.length > max ? `${name.slice(0, max - 1)}…` : name));
  return names.map((name, index) => {
    const label = cut[index];
    if (name.length <= max || cut.indexOf(label) === cut.lastIndexOf(label)) return label;
    const lastWord = name.slice(name.lastIndexOf(" ") + 1);
    const tail = lastWord.length <= max - 9 ? lastWord : name.slice(-(max - 9));
    let head = name.slice(0, max - 1 - tail.length);
    if (name[head.length] !== " " && head.includes(" "))
      head = head.slice(0, head.lastIndexOf(" "));
    return `${head.trimEnd()}…${tail}`;
  });
}

export function benchmarkResultHref(slug: string, filters: ChartFilters, resultId: string): string {
  // Encode the ID again for the URL fragment so native anchor navigation resolves it.
  return `${benchmarkChartHref(slug, filters)}#${encodeURIComponent(resultId)}`;
}

export function readChartResult(hash: string): string | null {
  try {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const match = /^result-([^/]+)(?:\/(?:[2-9]|[1-9]\d+))?$/.exec(id);
    if (!match) return null;
    decodeURIComponent(match[1]); // Rejects ids whose name part is not valid percent-encoding.
    return id;
  } catch {
    return null;
  }
}

export function filterResults(rows: ClassifiedResult[], filters: ChartFilters): ClassifiedResult[] {
  return rows
    .filter(({ classification: c }) => {
      // Unclassified rows have unknown weights and size: they count as uncertain and match no size.
      const weights = c?.weights ?? "uncertain";
      return (
        (filters.weights === "all" ||
          (filters.weights === "other"
            ? weights === "mixed" || weights === "uncertain"
            : weights === filters.weights)) &&
        (!filters.sizes.length || (c !== null && filters.sizes.includes(c.size)))
      );
    })
    .sort((a, b) => (b.scoreValue ?? -Infinity) - (a.scoreValue ?? -Infinity) || a.rank - b.rank);
}
