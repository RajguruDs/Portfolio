import { Github, Linkedin, Mail, ArrowRight, Download, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const stats = [
  { value: "8.60", label: "CGPA", sub: "B.Sc. IT" },
  { value: "90%", label: "ML Accuracy", sub: "PropVision" },
  { value: "1.6M+", label: "Records", sub: "Training data" },
  { value: "2", label: "ML Projects", sub: "Deployed" },
];

const Hero = () => {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ paddingTop: "60px" }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 80% 15%, rgba(37,99,235,0.07) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 10% 90%, rgba(13,148,136,0.06) 0%, transparent 55%), " +
            "#F7F8FA",
        }}
      />
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* ── Left: Text ── */}
          <div>
            {/* Available badge */}
            <motion.div {...up(0)} className="mb-6">
              <span className="tag tag-green text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1" />
                Open to opportunities
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...up(0.06)}
              className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.06] mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Rajguru<br />
              <span className="text-accent-gradient">Mathiyalagan</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              {...up(0.12)}
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Aspiring Data Scientist · ML Engineer
            </motion.p>

            {/* Location */}
            <motion.p
              {...up(0.15)}
              className="text-sm flex items-center gap-1.5 mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              Mumbai, Maharashtra
            </motion.p>

            {/* Bio */}
            <motion.p
              {...up(0.19)}
              className="text-base leading-relaxed mb-8 max-w-[480px]"
              style={{ color: "var(--text-muted)" }}
            >
              Building end-to-end data science solutions — from raw data exploration
              to deployed ML systems. Currently pursuing B.Sc. IT at D.G. Ruparel
              College with a 8.60 CGPA.
            </motion.p>

            {/* CTAs */}
            <motion.div {...up(0.24)} className="flex flex-wrap gap-3 mb-8">
              <button onClick={() => go("projects")} className="btn-primary">
                View Projects <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://drive.google.com/uc?export=download&id=17XkK5DHS0-aPYS9Edt1OErgMqOpqb2DE"
                download
                className="btn-secondary"
              >
                <Download className="w-4 h-4" /> Resume
              </a>
              <button onClick={() => go("contact")} className="btn-secondary">
                Contact Me
              </button>
            </motion.div>

            {/* Social icons */}
            <motion.div {...up(0.29)} className="flex items-center gap-2">
              {[
                { href: "https://github.com/RajguruDs", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/rajguru-mathiyalagan-63b921244", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:rajguru21.ds@gmail.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="icon-btn"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Stats grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3"
          >
            {stats.map(({ value, label, sub }, i) => (
              <motion.div
                key={label}
                className="stat-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              >
                <p
                  className="text-3xl font-extrabold tracking-tight mb-0.5 text-accent-gradient"
                >
                  {value}
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
                  {sub}
                </p>
              </motion.div>
            ))}

            {/* Tech stack mini strip */}
            <div
              className="col-span-2 rounded-xl p-4"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-semibold mb-2.5" style={{ color: "var(--text-muted)" }}>
                TECH STACK
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Python", "SQL", "Pandas", "Scikit-learn", "XGBoost", "Flask", "React", "Tableau"].map((t) => (
                  <span key={t} className="tag text-[11px]">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
