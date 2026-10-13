import { useEffect, useState } from "react";
import { useReducedMotion, type Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Fast start, long soft settle — used for reveals that should feel deliberate rather than bouncy. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
/** Scroll-reveal timing shared by Reveal and RevealItem (the hero uses the matching CSS `.enter` in index.css). */
export const REVEAL = { duration: 0.8, y: 18 } as const;

/**
 * True when the visitor asked for reduced motion. MotionConfig already strips movement in that case;
 * components use this to skip entrance animations entirely, so content simply appears.
 */
export const usePrefersReducedMotion = () => useReducedMotion() ?? false;

/** True on devices with a precise pointer that can hover (mouse/trackpad), false on touch screens. */
export const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
};

/** Stagger rhythm per home-page section (seconds between siblings): same motion, different pace. */
export const RHYTHM = { projects: 0.09, experience: 0.07, skills: 0.1, about: 0.06, contact: 0.12 } as const;

/** Props for a one-time fade-and-rise on mount, or none at all when reduced motion is preferred. */
export const fadeRise = (reduce: boolean, delay = 0, { y = 12, duration = 0.5 } = {}) =>
  reduce
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: EASE_OUT_EXPO },
      };

/** Parent variant that staggers its children's "show" state. */
export const stagger = (step = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren } },
});

/** Child variant: a short upward movement plus opacity. */
export const rise: Variants = {
  hidden: { opacity: 0, y: REVEAL.y },
  show: { opacity: 1, y: 0, transition: { duration: REVEAL.duration, ease: EASE_OUT_EXPO } },
};

/** Trigger reveals once, when an element's top passes ~88% of the viewport height. */
export const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Chart list: grows its bars (BAR_GROW children) one after another, once, when the chart scrolls into view. */
export const chartReveal = (reduce: boolean) =>
  reduce
    ? {}
    : {
        variants: stagger(0.06, 0.1),
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: REVEAL_VIEWPORT,
      };

/** A bar growing from the zero baseline. Transform only, so the layout never shifts. */
export const BAR_GROW: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};
