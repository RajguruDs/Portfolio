import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PointerEffects from "@/components/PointerEffects";
import { prefersReducedMotion } from "@/lib/utils";

// Handles scroll position on route changes: jump to the hash target if there is one
// (retrying briefly while a lazy route renders), otherwise return to the top.
const useScrollManager = () => {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef(pathname);

  useEffect(() => {
    // Smooth-scroll only within the same page; arriving from another route jumps straight to the target.
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer: number | undefined;

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: samePage && !prefersReducedMotion() ? "smooth" : "instant", block: "start" });
        // Move focus for keyboard and screen-reader users without a second jump.
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      } else if (attempts++ < 20) {
        timer = window.setTimeout(scroll, 50);
      }
    };
    scroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash, key]);
};

const Layout = ({ children }: { children: ReactNode }) => {
  useScrollManager();

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded bg-ink px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <PointerEffects />
      <Navigation />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
