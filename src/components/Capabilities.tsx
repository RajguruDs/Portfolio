import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { capabilities } from "@/content/profile";

const Capabilities = () => (
  <section aria-labelledby="capabilities-title" className="border-y border-rule bg-surface">
    <div className="page py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
        <h2 id="capabilities-title" className="eyebrow">
          What I work on
        </h2>
        <p className="text-sm text-ink-3">Five areas, one way of working: start from the data, show the evidence.</p>
      </div>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map((c, i) => (
          <li key={c.title}>
            <Reveal delay={i * 0.08} className="flex h-full flex-col border-t border-ink pt-4">
              <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{c.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{c.summary}</p>
              {/* One evidence link per line, so names never break mid-phrase. */}
              <ul className="mt-auto space-y-1 pt-5 text-sm" aria-label={`Work showing ${c.title}`}>
                {c.evidence.map((e) => (
                  <li key={e.label}>
                    <Link to={e.to} className="action-link">
                      {e.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Capabilities;
