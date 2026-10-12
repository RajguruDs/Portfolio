import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/motion";

const MAX_TILT = 4; // degrees
const SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

/**
 * Card that tilts slightly toward the pointer on desktop and springs back when the pointer leaves.
 * Disabled on touch devices and when reduced motion is preferred (it then renders as a plain card).
 */
const TiltCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position within the card, -0.5 … 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING);

  const enabled = finePointer && !reduce;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <m.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={cn("group/tilt will-change-transform", className)}
    >
      {children}
    </m.div>
  );
};

export default TiltCard;
