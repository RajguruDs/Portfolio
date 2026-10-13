import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, BookOpen, BrainCircuit, Database, Wrench, type LucideIcon } from "lucide-react";
import Section from "@/components/Section";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import { RHYTHM } from "@/lib/motion";
import { additionalKnowledge, skillGroups, type SkillGroup } from "@/content/profile";
import { projects } from "@/content/projects";

const icons: Record<SkillGroup["icon"], LucideIcon> = {
  analysis: BarChart3,
  ml: BrainCircuit,
  backend: Database,
  tools: Wrench,
};

/** Short reference for an evidence link: the project's number on the home page, or "Exp" for the internship. */
const refCode = (to: string) => {
  const i = projects.findIndex((p) => p.path === to);
  return i >= 0 ? String(i + 1).padStart(2, "0") : "Exp";
};

const SkillCard = ({ group, index }: { group: SkillGroup; index: number }) => {
  const Icon = icons[group.icon];
  const id = `skills-${group.icon}`;

  return (
    <article
      aria-labelledby={id}
      className="spotlight group/skill flex h-full flex-col rounded-md border border-rule bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:border-rule-strong hover:shadow-[0_18px_40px_-30px_rgba(22,24,29,0.4)] motion-safe:hover:-translate-y-0.5 sm:p-7"
    >
      <header className="flex items-start justify-between gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded border border-rule bg-sunken text-ink-2 transition-colors duration-300 group-hover/skill:text-accent">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
          <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span> · Hands-on
        </span>
      </header>

      <h3 id={id} className="mt-5 font-serif text-[1.625rem] leading-tight tracking-[-0.01em] text-ink">
        {group.title}
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-3">{group.summary}</p>

      {/* Tools as tiles: short code (e.g. the usual import alias) above the full name. */}
      <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4" aria-label={`${group.title}: tools`}>
        {group.tools.map((t) => (
          <li
            key={t.name}
            className="flex min-h-[4.5rem] flex-col justify-between rounded border border-rule bg-paper px-2.5 py-2 transition-colors duration-200 hover:border-accent-line md:px-2 lg:px-2.5"
          >
            <span aria-hidden="true" className="font-mono text-[0.9375rem] font-medium lowercase text-accent">
              {t.code}
            </span>
            <span className="min-w-0 text-[0.8125rem] leading-tight text-ink md:text-[0.75rem] lg:text-[0.8125rem]">{t.name}</span>
          </li>
        ))}
      </ul>

      {group.practices.length > 0 && (
        <div className="mt-6 space-y-3">
          {group.practices.map((p) => (
            <div key={p.heading ?? "practices"}>
              <p className="eyebrow mb-1.5 text-[0.6875rem]">{p.heading ?? "Practices"}</p>
              <ul
                className="flex flex-wrap text-[0.9375rem] leading-relaxed text-ink-2"
                aria-label={p.heading ?? "Practices"}
              >
                {p.items.map((item, i) => (
                  <li key={item} className="whitespace-nowrap">
                    {item}
                    {i < p.items.length - 1 && (
                      <span aria-hidden="true" className="px-2 text-rule-strong">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-auto pt-6">
        <div className="border-t border-rule pt-4">
          <p className="eyebrow mb-2.5 text-[0.6875rem]">Used in</p>
          <ul className="flex flex-wrap gap-2">
            {group.evidence.map((e) => (
              <li key={e.label}>
                <Link
                  to={e.to}
                  className="group/ref inline-flex min-h-[36px] items-center gap-2 rounded-full border border-rule bg-paper py-1 pl-1.5 pr-3 text-[0.8125rem] text-ink-2 transition-colors duration-200 hover:border-accent-line hover:text-accent"
                >
                  <span className="rounded-full bg-sunken px-1.5 py-0.5 font-mono text-[0.6875rem] tabular-nums text-ink-3 transition-colors group-hover/ref:text-accent">
                    {refCode(e.to)}
                  </span>
                  {e.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 motion-safe:group-hover/ref:-translate-y-px motion-safe:group-hover/ref:translate-x-px"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </article>
  );
};

const Skills = () => (
  <Section
    id="skills"
    eyebrow="Toolkit"
    title="Skills & Technologies"
    intro="Four areas of hands-on work, each linked to the projects where it's used. Knowledge from coursework and training is listed separately below."
  >
    <RevealGroup step={RHYTHM.skills} className="grid gap-4 md:grid-cols-2 md:gap-5">
      {skillGroups.map((g, i) => (
        <RevealItem key={g.title} className="h-full min-w-0">
          <SkillCard group={g} index={i} />
        </RevealItem>
      ))}
    </RevealGroup>

    {/* Quieter strip: foundational knowledge, deliberately set apart from the hands-on cards. */}
    <Reveal className="mt-10">
      <section
        aria-labelledby="skills-additional"
        className="grid gap-4 border-t border-dashed border-rule-strong pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] md:gap-12"
      >
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
            <BookOpen className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            Foundational
          </p>
          <h3 id="skills-additional" className="mt-2 text-base font-semibold text-ink-2">
            Additional knowledge
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-3">
            {additionalKnowledge.summary} From {additionalKnowledge.source}.
          </p>
        </div>
        <ul className="flex flex-wrap content-start gap-2 md:pt-6" aria-label="Additional knowledge">
          {additionalKnowledge.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-dashed border-rule-strong px-3 py-1 text-[0.8125rem] text-ink-2"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  </Section>
);

export default Skills;
