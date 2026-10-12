import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "surface";
  /** Smaller gap between the section header and its content. */
  compact?: boolean;
};

/** Home-page section: eyebrow + serif heading on the left, content below. */
const Section = ({ id, eyebrow, title, intro, children, className, tone = "paper", compact = false }: SectionProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className={cn("section outline-none", tone === "surface" && "border-y border-rule bg-surface", className)}
  >
    <div className="page">
      <header className={compact ? "mb-8 md:mb-10" : "mb-10 md:mb-14"}>
        {/* Heading first, then the introduction — revealed once as the section scrolls into view. */}
        <RevealGroup
          step={0.1}
          className="grid gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-end md:gap-12"
        >
          <RevealItem>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 id={`${id}-title`} className="h2">
              {title}
            </h2>
          </RevealItem>
          {intro && <RevealItem className="lede md:max-w-prose md:pb-1">{intro}</RevealItem>}
        </RevealGroup>
      </header>
      {children}
    </div>
  </section>
);

export default Section;
