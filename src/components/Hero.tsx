import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { avatar, links, profile } from "@/content/site";

// Two headline lines, revealed one after the other.
const HEADLINE = ["Turning data into insight,", "and models into working software."];

/**
 * Entrance timing for the `.enter` CSS animation (src/index.css): a delay in ms and an optional rise distance.
 * The whole sequence finishes within about a second of the first paint.
 */
const enter = (delay: number, y?: number): CSSProperties =>
  ({ "--enter-delay": `${delay}ms`, ...(y !== undefined && { "--enter-y": `${y}px` }) }) as CSSProperties;

const linkLift =
  "transition-[color,transform] duration-200 ease-out motion-safe:hover:-translate-y-px motion-safe:focus-visible:-translate-y-px";

const Hero = () => (
  // overflow-x-clip: the portrait glow may extend past the page gutter on narrow screens without causing a sideways scroll.
  <section id="top" aria-labelledby="hero-title" data-glow-area className="overflow-x-clip outline-none">
    <div className="page grid gap-14 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
      <div>
        <p className="enter eyebrow mb-6" style={enter(0, 8)}>
          {profile.name} · Data &amp; Machine Learning · {profile.location}
        </p>
        <h1 id="hero-title" className="display">
          {HEADLINE.map((line, i) => (
            <span key={line} className="enter block" style={enter(70 + i * 90, 16)}>
              {line}
              {i < HEADLINE.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="enter lede mt-7 max-w-prose" style={enter(260)}>
          I'm an early-career data professional with a B.Sc. in Information Technology. I work across analytics,
          machine learning and the code around them: cleaning messy datasets, testing what the numbers actually say,
          and building tools people can use. Most recently I interned at Roopsee, building validation tooling for a
          product-scoring system.
        </p>
        <p className="enter mt-4 text-[0.9375rem] text-ink-3" style={enter(320)}>
          Open to {profile.roles} roles.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <div className="enter" style={enter(380)}>
            <span data-magnetic className="inline-block">
              <Link to="/#work" className="btn-primary">
                Explore selected work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </span>
          </div>
          <div className="enter" style={enter(430)}>
            <span data-magnetic className="inline-block">
              <a href={links.resume} download="Rajguru_Mathiyalagan_Resume.pdf" className="btn-secondary">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download resume
                <span className="sr-only">(PDF)</span>
              </a>
            </span>
          </div>
        </div>

        <ul className="enter mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={enter(480, 8)} aria-label="Profiles">
          <li>
            <a href={links.github} target="_blank" rel="noopener noreferrer" className={`action-link ${linkLift}`}>
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={`action-link ${linkLift}`}>
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={links.email} className={`action-link ${linkLift}`}>
              {profile.email}
            </a>
          </li>
        </ul>
      </div>

      {/*
        Portrait: fades up once while its frame settles from ink-blue to the warm rule and a soft blue glow fades in
        behind it. On desktop (PointerEffects) the glow drifts toward the pointer anywhere in the hero and the frame
        tilts ≤ 3° under it. Image, frame and proportions are unchanged; the glow sits behind the frame.
      */}
      <figure
        className="enter relative isolate w-full max-w-[20rem] justify-self-start sm:max-w-[22rem] lg:max-w-[26.5rem] lg:justify-self-end"
        style={{ ...enter(180, 20), "--enter-duration": "900ms" } as CSSProperties}
      >
        <div aria-hidden="true" data-glow className="portrait-glow enter-glow" />
        <div data-tilt>
          <div className="enter-frame rounded-md border border-rule bg-surface p-2 transition-shadow duration-300 ease-out hover:shadow-[0_22px_44px_-26px_rgba(22,24,29,0.36)]">
            <img
              src={avatar.src}
              srcSet={avatar.srcSet}
              sizes="(min-width: 1024px) 424px, (min-width: 640px) 352px, 320px"
              width={avatar.width}
              height={avatar.height}
              alt={avatar.alt}
              loading="eager"
              // Lower-case attribute: React 18 warns on the camel-cased prop.
              {...{ fetchpriority: "high" }}
              decoding="async"
              className="block h-auto w-full rounded-sm object-contain"
            />
          </div>
        </div>
      </figure>
    </div>
  </section>
);

export default Hero;
