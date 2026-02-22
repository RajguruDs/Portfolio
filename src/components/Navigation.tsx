import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

const links = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "dashboards", label: "Dashboards" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["home", ...links.map((l) => l.id)];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.35, rootMargin: "-60px 0px -35% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "border-b" : "bg-transparent"
        }`}
      style={
        scrolled
          ? {
            background: "rgba(255,255,255,0.97)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-xs)",
            backdropFilter: "blur(8px)",
          }
          : {}
      }
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--accent) 0%, var(--teal) 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)" }}
          >
            R
          </div>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            Rajguru<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>.ds</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="relative px-3.5 py-1.5 text-sm rounded-md font-medium transition-all duration-150"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  background: isActive ? "var(--accent-light)" : "transparent",
                }}
              >
                {l.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: "var(--accent-light)",
                      border: "1px solid var(--accent-border)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://drive.google.com/uc?export=download&id=17XkK5DHS0-aPYS9Edt1OErgMqOpqb2DE"
            download
            className="btn-ghost text-xs py-1.5 px-3"
          >
            Resume
          </a>
          <button onClick={() => go("contact")} className="btn-primary text-xs py-2 px-4">
            Let's Talk
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden overflow-hidden border-b"
            style={{ background: "#FFFFFF", borderColor: "var(--border)" }}
          >
            <div className="px-6 py-3 flex flex-col gap-1">
              {links.map((l) => {
                const isActive = active === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => go(l.id)}
                    className="text-left px-3 py-2.5 text-sm rounded-md font-medium transition-colors"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                      background: isActive ? "var(--accent-light)" : "transparent",
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
              <button
                onClick={() => go("contact")}
                className="btn-primary mt-2 justify-center"
              >
                Let's Talk
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
