import Section from "@/components/Section";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { experience } from "@/content/profile";

const Experience = () => (
  <Section id="experience" eyebrow="Experience" title="Professional experience" tone="surface">
    <div className="space-y-16">
      {experience.map((role) => {
        const id = `role-${role.organisation.toLowerCase()}`;
        return (
          <article
            key={role.organisation}
            aria-labelledby={id}
            className="grid gap-8 border-t border-rule pt-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] md:gap-14"
          >
            {/* Who and where. */}
            <RevealGroup step={0.07}>
              <RevealItem>
                <p className="eyebrow">
                  {role.type} <span aria-hidden="true">·</span> <time className="tabular-nums">{role.period}</time>
                </p>
                <h3 id={id} className="mt-3 font-serif text-[2.25rem] leading-none tracking-[-0.015em] text-ink">
                  {role.organisation}
                </h3>
                <p className="mt-2 text-base font-medium text-ink-2">{role.title}</p>
              </RevealItem>
              <RevealItem>
                <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-3">{role.context}</p>
              </RevealItem>
              <RevealItem>
                <p className="eyebrow mb-2.5 mt-6 text-[0.6875rem]">Stack</p>
                <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
                  {role.stack.map((s) => (
                    <li key={s} className="tag whitespace-nowrap">
                      {s}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </RevealGroup>

            {/* What I did — numbered, with a short label per item for scanning. */}
            <RevealGroup
              as="ol"
              step={0.08}
              className="border-b border-rule"
              aria-label={`Work at ${role.organisation}`}
            >
              {role.highlights.map((h, i) => (
                <RevealItem
                  as="li"
                  key={h.lead}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-t border-rule py-5 first:border-t-0 first:pt-0"
                >
                  <span aria-hidden="true" className="pt-0.5 font-mono text-xs tabular-nums text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="max-w-[38rem]">
                    <p className="text-[1.0625rem] font-semibold leading-snug text-ink">{h.lead}</p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{h.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </article>
        );
      })}
    </div>
  </Section>
);

export default Experience;
