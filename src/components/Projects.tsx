import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import Section from "@/components/Section";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { categories, projects, type Category, type ProjectSummary } from "@/content/projects";
import { links } from "@/content/site";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

type Filter = "All" | Category;
const filters: Filter[] = ["All", ...categories];

// Hovering (or keyboard-focusing) anywhere in a row lifts its thumbnail, zooms the image and highlights the title.
const thumbFrame =
  "block overflow-hidden rounded-md border border-rule bg-paper shadow-[0_1px_2px_rgba(22,24,29,0.04)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:border-rule-strong group-hover/card:shadow-[0_24px_48px_-28px_rgba(22,24,29,0.45)] group-focus-within/card:border-rule-strong motion-safe:group-hover/card:-translate-y-1 motion-safe:group-focus-within/card:-translate-y-1";
const thumbImage =
  "aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/card:scale-[1.04]";

const ProjectRow = ({ project, index }: { project: ProjectSummary; index: number }) => (
  <article aria-labelledby={`project-${project.slug}`} className="group/card border-t border-rule">
    <RevealGroup step={0.09} className="grid gap-6 py-10 md:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,1fr)] md:gap-10">
      <RevealItem className="font-mono text-sm text-ink-3">
        <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </RevealItem>

      <RevealItem>
        <p className="eyebrow mb-3">{project.kind}</p>
        <h3
          id={`project-${project.slug}`}
          className="font-serif text-[1.875rem] leading-tight tracking-[-0.015em] text-ink"
        >
          <Link
            to={project.path}
            className="transition-colors duration-300 hover:text-accent group-hover/card:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink">{project.problem}</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
          <span className="font-medium text-ink">What I did: </span>
          {project.contribution}
        </p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools">
          {project.tools.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={project.path} className="action-link">
            Read the case study
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">: {project.title}</span>
          </Link>
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="action-link text-ink-2 hover:text-ink"
            >
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">for {project.title} (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </RevealItem>

      <RevealItem className="space-y-6">
        <Link to={project.path} tabIndex={-1} className={thumbFrame}>
          <img
            src={project.thumb.src}
            alt={project.thumb.alt}
            width={project.thumb.width}
            height={project.thumb.height}
            loading="lazy"
            decoding="async"
            className={thumbImage}
          />
        </Link>
        <ul className="grid content-start gap-5 sm:grid-cols-2 md:grid-cols-1" aria-label="Outcomes">
          {project.outcomes.map((o) => (
            <li key={o.label} className="border-l border-rule-strong pl-4">
              <span className="block font-mono text-2xl tabular-nums tracking-tight text-ink">{o.value}</span>
              <span className="mt-1 block text-sm leading-snug text-ink-3">{o.label}</span>
            </li>
          ))}
        </ul>
      </RevealItem>
    </RevealGroup>
  </article>
);

const Projects = () => {
  const [filter, setFilter] = useState<Filter>("All");
  const reduce = usePrefersReducedMotion();
  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );

  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Three projects, documented end to end."
      intro={
        <>
          Each case study covers the data, the method, the measured results and their limits. More is on{" "}
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="link">
            GitHub
          </a>
          .
        </>
      }
    >
      <div role="group" aria-label="Filter projects by area" className="mb-2 flex flex-wrap gap-2">
        {filters.map((f) => {
          const selected = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex min-h-[40px] items-center rounded-full border px-4 text-sm transition-[background-color,border-color,color,transform] duration-200 motion-safe:active:scale-[0.97]",
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-rule-strong bg-surface text-ink-2 hover:border-ink-3 hover:text-ink",
              )}
            >
              {f === "All" ? "All Projects" : f}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter === "All" ? "" : ` in ${filter}`}.
      </p>

      {/* Changing the filter cross-fades the list; the incoming rows then rise in with their usual stagger. */}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={filter}
          className="mt-6 border-b border-rule"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration: 0.25 } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              })}
        >
          {visible.length > 0 ? (
            visible.map((p) => <ProjectRow key={p.slug} project={p} index={projects.indexOf(p)} />)
          ) : (
            <p className="border-t border-rule py-10 text-ink-3">No projects in this area yet.</p>
          )}
        </m.div>
      </AnimatePresence>
    </Section>
  );
};

export default Projects;
