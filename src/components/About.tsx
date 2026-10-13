import { ArrowUpRight } from "lucide-react";
import Section from "@/components/Section";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import { RHYTHM } from "@/lib/motion";
import { credentials, education, type Credential } from "@/content/profile";

// Certificates grouped by kind, in this order.
const credentialGroups: { kind: Credential["kind"]; heading: string }[] = [
  { kind: "Course certificate", heading: "Course certificates" },
  { kind: "Job simulation", heading: "Job simulation" },
];

const CredentialRow = ({ c }: { c: Credential }) => (
  // The divider sits on the row; the hover tint sits on the inner block, so lines stay aligned with the column.
  <RevealItem as="li" className="border-t border-rule first:border-t-0">
    <div className="-mx-3 grid gap-x-6 gap-y-2 rounded px-3 py-4 transition-colors duration-200 hover:bg-paper sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <p className="font-medium leading-snug text-ink">{c.title}</p>
        <p className="mt-0.5 text-sm text-ink-2">{c.issuer}</p>
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-3">{c.note}</p>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <span className="font-mono text-sm tabular-nums text-ink-2">{c.year}</span>
        {c.href && (
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cert inline-flex min-h-[32px] items-center gap-1.5 whitespace-nowrap rounded-full border border-rule-strong bg-surface px-3 text-[0.8125rem] font-medium text-accent transition-colors duration-200 hover:border-accent-line hover:bg-accent-soft focus-visible:border-accent"
          >
            LinkedIn post
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 motion-safe:group-hover/cert:-translate-y-px motion-safe:group-hover/cert:translate-x-px"
              aria-hidden="true"
            />
            <span className="sr-only">about {c.title} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  </RevealItem>
);

const About = () => (
  <Section id="about" eyebrow="About" title="A careful approach to data." tone="surface" compact>
    <div className="grid gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14">
      <Reveal className="prose-case md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
        <p>
          I'm based in Mumbai and recently completed a B.Sc. in Information Technology. My projects range from
          exploratory analysis and hypothesis testing to regression and classification models served through small web
          applications.
        </p>
        <p>
          I care about knowing where a number comes from. Every case study on this site lists the project's{" "}
          <strong>limitations alongside its results</strong> — including the places where my own earlier evaluation was
          more optimistic than it should have been.
        </p>
      </Reveal>

      <div className="space-y-12">
        <section aria-labelledby="about-education">
          <h3 id="about-education" className="eyebrow mb-4">
            Education
          </h3>
          <RevealGroup step={RHYTHM.about} className="border-t border-rule pt-5">
            <RevealItem>
              <p className="font-serif text-[1.75rem] leading-tight tracking-[-0.01em] text-ink">{education.degree}</p>
              <p className="mt-1 text-ink-2">{education.institution}</p>
            </RevealItem>
            <RevealItem>
              <dl className="mt-5 grid grid-cols-3 divide-x divide-rule rounded border border-rule">
                {[
                  { label: "Period", value: education.period },
                  { label: "Status", value: education.status },
                  { label: "CGPA", value: education.grade.replace(/^CGPA\s*/, "") },
                ].map((d) => (
                  <div key={d.label} className="px-3 py-2.5 sm:px-4">
                    <dt className="eyebrow text-[0.6875rem]">{d.label}</dt>
                    <dd className="mt-1 whitespace-nowrap font-mono text-sm tabular-nums text-ink">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
            <RevealItem>
              <p className="eyebrow mb-1.5 mt-5 text-[0.6875rem]">Relevant coursework</p>
              <ul
                className="flex flex-wrap text-[0.9375rem] leading-relaxed text-ink-2"
                aria-label="Relevant coursework"
              >
                {education.coursework.map((c, i) => (
                  <li key={c} className="whitespace-nowrap">
                    {c}
                    {i < education.coursework.length - 1 && (
                      <span aria-hidden="true" className="px-2 text-rule-strong">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </RevealItem>
          </RevealGroup>
        </section>

        <section aria-labelledby="about-credentials">
          <h3 id="about-credentials" className="eyebrow mb-4">
            Certificates &amp; training
          </h3>
          <div className="space-y-6 border-t border-rule pt-4">
            {credentialGroups.map((g) => {
              const items = credentials.filter((c) => c.kind === g.kind);
              if (!items.length) return null;
              return (
                <div key={g.kind}>
                  <p className="text-sm font-medium text-ink-2">
                    {g.heading} <span className="font-mono text-xs tabular-nums text-ink-3">({items.length})</span>
                  </p>
                  <RevealGroup as="ul" step={RHYTHM.about} className="mt-1" aria-label={g.heading}>
                    {items.map((c) => (
                      <CredentialRow key={c.title} c={c} />
                    ))}
                  </RevealGroup>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  </Section>
);

export default About;
