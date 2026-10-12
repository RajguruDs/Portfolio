import type { ReactNode } from "react";
import type { Bar } from "@/components/charts/BarChart";
import { cn } from "@/lib/utils";

type Group = { label: string; bars: Bar[] };

type GroupedBarChartProps = {
  title: string;
  groups: Group[];
  /** Upper end of the scale. Bars always start at zero. */
  max: number;
  caption?: ReactNode;
  labelWidth?: string;
};

/**
 * Several small single-series bar groups in one figure (small multiples), for comparing the same
 * entities across a few measures. Same marks and typography as BarChart; every value is real text.
 */
const GroupedBarChart = ({ title, groups, max, caption, labelWidth = "4.5rem" }: GroupedBarChartProps) => (
  <figure className="min-w-0 rounded-md border border-rule bg-surface p-5 sm:p-6">
    <p className="mb-5 text-sm font-medium text-ink">{title}</p>
    <div className="grid gap-x-10 gap-y-6 md:grid-cols-3">
      {groups.map((g) => (
        <div key={g.label} className="min-w-0">
          <p className="eyebrow mb-3 text-[0.6875rem]">{g.label}</p>
          <ul className="space-y-2" aria-label={g.label}>
            {g.bars.map((bar) => {
              const pct = Math.max(0, Math.min(100, (bar.value / max) * 100));
              return (
                <li
                  key={bar.label}
                  className="grid items-center gap-2.5 text-[0.8125rem]"
                  style={{ gridTemplateColumns: `${labelWidth} minmax(0,1fr) 3rem` }}
                >
                  <span className="truncate text-ink-2">{bar.label}</span>
                  <span className="relative h-4 border-l border-rule-strong">
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-r-[3px]",
                        bar.muted ? "bg-control" : "bg-accent",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="text-right font-mono tabular-nums text-ink">
                    {bar.display ?? bar.value.toLocaleString("en-US")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
    {caption && (
      <figcaption className="mt-5 border-t border-rule pt-3 text-[0.8125rem] leading-relaxed text-ink-3">
        {caption}
      </figcaption>
    )}
  </figure>
);

export default GroupedBarChart;
