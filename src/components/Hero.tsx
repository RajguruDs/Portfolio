import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { m, type Variants } from "framer-motion";
import TiltCard from "@/components/TiltCard";
import { avatar, links, profile } from "@/content/site";
import { EASE_OUT_EXPO, fadeRise, stagger, usePrefersReducedMotion } from "@/lib/motion";

// Two headline lines; each word slides up from behind its own mask.
const HEADLINE = ["Turning data into insight,", "and models into working software."];

// Concrete values of the --accent and --rule tokens (Framer Motion interpolates colours, not CSS variables).
const ACCENT = "#233E8B";
const RULE = "#E3DED5";

const actionItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

const linkLift =
  "transition-[color,transform] duration-200 ease-out motion-safe:hover:-translate-y-px motion-safe:focus-visible:-translate-y-px";

/** The headline, word by word. The full sentence is real text in the DOM from the first render. */
const Headline = ({ reduce }: { reduce: boolean }) => {
  let index = 0;
  return (
    <h1 id="hero-title" className="display">
      {HEADLINE.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={line} className="block">
            {words.map((word, wi) => {
              const i = index++;
              return (
                <span key={wi}>
                  {/* Padding + equal negative margin give descenders room inside the mask without changing layout. */}
                  <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
                    {reduce ? (
                      <span className="inline-block">{word}</span>
                    ) : (
                      <m.span
                        className="inline-block"
                        initial={{ y: "115%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.045, ease: EASE_OUT_EXPO }}
                      >
                        {word}
                      </m.span>
                    )}
                  </span>
                  {wi < words.length - 1 && " "}
                </span>
              );
            })}
            {li < HEADLINE.length - 1 && " "}
          </span>
        );
      })}
    </h1>
  );
};

const Hero = () => {
  const reduce = usePrefersReducedMotion();
  const group = (step: number, delay: number) =>
    reduce ? {} : { variants: stagger(step, delay), initial: "hidden" as const, animate: "show" as const };
  const item = reduce ? {} : { variants: actionItem };

  return (
    <section id="top" aria-labelledby="hero-title" className="outline-none">
      <div className="page grid gap-14 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <m.p {...fadeRise(reduce, 0, { y: 10, duration: 0.7 })} className="eyebrow mb-6">
            {profile.name} · Data &amp; Machine Learning · {profile.location}
          </m.p>
          <Headline reduce={reduce} />
          <m.p {...fadeRise(reduce, 0.55, { y: 18, duration: 0.8 })} className="lede mt-7 max-w-prose">
            I'm an early-career data professional with a B.Sc. in Information Technology. I work across analytics,
            machine learning and the code around them: cleaning messy datasets, testing what the numbers actually say,
            and building tools people can use. Most recently I interned at Roopsee, building validation tooling for a
            product-scoring system.
          </m.p>
          <m.p {...fadeRise(reduce, 0.62, { y: 14, duration: 0.8 })} className="mt-4 text-[0.9375rem] text-ink-3">
            Open to {profile.roles} roles.
          </m.p>

          <m.div {...group(0.08, 0.7)} className="mt-9 flex flex-wrap items-center gap-3">
            <m.div {...item}>
              <Link to="/#work" className="btn-primary">
                Explore selected work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </m.div>
            <m.div {...item}>
              <a href={links.resume} download="Rajguru_Mathiyalagan_Resume.pdf" className="btn-secondary">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download resume
                <span className="sr-only">(PDF)</span>
              </a>
            </m.div>
          </m.div>

          <m.ul {...group(0.06, 0.85)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Profiles">
            <m.li {...item}>
              <a href={links.github} target="_blank" rel="noopener noreferrer" className={`action-link ${linkLift}`}>
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </m.li>
            <m.li {...item}>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={`action-link ${linkLift}`}>
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </m.li>
            <m.li {...item}>
              <a href={links.email} className={`action-link ${linkLift}`}>
                {profile.email}
              </a>
            </m.li>
          </m.ul>
        </div>

        {/* Portrait: the card rises and scales in, the image unveils upward, and the border settles from ink-blue to the warm rule. */}
        <m.figure
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 48, scale: 0.96 },
                animate: { opacity: 1, y: 0, scale: 1 },
                transition: { duration: 1.0, delay: 0.3, ease: EASE_OUT_EXPO },
              })}
          className="w-full max-w-[20rem] justify-self-start sm:max-w-[22rem] lg:max-w-[26.5rem] lg:justify-self-end"
        >
          <TiltCard>
            <m.div
              {...(reduce
                ? {}
                : {
                    initial: { borderColor: ACCENT },
                    animate: { borderColor: RULE },
                    transition: { duration: 0.8, delay: 0.7, ease: "easeOut" },
                  })}
              className="rounded-md border border-rule bg-surface p-2 transition-shadow duration-300 group-hover/tilt:shadow-[0_22px_44px_-26px_rgba(22,24,29,0.42)]"
            >
              <m.img
                {...(reduce
                  ? {}
                  : {
                      initial: { clipPath: "inset(100% 0% 0% 0%)" },
                      animate: { clipPath: "inset(0% 0% 0% 0%)" },
                      transition: { duration: 1.0, delay: 0.4, ease: EASE_OUT_EXPO },
                    })}
                src={avatar.src}
                srcSet={avatar.srcSet}
                sizes="(min-width: 1024px) 424px, (min-width: 640px) 352px, 320px"
                width={avatar.width}
                height={avatar.height}
                alt={avatar.alt}
                loading="eager"
                decoding="async"
                className="block h-auto w-full rounded-sm object-contain"
              />
            </m.div>
          </TiltCard>
        </m.figure>
      </div>
    </section>
  );
};

export default Hero;
