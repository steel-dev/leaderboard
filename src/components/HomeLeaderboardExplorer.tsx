import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LeaderboardExplorer from "./LeaderboardExplorer";
import {
  readChartBenchmark,
  writeChartBenchmark,
  type ChartBenchmark,
} from "../lib/model-classification";

export default function HomeLeaderboardExplorer({ benchmarks }: { benchmarks: ChartBenchmark[] }) {
  const [slug, setSlug] = useState(benchmarks[0].slug);
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
  useEffect(() => {
    const restore = () =>
      setSlug(
        readChartBenchmark(
          new URLSearchParams(window.location.search),
          benchmarks.map((item) => item.slug)
        )
      );
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [benchmarks]);

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
