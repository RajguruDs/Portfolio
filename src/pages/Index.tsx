import { Github, Linkedin, Mail, ArrowUpRight, MessageCircle, X, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Dashboards from "@/components/Dashboards";
import Certifications from "@/components/Certifications";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

const socialLinks = [
  { href: "https://github.com/RajguruDs", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/rajguru-mathiyalagan-63b921244", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:rajguru21.ds@gmail.com", icon: Mail, label: "Email" },
];

// ── Open-to-Work floating CTA ──
const OpenToWork = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const go = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(17,24,39,0.12), 0 2px 8px rgba(17,24,39,0.06)",
            maxWidth: "280px",
          }}
        >
          {/* Pulsing green dot */}
          <div className="relative flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
              Available for hire
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              Data Science intern · Junior Analyst
            </p>
          </div>

          <button
            onClick={go}
            className="flex-shrink-0 btn-primary text-xs py-1.5 px-3"
          >
            <MessageCircle className="w-3 h-3" />
            Contact
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ""; }}
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Index = () => (
  <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
    <Navigation />
    <Hero />
    <About />
    <Projects />
    <Skills />
    <Dashboards />
    <Certifications />
    <Education />
    <Contact />

    {/* ── Footer ── */}
    <footer style={{ background: "var(--bg-page)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Left — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)" }}
              >
                R
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Rajguru Mathiyalagan
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Aspiring Data Scientist · ML Engineer
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
              Mumbai, Maharashtra
            </p>
          </div>

          {/* Center — Nav links */}
          <nav className="flex flex-col sm:flex-row gap-3 items-center">
            {["about", "projects", "skills", "education", "contact"].map((id) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                className="text-xs font-medium capitalize transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ""; }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          {/* Right — Socials */}
          <div className="flex items-center gap-2 sm:justify-end">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="icon-btn"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-faint)" }}
        >
          <p>© 2025 Rajguru Mathiyalagan. All rights reserved.</p>
          <p>Built with React & Vite</p>
        </div>
      </div>
    </footer>

    {/* Floating Open-to-Work CTA */}
    <OpenToWork />

    {/* Back to top */}
    <BackToTop />
  </div>
);

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full"
          style={{
            bottom: "6.5rem",
            background: "var(--accent)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(37,99,235,0.30)",
          }}
          whileHover={{ scale: 1.12, boxShadow: "0 6px 20px rgba(37,99,235,0.40)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default Index;
