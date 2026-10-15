import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BarChart } from "./dither-kit/bar-chart";
import { Bar } from "./dither-kit/bar";
import ModelSizePicker from "./ModelSizePicker";
import { useChart, type ChartConfig } from "./dither-kit/chart-context";
import {
  basisLabels,
  benchmarkChartHref,
  benchmarkResultHref,
  blendedPrice,
  chartLabels,
  chartResultIds,
  defaultFilters,
  filterResults,
  readChartFilters,
  readChartResult,
  sizeBasisNote,
  sizeLabels,
  weightLabels,
  writeChartFilters,
  writeChartBenchmark,
  type ChartFilters,
  type ClassifiedResult,
  type ModelRecord,
  type WeightFilter,
} from "../lib/model-classification";
import "../styles/leaderboard-chart.css";

const chartConfig: ChartConfig = {
  open: { label: "Open weights", color: "steel" },
  closed: { label: "Closed weights", color: "stone" },
  mixed: { label: "Mixed weights", color: "warm" },
  uncertain: { label: "Uncertain weights", color: "warm" },
};
const weightOptions: { value: WeightFilter; label: string }[] = [
  { value: "all", label: "All weights" },
  { value: "open", label: "Open weights" },
  { value: "closed", label: "Closed weights" },
  { value: "other", label: "Mixed / uncertain" },
];
const kindLabels = { model: "Model", harness: "Harness", system: "System" };
const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });

function ModelEvidence({ model }: { model: ModelRecord }) {
  const price =
    model.inputUsdPerMillion !== undefined && model.outputUsdPerMillion !== undefined
      ? blendedPrice(model.inputUsdPerMillion, model.outputUsdPerMillion)
      : undefined;
  return (
    <div className="chart-model-evidence">
      <h5>{model.name}</h5>
      <p className="chart-model-facts">
        {weightLabels[model.weights]} · {sizeLabels[model.size]} · {basisLabels[model.basis]}
        {model.totalParametersB !== undefined && (
          <> · {model.totalParametersB.toLocaleString()}B total</>
        )}
        {model.activeParametersB !== undefined && (
          <> · {model.activeParametersB.toLocaleString()}B active</>
        )}
        {model.parameterEstimateB && (
          <> · estimated {model.parameterEstimateB.join("–")}B parameters</>
        )}
      </p>
      {price !== undefined && (
        <p>
          Token price: ${money.format(model.inputUsdPerMillion!)} input / $
          {money.format(model.outputUsdPerMillion!)} output per million. Blended 3:1: $
          {money.format(price)}/M.
        </p>
      )}
      <p>{model.notes}</p>
      <ul className="chart-source-list">
        {model.sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
      <p className="chart-evidence-date">
        Checked {model.checkedAt} · {model.confidence} confidence
      </p>
    </div>
  );
}

const unclassifiedLabel = "Unclassified";

function ClassificationBadges({ row }: { row: ClassifiedResult }) {
  const c = row.classification;
  if (!c)
    return (
      <span className="chart-badges">
        <span className="chart-weight-tag chart-weight-uncertain">{unclassifiedLabel}</span>
      </span>
    );
  // The full note stays in the row details for keyboard and touch users; the title is a shortcut.
  const note = sizeBasisNote(c);
  return (
    <span className="chart-badges">
      <span className={`chart-weight-tag chart-weight-${c.weights}`}>
        {weightLabels[c.weights]}
      </span>
      <span className="chart-size-tag" title={note}>
        {sizeLabels[c.size]}
      </span>
      {c.basis !== "parameters" && (
        <span className="chart-basis-tag" title={note}>
          {basisLabels[c.basis]}
        </span>
      )}
      {c.models.length > 1 && (
        <span className="chart-basis-tag" title={note}>
          Largest component
        </span>
      )}
    </span>
  );
}

function ResearchDetails({ row }: { row: ClassifiedResult }) {
  const c = row.classification;
  if (!c)
    return (
      <div className="chart-research-details">
        <p>
          Model research for this result is pending, so its weights and size are not classified yet.
        </p>
      </div>
    );
  return (
    <div className="chart-research-details">
      <p>{c.notes}</p>
      <p>
        Harness code:{" "}
        {c.harnessCode === "not-applicable" ? "not separately classified" : c.harnessCode}.{" "}
        {sizeBasisNote(c)}
      </p>
      {c.sources.length > 0 && (
        <ul className="chart-source-list">
          {c.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      {c.models.map((model) => (
        <ModelEvidence key={model.id} model={model} />
      ))}
    </div>
  );
}

type ChartPreview = {
  index: number;
  target: SVGRectElement;
  anchor: { left: number; right: number; top: number };
};

function ChartHoverCard({
  row,
  metricLabel,
  preview,
  onKeepOpen,
  onLeave,
  onDetails,
  detailsHref,
}: {
  row: ClassifiedResult;
  metricLabel: string;
  preview: ChartPreview;
  onKeepOpen: () => void;
  onLeave: () => void;
  onDetails: () => void;
  detailsHref?: string;
}) {
  const c = row.classification;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useLayoutEffect(() => {
    const card = ref.current;
    if (!card) return;
    const { width, height } = card.getBoundingClientRect();
    const { anchor } = preview;
    // Touch the hit target's edge so the pointer cannot enter an adjacent bar
    // while crossing to the card. The target already pads the painted bar.
    const right = anchor.right;
    setPosition({
      left: Math.max(
        12,
        Math.min(
          right + width <= window.innerWidth - 12 ? right : anchor.left - width,
          window.innerWidth - width - 12
        )
      ),
      top: Math.max(12, Math.min(anchor.top, window.innerHeight - height - 12)),
    });
  }, [preview]);
  return (
    <div
      ref={ref}
      id="chart-hover-card"
      className="chart-hover-card"
      role="dialog"
      aria-labelledby="chart-hover-title"
      style={position}
      onPointerEnter={onKeepOpen}
      onPointerLeave={onLeave}
      onFocus={onKeepOpen}
      onBlur={onLeave}
    >
      <h3 id="chart-hover-title">{row.systemName}</h3>
      <dl>
        <div>
          <dt>{metricLabel}</dt>
          <dd className="chart-hover-score">{row.scoreDisplay}</dd>
        </div>
        {c ? (
          <>
            <div>
              <dt>Model weights</dt>
              <dd>{weightLabels[c.weights]}</dd>
            </div>
            <div>
              <dt>Model size</dt>
              <dd>{sizeLabels[c.size]}</dd>
            </div>
            <div>
              <dt>Size basis</dt>
              <dd>{basisLabels[c.basis]}</dd>
            </div>
          </>
        ) : (
          <div>
            <dt>Model class</dt>
            <dd>{unclassifiedLabel}</dd>
          </div>
        )}
      </dl>
      {c && (c.basis !== "parameters" || c.models.length > 1) && (
        <p className="chart-hover-note">{sizeBasisNote(c)}</p>
      )}
      {detailsHref ? (
        <a className="chart-hover-details" href={detailsHref}>
          More details <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <button className="chart-hover-details" type="button" onClick={onDetails}>
          More details <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}

function classLabel(row: ClassifiedResult): string {
  const c = row.classification;
  return c
    ? `${weightLabels[c.weights]}, ${sizeLabels[c.size]}, ${basisLabels[c.basis]}`
    : unclassifiedLabel;
}

function ChartMarks({
  rows,
  rowIds,
  compact,
  activeIndex,
  previewIndex,
  onPreview,
  onLeave,
  onDetails,
}: {
  rows: ClassifiedResult[];
  rowIds: string[];
  compact: boolean;
  activeIndex: number;
  previewIndex: number | null;
  onPreview: (index: number, target: SVGRectElement, top: number) => void;
  onLeave: () => void;
  onDetails: (index: number) => void;
}) {
  const chart = useChart();
  const bars = useRef<(SVGRectElement | null)[]>([]);
  const pointerType = useRef("");
  if (!chart.ready) return null;
  const labels = chartLabels(
    rows.map(({ systemName }) => systemName),
    compact ? 22 : 25
  );
  return (
    <g>
      <g aria-hidden="true">
        {[0, 20, 40, 60, 80, 100].map((tick) => (
          <g key={tick}>
            <line
              x1={0}
              x2={chart.plot.width}
              y1={chart.y(tick)}
              y2={chart.y(tick)}
              className="chart-gridline"
            />
            <text
              x={-12}
              y={chart.y(tick)}
              textAnchor="end"
              dominantBaseline="central"
              className="chart-y-tick"
            >
              {tick}
            </text>
          </g>
        ))}
      </g>
      {rows.map((row, index) => {
        const x = chart.xCenter(index);
        const top = chart.y(row.scoreValue ?? 0);
        const slot = chart.barSlot(index, 0, 1);
        const active = previewIndex === index;
        return (
          <g key={rowIds[index]}>
            <text
              x={x}
              y={top - 11}
              textAnchor="middle"
              className={`chart-score-label${active ? " is-active" : ""}`}
              aria-hidden="true"
            >
              {row.scoreDisplay}
            </text>
            <text
              transform={`translate(${x + 3},${chart.plot.height + 19}) rotate(${compact ? -58 : -52})`}
              textAnchor="end"
              className={`chart-x-label${active ? " is-active" : ""}`}
              aria-hidden="true"
            >
              {labels[index]}
            </text>
            <rect
              ref={(element) => {
                bars.current[index] = element;
              }}
              x={slot.x - 4}
              y={0}
              width={slot.width + 8}
              height={chart.plot.height + 8}
              fill="transparent"
              className={`chart-bar-target${active ? " is-active" : ""}`}
              role="button"
              tabIndex={activeIndex === index ? 0 : -1}
              aria-label={`${row.systemName}, ${row.scoreDisplay}, ${classLabel(row)}. Show result details.`}
              aria-haspopup="dialog"
              aria-expanded={active}
              aria-controls={active ? "chart-hover-card" : undefined}
              onPointerDown={(event) => {
                pointerType.current = event.pointerType;
              }}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") onPreview(index, event.currentTarget, top);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== "touch") onLeave();
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  onPreview(index, event.currentTarget, top);
              }}
              onBlur={onLeave}
              onClick={(event) => {
                if (pointerType.current === "touch") onPreview(index, event.currentTarget, top);
                else onDetails(index);
              }}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight" || event.key === "ArrowDown")
                  next = Math.min(rows.length - 1, index + 1);
                else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
                  next = Math.max(0, index - 1);
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = rows.length - 1;
                else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onDetails(index);
                  return;
                } else return;
                event.preventDefault();
                const target = bars.current[next];
                target?.focus({ preventScroll: true });
                target?.scrollIntoView({ block: "nearest", inline: "nearest" });
                // Measure after scrolling so off-screen results get a correctly anchored card.
                requestAnimationFrame(() => {
                  if (target?.isConnected)
                    onPreview(next, target, chart.y(rows[next].scoreValue ?? 0));
                });
              }}
            />
          </g>
        );
      })}
    </g>
  );
}

export default function LeaderboardExplorer({
  rows,
  benchmark,
  scope,
  benchmarkSlug,
  benchmarkOptions,
  onBenchmarkChange,
  tablePreviewCount = 20,
  showResults = true,
  compact = false,
}: {
  rows: ClassifiedResult[];
  benchmark: string;
  scope?: string;
  benchmarkSlug?: string;
  benchmarkOptions?: { slug: string; name: string }[];
  onBenchmarkChange?: (slug: string) => void;
  tablePreviewCount?: number;
  showResults?: boolean;
  compact?: boolean;
}) {
  const metricLabel = `${benchmark} score`;
  const [filters, setFilters] = useState<ChartFilters>(defaultFilters);
  const currentFilters = useRef<ChartFilters>(defaultFilters);
  const [limit, setLimit] = useState(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<ChartPreview | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const resultIds = useMemo(() => {
    const ids = chartResultIds(rows);
    return new Map(rows.map((row, index) => [row, ids[index]]));
  }, [rows]);
  const idOf = (row: ClassifiedResult) => resultIds.get(row)!;

  useEffect(() => {
    const restore = (preserveSectionState: boolean) => {
      const nextFilters = readChartFilters(new URLSearchParams(window.location.search));
      const result = showResults ? readChartResult(window.location.hash) : null;
      const detail = filterResults(rows, nextFilters).find((row) => resultIds.get(row) === result);
      const filtersChanged =
        nextFilters.weights !== currentFilters.current.weights ||
        nextFilters.sizes.join(",") !== currentFilters.current.sizes.join(",");
      if (preserveSectionState && !detail && !filtersChanged) return;
      currentFilters.current = nextFilters;
      setFilters(nextFilters);
      setSelectedId(null);
      setPreview(null);
      setExpanded(Boolean(detail));
      setDetailId(detail ? (resultIds.get(detail) ?? null) : null);
    };
    const onHistory = () => restore(true);
    const onHash = () => restore(true);
    restore(false);
    window.addEventListener("popstate", onHistory);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("hashchange", onHash);
    };
  }, [rows, resultIds, showResults]);

  const filtered = useMemo(() => filterResults(rows, filters), [rows, filters]);
  const plotted = useMemo(
    () => filtered.filter((row) => row.scoreValue !== null).slice(0, limit),
    [filtered, limit]
  );
  const chartData = useMemo(
    () =>
      plotted.map((row) => ({
        name: row.systemName,
        open: row.classification?.weights === "open" ? row.scoreValue : 0,
        closed: row.classification?.weights === "closed" ? row.scoreValue : 0,
        mixed: row.classification?.weights === "mixed" ? row.scoreValue : 0,
        // Unclassified rows plot with the uncertain series until their research lands.
        uncertain:
          (row.classification?.weights ?? "uncertain") === "uncertain" ? row.scoreValue : 0,
      })),
    [plotted]
  );
  const plottedIds = plotted.map(idOf);
  const selectedIndex = Math.max(0, plottedIds.indexOf(selectedId ?? ""));
  const active = preview ? plotted[preview.index] : null;
  const tableRows = benchmarkSlug && !expanded ? filtered.slice(0, tablePreviewCount) : filtered;
  const isFiltered = filters.weights !== "all" || filters.sizes.length > 0;

  const updateFilters = (next: ChartFilters) => {
    currentFilters.current = next;
    setFilters(next);
    setSelectedId(null);
    setPreview(null);
    setExpanded(false);
    setShareStatus("");
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    let url = writeChartFilters(new URL(window.location.href), next);
    if (readChartResult(url.hash)) url.hash = "";
    if (benchmarkSlug) url = writeChartBenchmark(url, benchmarkSlug);
    window.history.pushState(null, "", url);
  };
  const keepPreviewOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const hidePreviewSoon = () => {
    keepPreviewOpen();
    closeTimer.current = setTimeout(() => {
      if (document.activeElement?.closest(".chart-hover-card")) return;
      setPreview((current) => (current?.target === document.activeElement ? current : null));
    }, 140);
  };
  const showPreview = (index: number, target: SVGRectElement, top: number) => {
    keepPreviewOpen();
    const rect = target.getBoundingClientRect();
    setSelectedId(plottedIds[index] ?? null);
    setPreview({
      index,
      target,
      anchor: { left: rect.left, right: rect.right, top: rect.top + top },
    });
  };
  const showDetails = (index: number) => {
    const row = plotted[index];
    if (!row) return;
    if (!showResults && benchmarkSlug) {
      window.location.assign(benchmarkResultHref(benchmarkSlug, filters, idOf(row)));
      return;
    }
    keepPreviewOpen();
    setPreview(null);
    setExpanded(true);
    window.history.pushState(null, "", `#${encodeURIComponent(idOf(row))}`);
    setDetailId(idOf(row));
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );
  useEffect(() => {
    if (!detailId) return;
    const row = Array.from(tableRef.current?.rows ?? []).find((row) => row.id === detailId);
    const details = row?.querySelector("details");
    if (details) {
      details.open = true;
      details.querySelector("summary")?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: "start" });
    }
    setDetailId(null);
  }, [detailId]);
  useEffect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        preview.target.focus({ preventScroll: true });
        setPreview(null);
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest(".chart-hover-card, .chart-bar-target")
      )
        setPreview(null);
    };
    const onScroll = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".chart-hover-card"))
        setPreview(null);
    };
    const onResize = () => setPreview(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [preview]);

  return (
    <div
      className={`leaderboard-explorer${compact ? " leaderboard-explorer--compact" : ""}`}
      data-benchmark={benchmark}
    >
      <section className="chart-shell" aria-labelledby="chart-title">
        <header className="lb-module-head chart-table-heading chart-heading">
          <h2 id="chart-title">Scores</h2>
          <div className="lb-head-lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>
        <div className="chart-toolbar">
          {benchmarkOptions ? (
            <div className="chart-benchmark-control">
              <h3 className="chart-benchmark-title">{benchmark} scores</h3>
              <svg width="16" height="16" viewBox="0 0 12 12" aria-hidden="true">
                <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <select
                aria-label="Benchmark"
                value={benchmarkSlug}
                onChange={(event) => onBenchmarkChange?.(event.target.value)}
              >
                {benchmarkOptions.map((option) => (
                  <option value={option.slug} key={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <h3 className="chart-benchmark-title">{benchmark} scores</h3>
          )}
          <div className="chart-filters">
            <label className="chart-weights-control">
              <span className="sr-only">Model weights</span>
              <select
                value={filters.weights}
                onChange={(event) =>
                  updateFilters({ ...filters, weights: event.target.value as WeightFilter })
                }
              >
                {weightOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <ModelSizePicker
              selected={filters.sizes}
              onChange={(selected) => updateFilters({ ...filters, sizes: selected })}
            />
            <label className="chart-limit-control">
              <span className="sr-only">Show</span>
              <select
                aria-label="Number of chart results"
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPreview(null);
                }}
              >
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
                <option value={10000}>All results</option>
              </select>
            </label>
            <div className="chart-filter-actions">
              {isFiltered && (
                <button
                  className="chart-reset-button"
                  aria-label="Reset filters"
                  type="button"
                  onClick={() => updateFilters(defaultFilters)}
                >
                  Reset
                </button>
              )}
              <a
                href={benchmarkSlug ? benchmarkChartHref(benchmarkSlug, filters) : "#chart-results"}
                className="chart-table-link"
                aria-label={benchmarkSlug ? "Full leaderboard" : "View results"}
                title={benchmarkSlug ? "Full leaderboard" : "View results"}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M3 15h18M9 3v18" />
                </svg>
              </a>
              <button
                type="button"
                className="chart-share-button"
                aria-label={shareStatus || "Share view"}
                title={shareStatus || "Share view"}
                onClick={async () => {
                  try {
                    const url = benchmarkSlug
                      ? writeChartBenchmark(new URL(window.location.href), benchmarkSlug).href
                      : window.location.href;
                    await navigator.clipboard.writeText(url);
                    setShareStatus("Link copied");
                  } catch {
                    setShareStatus("Use the page URL to share this view.");
                  }
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {shareStatus === "Link copied" ? (
                    <path d="m5 12 4 4L19 6" />
                  ) : (
                    <>
                      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2" />
                      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            <span className="sr-only" role="status">
              {shareStatus}
            </span>
          </div>
        </div>
        <div className="chart-plot">
          {plotted.length ? (
            <>
              <div className="chart-scroll" ref={scrollRef}>
                <div
                  className="chart-canvas-frame"
                  style={{
                    width: `max(100%, ${
                      compact
                        ? Math.max(440, plotted.length * 38 + 76)
                        : Math.max(580, plotted.length * 46 + 132)
                    }px)`,
                  }}
                >
                  <BarChart
                    data={chartData}
                    config={chartConfig}
                    stackType="stacked"
                    yDomain={[0, 100]}
                    margins={
                      compact
                        ? { top: 26, right: 16, bottom: 130, left: 60 }
                        : { top: 30, right: 24, bottom: 164, left: 104 }
                    }
                    animationDuration={550}
                    bloom="off"
                    markerIndex={preview?.index ?? null}
                    interactive={false}
                    ariaLabel={`${metricLabel}, percent. Use left and right arrow keys to explore results.`}
                  >
                    <Bar dataKey="open" variant="gradient" />
                    <Bar dataKey="closed" variant="gradient" />
                    <Bar dataKey="mixed" variant="hatched" />
                    <Bar dataKey="uncertain" variant="hatched" />
                    <ChartMarks
                      rows={plotted}
                      rowIds={plottedIds}
                      compact={compact}
                      activeIndex={selectedIndex}
                      previewIndex={preview?.index ?? null}
                      onPreview={showPreview}
                      onLeave={hidePreviewSoon}
                      onDetails={showDetails}
                    />
                  </BarChart>
                </div>
              </div>
              <div className="chart-legend" aria-label="Bar colors">
                <span>
                  <i className="legend-open" />
                  Open weights
                </span>
                <span>
                  <i className="legend-closed" />
                  Closed weights
                </span>
                <span>
                  <i className="legend-uncertain" />
                  Mixed / uncertain
                </span>
              </div>
              {preview && active && (
                <ChartHoverCard
                  row={active}
                  metricLabel={metricLabel}
                  preview={preview}
                  onKeepOpen={keepPreviewOpen}
                  onLeave={hidePreviewSoon}
                  onDetails={() => showDetails(preview.index)}
                  detailsHref={
                    !showResults && benchmarkSlug
                      ? benchmarkResultHref(benchmarkSlug, filters, idOf(active))
                      : undefined
                  }
                />
              )}
            </>
          ) : (
            <div className="chart-empty">
              <p>No systems match these filters.</p>
              <span>Try another size category or include more weight types.</span>
              <button type="button" onClick={() => updateFilters(defaultFilters)}>
                Show all systems
              </button>
            </div>
          )}
        </div>
        <details className="chart-methodology">
          <summary>How model sizes and weights are classified</summary>
          <div>
            <p>
              Size classes follow the Artificial Analysis categories: Tiny ≤4B; Small &gt;4–40B;
              Medium &gt;40–150B; Large &gt;150B total parameters. Active MoE parameters are
              reported separately.
            </p>
            <p>
              When parameters are unavailable, we use standard uncached token prices with a 3:1
              input/output blend: Small &lt;$0.15/M, Medium $0.15–$1/M, Large &gt;$1/M. “Price
              proxy” is a pricing category, not a parameter estimate. “Estimated” marks a
              provisional classification and remains included in filters. “Unclassified” results
              await model research and match only the all and mixed / uncertain weight filters.
            </p>
            <p>
              Harnesses inherit the evaluated model stack's class. Multi-model systems use the
              largest component category as an approximation. Open weights requires released weights
              for every required model; open harness code alone does not qualify. Unverified
              backbones and unavailable evaluated checkpoints are marked uncertain.
            </p>
            <p>
              Results compare evaluated systems, including their tools, compute budgets, and context
              strategies. Size categories do not guarantee hardware compatibility.{" "}
              <a
                href="https://github.com/steel-dev/leaderboard/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Suggest a correction ↗
              </a>
            </p>
          </div>
        </details>
      </section>
      {showResults && (
        <section
          className="table-shell chart-results"
          id="chart-results"
          aria-labelledby="chart-results-title"
        >
          <div className="lb-module-head chart-table-heading">
            <h2 id="chart-results-title">Results</h2>
            <div className="lb-head-lines" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <span>
              {scope && <>{scope} scope · </>}
              {filtered.length} systems
            </span>
          </div>
          <div className="chart-table-scroll">
            <table className="chart-data-table" ref={tableRef}>
              <thead>
                <tr>
                  <th scope="col" className="chart-table-rank">
                    Rank
                  </th>
                  <th scope="col">System / submission</th>
                  <th scope="col">Score ↓</th>
                  <th scope="col">Model class</th>
                  <th scope="col">Reported</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr
                    key={idOf(row)}
                    id={idOf(row)}
                    hidden={!expanded && index >= tablePreviewCount}
                  >
                    <td className="chart-table-rank">{row.rank}</td>
                    <th scope="row">
                      <span className="chart-system-name">
                        {row.systemName}
                        {row.isNew && <span className="badge badge-accent">New</span>}
                      </span>
                      <span className="chart-table-organization">
                        {row.organization}
                        {row.classification && <> · {kindLabels[row.classification.kind]}</>}
                      </span>
                      <details className="chart-table-note">
                        <summary>Evaluation & model details</summary>
                        <p>{row.notesShort}</p>
                        <ResearchDetails row={row} />
                      </details>
                    </th>
                    <td className="chart-table-score">{row.scoreDisplay}</td>
                    <td>
                      <ClassificationBadges row={row} />
                    </td>
                    <td>{row.reportedAt || "—"}</td>
                    <td>
                      <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Source ↗
                      </a>
                      {row.repoUrl && (
                        <a
                          className="chart-repo-link"
                          href={row.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Repository ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <p className="chart-table-empty">No matching results.</p>}
          {filtered.length > tablePreviewCount && (
            <button
              type="button"
              className="lb-expand-btn"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show fewer results" : `Show all ${filtered.length} results`}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
