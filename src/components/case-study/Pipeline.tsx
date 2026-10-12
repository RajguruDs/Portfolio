import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";

export type PipelineStage = {
  title: string;
  /** Where this happens in the real implementation, e.g. a notebook cell or file. */
  where: string;
  items: ReactNode[];
};

/**
 * A top-to-bottom diagram of a real processing pipeline.
 * Stages are an ordered list so the sequence is conveyed without relying on the arrows.
 */
const Pipeline = ({ title, stages, caption }: { title: string; stages: PipelineStage[]; caption: ReactNode }) => (
  <figure className="min-w-0 rounded-md border border-rule bg-surface p-5 shadow-[0_1px_2px_rgba(22,24,29,0.04)] sm:p-6">
    <p className="mb-5 text-sm font-medium text-ink">{title}</p>
    <ol>
      {stages.map((stage, i) => (
        <li key={stage.title}>
          <div className="grid gap-2 rounded-sm border border-rule-strong bg-paper p-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
                {String(i + 1).padStart(2, "0")} · {stage.where}
              </p>
              <p className="mt-1 text-[0.9375rem] font-semibold leading-snug text-ink">{stage.title}</p>
            </div>
            <ul className="space-y-1 text-[0.875rem] leading-snug text-ink-2">
              {stage.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
          {i < stages.length - 1 && (
            <span aria-hidden="true" className="flex justify-center py-1.5 text-ink-3">
              <ArrowDown className="h-4 w-4" />
            </span>
          )}
        </li>
      ))}
    </ol>
    <figcaption className="mt-5 border-t border-rule pt-3 text-[0.8125rem] leading-relaxed text-ink-3">{caption}</figcaption>
  </figure>
);

export default Pipeline;
