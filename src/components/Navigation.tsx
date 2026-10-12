import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { homeSections, links, type HomeSectionId } from "@/content/site";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, usePrefersReducedMotion } from "@/lib/motion";

// Tracks which home-page section is currently in view.
const useActiveSection = (enabled: boolean) => {
  const [active, setActive] = useState<HomeSectionId>("top");

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as HomeSectionId);
        });
      },
      // A thin band just below the header decides the active section.
      { rootMargin: "-80px 0px -70% 0px" },
    );
    homeSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
};

const Navigation = () => {
  const reduce = usePrefersReducedMotion();
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navLinks = homeSections.map(({ id, label }) => ({
    id,
    label,
    to: id === "top" ? "/" : `/#${id}`,
    current: onHome && active === id,
  }));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-sm transition-colors",
        scrolled || open ? "border-rule" : "border-transparent",
      )}
      style={{ backgroundColor: "color-mix(in srgb, var(--paper) 94%, transparent)" }}
    >
      <div className="page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          to="/"
          className="font-serif text-xl tracking-[-0.01em] text-ink"
          aria-label="Rajguru Mathiyalagan — home"
        >
          Rajguru Mathiyalagan
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              aria-current={l.current ? "location" : undefined}
              className={cn(
                "group relative rounded px-3 py-2 text-[0.9375rem] transition-colors duration-200",
                l.current ? "text-ink" : "text-ink-3 hover:text-ink focus-visible:text-ink",
              )}
            >
              {l.label}
              {/* Underline grows from the left on hover/focus; stays full for the current section. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px origin-left bg-ink transition-transform duration-300 ease-out",
                  l.current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                )}
              />
            </Link>
          ))}
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary ml-3 min-h-[38px] px-4 text-sm"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Resume
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Primary"
            // Opacity/translate only: animating height to "auto" makes Framer Motion restore the old
            // scroll position on exit, which would undo the jump to the chosen section.
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT_EXPO }}
            className="absolute inset-x-0 top-full border-y border-rule bg-paper shadow-[0_12px_24px_-16px_rgba(22,24,29,0.25)] lg:hidden"
          >
            <ul className="page flex flex-col py-3">
              {navLinks.map((l, i) => (
                <m.li
                  key={l.id}
                  {...(reduce
                    ? {}
                    : {
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.35, delay: 0.04 + i * 0.035, ease: EASE_OUT_EXPO },
                      })}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    aria-current={l.current ? "location" : undefined}
                    className={cn(
                      "flex min-h-[48px] items-center border-b border-rule text-base",
                      l.current ? "font-medium text-ink" : "text-ink-2",
                    )}
                  >
                    {l.label}
                  </Link>
                </m.li>
              ))}
              <li className="pt-4">
                <a href={links.resume} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
