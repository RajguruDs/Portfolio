import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import { ImageFigure } from "@/components/case-study/Figure";
import { projects, type ProjectSummary } from "@/content/projects";
import { usePageMeta } from "@/lib/usePageMeta";
import { cn } from "@/lib/utils";

export type Fact = { label: string; value: ReactNode };
export type TocItem = { id: string; title: string };

export type Cover = { src: string; width: number; height: number; alt: string; caption: ReactNode; source: string };

type CaseStudyProps = {
  project: ProjectSummary;
  cover: Cover;
  metaDescription: string;
  lede: ReactNode;
  facts: Fact[];
  toc: TocItem[];
  children: ReactNode;
};

export const CaseStudy = ({ project, cover, metaDescription, lede, facts, toc, children }: CaseStudyProps) => {
  usePageMeta(project.title, metaDescription);
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article aria-labelledby="cs-title">
      <header className="border-b border-rule">
        {/* Header content staggers in on load, so direct visits to a case study get the same entrance. */}
        <RevealGroup immediate step={0.08} delay={0.05} className="page pb-14 pt-10 md:pb-20 md:pt-14">
          <RevealItem>
            <Link to="/#work" className="action-link text-ink-3 hover:text-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All work
            </Link>
          </RevealItem>
          <RevealItem>
            <p className="eyebrow mb-5 mt-10">
              Case study {String(index + 1).padStart(2, "0")} · {project.kind}
            </p>
            <h1 id="cs-title" className="display max-w-4xl">
              {project.title}
            </h1>
            <div className="lede mt-6 max-w-[46rem]">{lede}</div>
          </RevealItem>

          <RevealItem>
            <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="eyebrow mb-1.5">{f.label}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </RevealItem>

          {project.links.length > 0 && (
            <RevealItem>
              <ul className="mt-8 flex flex-wrap gap-3" aria-label="Project links">
                {project.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary min-h-[40px] px-4 text-sm"
                    >
                      {l.label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </RevealItem>
          )}

          <RevealItem>
            <ImageFigure {...cover} label={`${project.title} — ${cover.source}`} priority className="mt-12" />
          </RevealItem>
        </RevealGroup>
      </header>

      <div className="page grid gap-12 py-14 md:py-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow mb-4">On this page</p>
            <ol className="space-y-2.5 border-l border-rule text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <Link
                    to={{ hash: t.id }}
                    className="-ml-px block border-l border-transparent pl-4 text-ink-3 hover:border-ink hover:text-ink"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="min-w-0 space-y-16 md:space-y-20">{children}</div>
      </div>

      <nav aria-label="Next case study" className="border-t border-rule bg-surface">
        <Link to={next.path} className="page group flex flex-col gap-2 py-12 md:py-16">
          <span className="eyebrow">Next case study</span>
          <span className="flex items-center gap-3 font-serif text-3xl text-ink group-hover:text-accent md:text-4xl">
            {next.title}
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </nav>
    </article>
  );
};

export const CaseSection = ({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <section id={id} aria-labelledby={`${id}-h`} className={cn("outline-none", className)}>
    <Reveal>
      <h2 id={`${id}-h`} className="h2 mb-6 text-[clamp(1.625rem,1.4vw+1rem,2.125rem)]">
        {title}
      </h2>
      {children}
    </Reveal>
  </section>
);

export type MethodNote = {
  /** Short category label, e.g. "Data leakage" or "Validation". */
  label: string;
  title: string;
  body: ReactNode;
  /**
   * Set only when the point changes how the results should be read; shown as a small amber tag
   * (e.g. "May inflate scores"). Leave unset for neutral methodology notes.
   */
  emphasis?: string;
};

/**
 * Editorial list of methodology notes and limitations: numbered, rule-separated entries in a grid.
 * Amber is reserved for the small `emphasis` tag on notes that genuinely affect the results.
 */
export const MethodNotes = ({
  intro,
  notes,
  columns = 2,
}: {
  intro?: ReactNode;
  notes: MethodNote[];
  columns?: 1 | 2;
}) => (
  <div className="space-y-6">
    {intro && <p className="prose-case">{intro}</p>}
    <ol className={cn("grid border-t border-rule", columns === 2 && "md:grid-cols-2 md:gap-x-10")}>
      {notes.map((n, i) => (
        <li key={n.title} className="border-b border-rule py-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
            <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="h-px w-4 bg-rule-strong" />
            <span>{n.label}</span>
            {n.emphasis && (
              <span className="rounded-sm bg-caution-soft px-1.5 py-0.5 font-sans text-[0.75rem] font-medium normal-case tracking-normal text-caution">
                {n.emphasis}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug text-ink">{n.title}</h3>
          <div className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">{n.body}</div>
        </li>
      ))}
    </ol>
  </div>
);

/** A scrollable wrapper so wide tables never cause page-level horizontal overflow. */
export const TableWrap = ({ children, caption }: { children: ReactNode; caption?: ReactNode }) => (
  <figure className="min-w-0 rounded-md border border-rule bg-surface p-5 sm:p-6">
    <div className="-mx-1 overflow-x-auto px-1" tabIndex={0} role="region" aria-label="Scrollable table">
      {children}
    </div>
    {caption && (
      <figcaption className="mt-4 border-t border-rule pt-3 text-[0.8125rem] leading-relaxed text-ink-3">
        {caption}
      </figcaption>
    )}
  </figure>
);
