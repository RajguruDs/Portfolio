import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Bar = {
  label: string;
  value: number;
  /** Text shown at the end of the bar; defaults to the raw value. */
  display?: string;
  /** Visually de-emphasise a bar, e.g. a baseline or a non-comparable run. */
  muted?: boolean;
};

type BarChartProps = {
  title: string;
  bars: Bar[];
  /** Upper end of the scale. Bars always start at zero. */
  max: number;
  caption?: ReactNode;
  labelWidth?: string;
  className?: string;
};

/**
 * Horizontal single-series bar chart built from plain HTML so every value is real, selectable text.
 * One hue only — the title names the series, so no legend is needed.
 */
const BarChart = ({ title, bars, max, caption, labelWidth = "7.5rem", className }: BarChartProps) => (
  <figure className={cn("min-w-0 rounded-md border border-rule bg-surface p-5 sm:p-6", className)}>
    <p className="mb-4 text-sm font-medium text-ink">{title}</p>
    <ul className="space-y-2.5">
      {bars.map((bar) => {
        const pct = Math.max(0, Math.min(100, (bar.value / max) * 100));
        return (
          <li
            key={bar.label}
            className="group grid items-center gap-3 rounded-sm text-sm"
            style={{ gridTemplateColumns: `${labelWidth} minmax(0,1fr)` }}
          >
            <span className="truncate text-ink-2" title={bar.label}>
              {bar.label}
            </span>
            <span className="flex items-center gap-2.5">
              <span className="relative h-5 flex-1 border-l border-rule-strong">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-r-[4px] transition-opacity group-hover:opacity-80",
                    bar.muted ? "bg-control" : "bg-accent",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="w-[4.5rem] shrink-0 text-right font-mono text-[0.8125rem] tabular-nums text-ink">
                {bar.display ?? bar.value.toLocaleString("en-US")}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
    {caption && <figcaption className="mt-4 border-t border-rule pt-3 text-[0.8125rem] leading-relaxed text-ink-3">{caption}</figcaption>}
  </figure>
);

export default BarChart;
