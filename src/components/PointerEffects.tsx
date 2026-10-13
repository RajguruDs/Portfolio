import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/motion";

/**
 * Desktop-only pointer effects, driven by one passive pointermove listener and one requestAnimationFrame loop
 * that stops as soon as nothing is moving. No React state changes per frame: positions are written straight to
 * element styles / CSS variables. Opt in from markup:
 *
 *   data-cursor="view"  ring expands with a "View" label (project links)
 *   data-tilt           ≤ 3° tilt toward the pointer (project images only)
 *   data-magnetic       follows the pointer by a few px (prominent call-to-action buttons only)
 *   .spotlight          faint radial highlight under the pointer (cards; styled in index.css)
 *   data-glow-area      while the pointer is inside, its [data-glow] element's light drifts toward it (hero portrait)
 *
 * Mounted only for a fine, hover-capable pointer with motion allowed, so touch devices, keyboard users and
 * reduced-motion visitors get the plain, static page.
 */

const TILT_MAX = 3; // degrees
const MAGNET_MAX = 6; // px
const RING_FOLLOW = 0.2; // share of the remaining distance the ring covers each frame
// Native cursor stays (and the custom one hides) where it carries meaning: text entry, embeds, open dialogs.
const NATIVE_CURSOR = "input, textarea, select, [contenteditable='true'], iframe, dialog[open]";
const INTERACTIVE = "a[href], button:not(:disabled), [role='button'], label, summary";

type Mode = "hidden" | "default" | "interactive" | "view";

const PointerCursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("hidden");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let frame = 0;
    let currentMode: Mode = "hidden";
    let spot: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;
    let glow: HTMLElement | null = null;

    const setModeOnce = (next: Mode) => {
      if (next !== currentMode) {
        currentMode = next;
        setMode(next);
      }
    };

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.transition = "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "";
    };

    const releaseGlow = (el: HTMLElement | null) => {
      if (!el) return;
      el.removeAttribute("data-active");
      el.style.removeProperty("--glow-x");
      el.style.removeProperty("--glow-y");
    };

    const tick = () => {
      frame = 0;
      rx += (x - rx) * RING_FOLLOW;
      ry += (y - ry) * RING_FOLLOW;
      dot.current?.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0)`);
      ring.current?.style.setProperty("transform", `translate3d(${rx}px, ${ry}px, 0)`);

      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--spot-x", `${x - r.left}px`);
        spot.style.setProperty("--spot-y", `${y - r.top}px`);
      }
      if (glow) {
        // Percentages within the glow box, clamped so the light never leaves it. CSS eases the change (index.css).
        const r = glow.getBoundingClientRect();
        const gx = Math.max(30, Math.min(70, ((x - r.left) / r.width) * 100));
        const gy = Math.max(30, Math.min(70, ((y - r.top) / r.height) * 100));
        glow.style.setProperty("--glow-x", `${gx.toFixed(1)}%`);
        glow.style.setProperty("--glow-y", `${gy.toFixed(1)}%`);
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (x - r.left) / r.width - 0.5;
        const py = (y - r.top) / r.height - 0.5;
        tilt.style.transition = "transform 200ms ease-out";
        tilt.style.transform = `perspective(1000px) rotateX(${(-py * TILT_MAX * 2).toFixed(2)}deg) rotateY(${(px * TILT_MAX * 2).toFixed(2)}deg)`;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / (r.width / 2)));
        const dy = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / (r.height / 2)));
        magnet.style.transition = "transform 150ms ease-out";
        magnet.style.transform = `translate3d(${(dx * MAGNET_MAX).toFixed(1)}px, ${(dy * MAGNET_MAX * 0.6).toFixed(1)}px, 0)`;
      }
      // Keep going only while the ring is still catching up.
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (currentMode === "hidden" && !(e.target as Element).closest?.(NATIVE_CURSOR)) {
        rx = x;
        ry = y;
        setModeOnce("default");
      }
      schedule();
    };

    // Work out what's under the pointer only when the hovered element changes, not on every move.
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element;
      if (t.closest(NATIVE_CURSOR) || root.querySelector("dialog[open]")) setModeOnce("hidden");
      else if (t.closest("[data-cursor='view']")) setModeOnce("view");
      else if (t.closest(INTERACTIVE)) setModeOnce("interactive");
      else setModeOnce("default");

      const nextSpot = t.closest<HTMLElement>(".spotlight");
      if (nextSpot !== spot) spot = nextSpot;
      const nextTilt = t.closest<HTMLElement>("[data-tilt]");
      if (nextTilt !== tilt) {
        release(tilt);
        tilt = nextTilt;
      }
      const nextGlow = t.closest("[data-glow-area]")?.querySelector<HTMLElement>("[data-glow]") ?? null;
      if (nextGlow !== glow) {
        releaseGlow(glow);
        glow = nextGlow;
        glow?.setAttribute("data-active", "");
      }
      const nextMagnet = t.closest<HTMLElement>("[data-magnetic]");
      if (nextMagnet !== magnet) {
        release(magnet);
        magnet = nextMagnet;
      }
      schedule();
    };

    const hide = () => {
      setModeOnce("hidden");
      release(tilt);
      release(magnet);
      releaseGlow(glow);
      tilt = magnet = spot = glow = null;
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) hide(); // left the window
    };
    const onVisibility = () => {
      if (document.hidden) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", hide);
      release(tilt);
      release(magnet);
      releaseGlow(glow);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-cursor" data-mode={mode}>
      {/* Outer elements carry the position; the inner shapes carry the size/scale transitions. */}
      <div ref={ring} className="pointer-cursor__pos">
        <div className="pointer-cursor__ring">
          <span className="pointer-cursor__label">View</span>
        </div>
      </div>
      <div ref={dot} className="pointer-cursor__pos">
        <div className="pointer-cursor__dot" />
      </div>
    </div>
  );
};

const PointerEffects = () => {
  const finePointer = useFinePointer();
  const reduce = usePrefersReducedMotion();
  return finePointer && !reduce ? <PointerCursor /> : null;
};

export default PointerEffects;
