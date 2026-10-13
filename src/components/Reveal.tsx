import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, REVEAL, REVEAL_VIEWPORT, rise, stagger, usePrefersReducedMotion } from "@/lib/motion";

type RevealProps = { children: ReactNode; className?: string; delay?: number };

/**
 * A fade-and-rise the first time content scrolls into view (never replayed on later scrolls).
 * With reduced motion the content renders immediately, with no animation.
 */
const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: REVEAL.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: REVEAL.duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  );
};

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  /** Render as a list (`ul`/`ol`) whose RevealItem children use `as="li"`. */
  as?: "div" | "ul" | "ol";
  "aria-label"?: string;
  /** Seconds between children. */
  step?: number;
  delay?: number;
  /** Animate on mount (above-the-fold content) instead of when scrolled into view. */
  immediate?: boolean;
};

/** Staggers the RevealItem children inside it; triggers once. */
export const RevealGroup = ({
  children,
  className,
  step = 0.08,
  delay = 0,
  immediate = false,
  as = "div",
  "aria-label": ariaLabel,
}: RevealGroupProps) => {
  const reduce = usePrefersReducedMotion();
  const props = { className, "aria-label": ariaLabel };
  if (reduce) {
    const Tag = as;
    return <Tag {...props}>{children}</Tag>;
  }

  const Motion = as === "ul" ? m.ul : as === "ol" ? m.ol : m.div;
  return (
    <Motion
      {...props}
      variants={stagger(step, delay)}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: REVEAL_VIEWPORT })}
    >
      {children}
    </Motion>
  );
};

/** One staggered element inside a RevealGroup. Use `as="li"` when the group is a list. */
export const RevealItem = ({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) => {
  const reduce = usePrefersReducedMotion();
  if (reduce)
    return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>;
  return as === "li" ? (
    <m.li className={className} variants={rise}>
      {children}
    </m.li>
  ) : (
    <m.div className={className} variants={rise}>
      {children}
    </m.div>
  );
};

/**
 * A thin horizontal rule that draws in from the left the first time it scrolls into view. Decorative only;
 * with reduced motion it is simply there.
 */
export const RevealRule = ({ className }: { className?: string }) => {
  const reduce = usePrefersReducedMotion();
  const base = cn("h-px origin-left bg-rule", className);
  if (reduce) return <div aria-hidden="true" className={base} />;
  return (
    <m.div
      aria-hidden="true"
      className={base}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
    />
  );
};

export default Reveal;
