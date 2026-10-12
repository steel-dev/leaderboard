import { useLayoutEffect, useMemo, useRef, useState } from "react";
import LeaderboardExplorer from "./LeaderboardExplorer";
import {
  readChartBenchmark,
  writeChartBenchmark,
  type ChartBenchmark,
} from "../lib/model-classification";

export default function HomeLeaderboardExplorer({ benchmarks }: { benchmarks: ChartBenchmark[] }) {
  const slugs = useMemo(() => benchmarks.map((item) => item.slug), [benchmarks]);
  // The server render cannot see the query, so hydration starts on the default benchmark.
  const [slug, setSlug] = useState(() => readChartBenchmark(new URLSearchParams(), slugs));
  const container = useRef<HTMLDivElement>(null);
  const restoreSelectorFocus = useRef(false);
  useLayoutEffect(() => {
    if (restoreSelectorFocus.current) {
      container.current
        ?.querySelector<HTMLSelectElement>(".chart-benchmark-control select")
        ?.focus({ preventScroll: true });
      restoreSelectorFocus.current = false;
    }
  }, [slug]);
  // A layout effect swaps in the linked benchmark before the first client paint, so a shared
  // ?benchmark= link never draws or animates the default chart first.
  useLayoutEffect(() => {
    const restore = () =>
      setSlug(readChartBenchmark(new URLSearchParams(window.location.search), slugs));
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [slugs]);

  const selected = benchmarks.find((item) => item.slug === slug) ?? benchmarks[0];
  return (
    <div ref={container}>
      <LeaderboardExplorer
        key={selected.slug}
        rows={selected.rows}
        benchmark={selected.name}
        benchmarkSlug={selected.slug}
        benchmarkOptions={benchmarks.map(({ slug, name }) => ({ slug, name }))}
        onBenchmarkChange={(next) => {
          restoreSelectorFocus.current = true;
          window.history.pushState(
            null,
            "",
            writeChartBenchmark(new URL(window.location.href), next)
          );
          setSlug(next);
        }}
        showResults={false}
      />
    </div>
  );
}
