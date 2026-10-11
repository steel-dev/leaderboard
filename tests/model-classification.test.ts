import assert from "node:assert/strict";
import { test } from "node:test";
import browsecomp from "../src/data/browsecomp.json";
import {
  blendedPrice,
  benchmarkChartHref,
  benchmarkResultHref,
  chartResultId,
  classifyModels,
  defaultFilters,
  filterResults,
  readChartFilters,
  readChartBenchmark,
  readChartResult,
  sizeFromParameters,
  sizeFromPrice,
  writeChartFilters,
  writeChartBenchmark,
  type ChartFilters,
  type ClassifiedResult,
  type ModelRecord,
} from "../src/lib/model-classification";
import { modelSchema } from "../src/lib/model-registry-schema";
import { buildModelRegistry, classifyBenchmarkRows } from "../src/lib/model-registry";
import {
  buildBandScale,
  buildYScale,
  computeBands,
  indexAtBand,
} from "../src/components/dither-kit/scales";
import { nextChartRevision } from "../src/components/dither-kit/chart-revision";

test("equivalent chart rows keep the animation revision while retaining the latest data", () => {
  const data = [
    { name: "First", open: 90, closed: 0 },
    { name: "Second", open: 0, closed: 80 },
  ];
  const initial = { data, token: 0, revision: 3 };
  const equivalent = data.map((row) => ({ closed: row.closed, name: row.name, open: row.open }));
  const next = nextChartRevision(initial, equivalent, 0);
  assert.equal(next.revision, 3);
  assert.equal(next.data, equivalent);
  assert.equal(nextChartRevision(next, equivalent, 0), next);
  assert.deepEqual(initial, { data, token: 0, revision: 3 });
});

test("chart value, label, row order, row count, and own-key changes replay the animation", () => {
  const data = [
    { name: "First", score: 90 },
    { name: "Second", score: 80 },
  ];
  const initial = { data, token: 0, revision: 3 };
  for (const changed of [
    [{ name: "First", score: 89 }, data[1]],
    [{ name: "Renamed", score: 90 }, data[1]],
    [...data].reverse(),
    data.slice(0, 1),
    [{ ...data[0], extra: undefined }, data[1]],
  ]) {
    assert.equal(nextChartRevision(initial, changed, 0).revision, 4);
  }
});

test("explicit replay tokens restart unchanged chart data", () => {
  const data = [{ name: "First", score: 90 }];
  const initial = { data, token: 0, revision: 3 };
  assert.equal(nextChartRevision(initial, data, 1).revision, 4);
  const equivalent = data.map((row) => ({ ...row }));
  assert.equal(nextChartRevision(initial, equivalent, 1).revision, 4);
});

test("chart comparison preserves nested identity and does not invoke accessors", () => {
  const nested = { score: 90 };
  const initial = { data: [{ name: "First", nested }], token: 0, revision: 3 };
  assert.equal(nextChartRevision(initial, [{ name: "First", nested }], 0).revision, 3);
  assert.equal(
    nextChartRevision(initial, [{ name: "First", nested: { score: 90 } }], 0).revision,
    4
  );
  const accessor = {
    get score() {
      throw new Error("Animation comparison must not evaluate getters");
    },
  };
  assert.equal(
    nextChartRevision({ data: [accessor], token: 0, revision: 3 }, [{ score: 90 }], 0).revision,
    4
  );
});

function model(overrides: Partial<ModelRecord> = {}): ModelRecord {
  return {
    id: "test-model",
    name: "Test model",
    weights: "open",
    totalParametersB: 30,
    size: "small",
    basis: "parameters",
    confidence: "high",
    notes: "Published model card.",
    sources: [{ title: "Model card", url: "https://example.com/model" }],
    checkedAt: "2026-10-10",
    ...overrides,
  };
}

function result(
  name: string,
  score: number | null,
  components: ModelRecord[],
  rank = 1
): ClassifiedResult {
  return {
    systemName: name,
    rank,
    organization: "Test organization",
    scoreValue: score,
    scoreDisplay: score === null ? "—" : `${score}%`,
    sourceUrl: "https://example.com/evaluation",
    notesShort: "Reported evaluation.",
    classification: {
      systemName: name,
      kind: "system",
      modelIds: components.map((component) => component.id),
      models: components,
      harnessCode: "open",
      notes: "Evaluated stack.",
      sources: [],
      ...classifyModels(components),
    },
  };
}

test("parameter categories honor each inclusive upper boundary", () => {
  for (const [parameters, expected] of [
    [0.5, "tiny"],
    [4, "tiny"],
    [4.0001, "small"],
    [40, "small"],
    [40.0001, "medium"],
    [150, "medium"],
    [150.0001, "large"],
    [2800, "large"],
  ] as const) {
    assert.equal(sizeFromParameters(parameters), expected);
  }
});

test("price categories use the 3:1 input/output blend and inclusive medium boundaries", () => {
  assert.equal(blendedPrice(0.2, 1.4), 0.5);
  assert.equal(sizeFromPrice(0, 0), "small");
  assert.equal(sizeFromPrice(0, 0.5996), "small");
  assert.equal(sizeFromPrice(0, 0.6), "medium");
  assert.equal(sizeFromPrice(0, 4), "medium");
  assert.equal(sizeFromPrice(0, 4.0004), "large");
  assert.equal(sizeFromPrice(1.75, 14), "large");
});

test("model validation rejects invalid evidence and nonphysical published counts", () => {
  assert.equal(modelSchema.safeParse(model()).success, true);
  for (const invalid of [
    { totalParametersB: 0 },
    { activeParametersB: -1 },
    { inputUsdPerMillion: -0.1 },
    { outputUsdPerMillion: Number.NaN },
    { sources: [] },
    { sources: [{ title: "Model card", url: "not-a-url" }] },
    { id: "Not A Model ID" },
    { activeParametersB: 31 },
    { parameterEstimateB: [40, 4] },
  ]) {
    assert.equal(modelSchema.safeParse({ ...model(), ...invalid }).success, false);
  }
});

test("stack size uses the largest total-parameter category, not active parameters or a sum", () => {
  const sparseLarge = model({ totalParametersB: 1000, activeParametersB: 3, size: "large" });
  assert.equal(classifyModels([sparseLarge]).size, "large");
  assert.equal(classifyModels([model(), model({ id: "second-small" })]).size, "small");
  const medium = model({ id: "medium", totalParametersB: 72, size: "medium" });
  assert.equal(classifyModels([model(), medium]).size, "medium");
  assert.equal(classifyModels([medium, model()]).size, "medium");
});

test("open weights require every component; uncertainty takes precedence over mixed", () => {
  const open = model();
  const closed = model({ id: "closed", weights: "closed" });
  const unknown = model({ id: "unknown", weights: "uncertain" });
  assert.equal(classifyModels([open, model({ id: "open-two" })]).weights, "open");
  assert.equal(classifyModels([closed]).weights, "closed");
  assert.equal(classifyModels([open, closed]).weights, "mixed");
  assert.equal(classifyModels([open, closed, unknown]).weights, "uncertain");
  assert.throws(() => classifyModels([]), /at least one model/);
});

test("estimated components retain the weakest confidence and an explicit estimate label", () => {
  const inferred = model({
    id: "inferred-stack",
    totalParametersB: undefined,
    size: "large",
    weights: "uncertain",
    basis: "estimate",
    confidence: "low",
  });
  assert.deepEqual(classifyModels([model(), inferred]), {
    size: "large",
    weights: "uncertain",
    basis: "estimate",
    confidence: "low",
  });
  assert.equal(classifyModels([model(), model({ confidence: "medium" })]).confidence, "medium");
});

test("the basis of equally sized mixed stacks is independent of component order", () => {
  const published = model({ size: "large", totalParametersB: 397 });
  const priced = model({
    id: "closed-proxy",
    size: "large",
    weights: "closed",
    totalParametersB: undefined,
    basis: "price",
    inputUsdPerMillion: 2,
    outputUsdPerMillion: 10,
  });
  assert.deepEqual(classifyModels([published, priced]), classifyModels([priced, published]));
  assert.equal(classifyModels([published, priced]).basis, "price");
  const smallerProxy = { ...priced, size: "small" as const };
  assert.equal(classifyModels([smallerProxy, published]).basis, "parameters");
});

test("weight and multi-size filters intersect while estimates remain in their assigned class", () => {
  const small = model();
  const large = model({ id: "large", totalParametersB: 397, size: "large" });
  const closed = model({ id: "closed", weights: "closed" });
  const unknown = model({
    id: "unknown",
    weights: "uncertain",
    basis: "estimate",
    size: "medium",
    totalParametersB: undefined,
    confidence: "low",
  });
  const rows = [
    result("Open small", 60, [small]),
    result("Open large", 90, [large]),
    result("Closed", 70, [closed]),
    result("Mixed", 80, [large, closed]),
    result("Estimated", 50, [unknown]),
  ];
  const names = (filters: ChartFilters) =>
    filterResults(rows, filters).map((row) => row.systemName);
  assert.deepEqual(names({ weights: "open", sizes: ["small", "large"] }), [
    "Open large",
    "Open small",
  ]);
  assert.deepEqual(names({ weights: "closed", sizes: [] }), ["Closed"]);
  assert.deepEqual(names({ weights: "other", sizes: [] }), ["Mixed", "Estimated"]);
  assert.deepEqual(names({ weights: "all", sizes: ["medium"] }), ["Estimated"]);
  assert.deepEqual(names({ weights: "open", sizes: ["tiny"] }), []);
});

test("results sort descending, preserve tie rank, retain missing scores last, and do not mutate input", () => {
  const rows = [
    result("Missing", null, [model()], 5),
    result("Lower", 1, [model()], 4),
    result("Tie later", 90, [model()], 3),
    result("Tie earlier", 90, [model()], 2),
    result("Zero", 0, [model()], 6),
  ];
  const inputOrder = rows.map((row) => row.systemName);
  assert.deepEqual(
    filterResults(rows, defaultFilters).map((row) => row.systemName),
    ["Tie earlier", "Tie later", "Lower", "Zero", "Missing"]
  );
  assert.deepEqual(
    rows.map((row) => row.systemName),
    inputOrder
  );
});

test("URL filters reject unsupported values and canonicalize duplicate or unordered sizes", () => {
  assert.deepEqual(readChartFilters(new URLSearchParams()), defaultFilters);
  assert.deepEqual(
    readChartFilters(new URLSearchParams("weights=unexpected&sizes=large,unknown,tiny,large")),
    { weights: "all", sizes: ["tiny", "large"] }
  );
  assert.deepEqual(readChartFilters(new URLSearchParams("weights=other&sizes=unknown")), {
    weights: "other",
    sizes: [],
  });
});

test("share URL roundtrips filters while preserving route, unrelated parameters and fragment", () => {
  const original = new URL(
    "https://leaderboard.steel.dev/leaderboards/browsecomp?utm_source=qa&weights=closed&sizes=large#chart-results"
  );
  const before = original.href;
  const next = writeChartFilters(original, { weights: "open", sizes: ["large", "small"] });
  assert.equal(original.href, before);
  assert.equal(next.pathname, "/leaderboards/browsecomp");
  assert.equal(next.searchParams.get("utm_source"), "qa");
  assert.equal(next.hash, "#chart-results");
  assert.deepEqual(readChartFilters(next.searchParams), {
    weights: "open",
    sizes: ["small", "large"],
  });
  const reset = writeChartFilters(next, defaultFilters);
  assert.equal(reset.searchParams.has("weights"), false);
  assert.equal(reset.searchParams.has("sizes"), false);
  assert.equal(reset.searchParams.get("utm_source"), "qa");
  assert.equal(reset.hash, "#chart-results");
});

test("restoring older and newer URLs reconstructs each historical filter state", () => {
  const start = new URL("https://leaderboard.steel.dev/leaderboards/browsecomp");
  const open = writeChartFilters(start, { weights: "open", sizes: [] });
  const small = writeChartFilters(open, { weights: "open", sizes: ["small"] });
  const other = writeChartFilters(small, { weights: "other", sizes: ["medium", "large"] });
  const history = [start, open, small, other];
  const restored = [3, 2, 1, 0, 1, 2, 3].map((index) =>
    readChartFilters(history[index].searchParams)
  );
  assert.deepEqual(restored, [
    { weights: "other", sizes: ["medium", "large"] },
    { weights: "open", sizes: ["small"] },
    { weights: "open", sizes: [] },
    defaultFilters,
    { weights: "open", sizes: [] },
    { weights: "open", sizes: ["small"] },
    { weights: "other", sizes: ["medium", "large"] },
  ]);
});

test("homepage benchmark switching retains filters and supports direct-link restoration", () => {
  const slugs = ["browsecomp", "webvoyager", "webarena", "osworld"];
  const original = new URL(
    "https://leaderboard.steel.dev/?weights=open&sizes=small,medium&utm_source=qa#performance"
  );
  const selected = writeChartBenchmark(original, "webarena");
  assert.equal(original.searchParams.has("benchmark"), false);
  assert.equal(readChartBenchmark(selected.searchParams, slugs), "webarena");
  assert.deepEqual(readChartFilters(selected.searchParams), {
    weights: "open",
    sizes: ["small", "medium"],
  });
  assert.equal(selected.hash, "#performance");
  assert.equal(selected.searchParams.get("utm_source"), "qa");
  const changed = writeChartFilters(selected, { weights: "closed", sizes: ["large"] });
  assert.equal(readChartBenchmark(changed.searchParams, slugs), "webarena");
  assert.equal(readChartBenchmark(new URLSearchParams("benchmark=invalid"), slugs), "browsecomp");
  assert.equal(readChartBenchmark(new URLSearchParams(), slugs), "browsecomp");
  assert.equal(
    benchmarkChartHref("webarena", readChartFilters(selected.searchParams)),
    "/leaderboards/webarena/?weights=open&sizes=small%2Cmedium"
  );
});

test("shared research rejects conflicting prices, invalid categories, and missing runtime models", () => {
  const priced = model({
    basis: "price",
    totalParametersB: undefined,
    inputUsdPerMillion: 0.01,
    outputUsdPerMillion: 0.1,
  });
  const batch = { models: [priced], submissions: [] };
  assert.throws(
    () =>
      buildModelRegistry([batch, { ...batch, models: [{ ...priced, outputUsdPerMillion: 0.2 }] }]),
    /Conflicting research/
  );
  assert.throws(
    () => buildModelRegistry([{ ...batch, models: [{ ...priced, size: "large" }] }]),
    /Invalid price classification/
  );
  assert.throws(
    () => buildModelRegistry([{ ...batch, models: [model({ size: "large" })] }]),
    /Invalid parameter classification/
  );
  const row = result("Harness", 70, [model()]);
  const submission = { ...row.classification, modelIds: ["unmapped-helper"] };
  assert.throws(
    () =>
      classifyBenchmarkRows(
        [row],
        [{ models: [], submissions: [submission] }],
        buildModelRegistry([batch])
      ),
    /Missing model: unmapped-helper/
  );
  assert.throws(
    () =>
      classifyBenchmarkRows(
        [row],
        [{ models: [], submissions: [submission, submission] }],
        buildModelRegistry([batch])
      ),
    /Duplicate submission/
  );
});

test("dither bar stacking retains percentage values and a fixed zero-to-100 axis", () => {
  const bands = computeBands(
    [
      { open: 0, closed: 92.2, uncertain: 0 },
      { open: 91.2, closed: 0, uncertain: 0 },
      { open: 0, closed: 0, uncertain: 0.6 },
    ],
    ["open", "closed", "uncertain"],
    "stacked"
  );
  assert.deepEqual(bands.bands.closed[0], [0, 92.2]);
  assert.deepEqual(bands.bands.open[1], [0, 91.2]);
  assert.deepEqual(bands.bands.uncertain[2], [0, 0.6]);
  const y = buildYScale(0, 100, 300);
  assert.equal(y(0), 300);
  assert.equal(y(100), 0);
  assert.equal(y(50), 150);
});

test("hover hit testing resolves the visible center of every bar across result limits", () => {
  for (const count of [1, 2, 20, 50, 100]) {
    const width = Math.max(580, count * 52 + 132) - 128;
    const band = buildBandScale(count, width);
    for (let index = 0; index < count; index++) {
      const center = (band(index) ?? 0) + band.bandwidth() / 2;
      assert.equal(indexAtBand(center, count, width), index);
    }
    assert.equal(indexAtBand(-100, count, width), 0);
    assert.equal(indexAtBand(width + 100, count, width), count - 1);
  }
});

test("all 100 BrowseComp results have supported research mappings without changing scores", async () => {
  const { getBrowsecompChartRows } = await import("../src/lib/browsecomp-classification");
  const rows = getBrowsecompChartRows(browsecomp.browsecomp);
  assert.equal(rows.length, 100);
  assert.equal(new Set(rows.map((row) => row.systemName)).size, 100);
  rows.forEach((row, index) => {
    const { classification, ...original } = row;
    assert.deepEqual(original, browsecomp.browsecomp[index]);
    assert.equal(classification.systemName, row.systemName);
    assert.ok(classification.models.length > 0);
    assert.deepEqual(
      classification.modelIds,
      classification.models.map((component) => component.id)
    );
    for (const component of classification.models) {
      assert.equal(modelSchema.safeParse(component).success, true);
      if (component.totalParametersB !== undefined) {
        assert.equal(component.basis, "parameters", component.id);
        assert.equal(component.size, sizeFromParameters(component.totalParametersB), component.id);
      }
    }
  });
  assert.throws(
    () =>
      getBrowsecompChartRows([
        ...browsecomp.browsecomp,
        { ...browsecomp.browsecomp[0], systemName: "Unresearched model" },
      ]),
    /Missing model research/
  );
  assert.throws(() => getBrowsecompChartRows(browsecomp.browsecomp.slice(1)), /no matching result/);
});

test("all four featured benchmarks have complete classifications and preserve every result field", async () => {
  const { getChartBenchmarks, getBenchmarkChartRows } = await import("../src/lib/benchmark-charts");
  const { getBenchmarkPage } = await import("../src/lib/benchmark-hub");
  const benchmarks = getChartBenchmarks();
  assert.deepEqual(
    benchmarks.map(({ slug }) => slug),
    ["browsecomp", "webvoyager", "webarena", "osworld"]
  );
  assert.deepEqual(
    benchmarks.map(({ rows }) => rows.length),
    [100, 21, 50, 23]
  );
  for (const benchmark of benchmarks) {
    const originals = getBenchmarkPage(benchmark.slug)!.results;
    assert.equal(new Set(benchmark.rows.map((row) => row.systemName)).size, originals.length);
    for (const [index, row] of benchmark.rows.entries()) {
      const { classification, ...resultFields } = row;
      assert.deepEqual(resultFields, originals[index]);
      assert.ok(classification.models.length > 0);
      assert.deepEqual(
        classification.modelIds,
        classification.models.map(({ id }) => id)
      );
      assert.ok(row.scoreValue === null || (row.scoreValue >= 0 && row.scoreValue <= 100));
      assert.deepEqual(
        {
          weights: classification.weights,
          size: classification.size,
          basis: classification.basis,
          confidence: classification.confidence,
        },
        classifyModels(classification.models)
      );
    }
    for (const size of [
      [],
      ["tiny"],
      ["small"],
      ["medium"],
      ["large"],
      ["small", "medium"],
    ] as ChartFilters["sizes"][]) {
      for (const weights of ["all", "open", "closed", "other"] as const) {
        const filtered = filterResults(benchmark.rows, { weights, sizes: size });
        for (const row of filtered) {
          if (weights === "open")
            assert.ok(row.classification.models.every(({ weights }) => weights === "open"));
          if (size.length) assert.ok(size.includes(row.classification.size));
        }
      }
    }
  }
  assert.equal(getBenchmarkChartRows("gaia", getBenchmarkPage("gaia")!.results), null);
});

test("benchmark result links preserve filters and target the exact system without ID collisions", () => {
  const names = ["Agent A/B", "Agent A B", "Agent A%20B", "模型 (試験) + 50% #1"];
  assert.equal(new Set(names.map(chartResultId)).size, names.length);
  for (const name of names) {
    const href = benchmarkResultHref("browsecomp", { weights: "open", sizes: ["small"] }, name);
    const url = new URL(href, "https://leaderboard.steel.dev");
    assert.equal(url.pathname, "/leaderboards/browsecomp/");
    assert.deepEqual(readChartFilters(url.searchParams), { weights: "open", sizes: ["small"] });
    assert.equal(decodeURIComponent(url.hash.slice(1)), chartResultId(name));
    assert.equal(readChartResult(url.hash), name);
  }
});

test("unrelated, empty, and malformed result fragments are ignored", () => {
  for (const hash of [
    "",
    "#chart-results",
    "#result-",
    "#result-%",
    "#result-%25",
    "#result-%FF",
  ]) {
    assert.equal(readChartResult(hash), null);
  }
});
