import { useEffect, useState } from "react";
import { useReducedMotion, type Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Fast start, long soft settle — used for reveals that should feel deliberate rather than bouncy. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

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

/** Child variant: visible upward movement plus opacity. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

/** Trigger reveals once, when an element's top passes ~88% of the viewport height. */
export const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
