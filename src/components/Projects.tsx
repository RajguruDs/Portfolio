import { Github, ExternalLink, ArrowUpRight, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Data ─────────────────────────────────────────────────── */
const projects = [
  {
    num: "01",
    featured: true,
    color: "#2563EB",
    grad: "linear-gradient(135deg,#2563EB 0%,#0D9488 100%)",
    tint: "#EFF6FF",
    border: "#BFDBFE",
    badge: "Full-Stack UAV Performance Prediction Platform",
    title: "PropVision",
    subtitle: "End-to-End ML · Large-Scale Data · Full-Stack Deployment",
    description:
      "Engineered an end-to-end ML system to predict UAV propeller thrust, power, and efficiency. Physics-informed feature engineering, advanced ensemble modeling, and production deployment via REST API.",
    stats: [
      { v: "90%", l: "Accuracy" },
      { v: "1.6M", l: "Records" },
      { v: "REST", l: "API" },
    ],
    highlights: [
      "1.6M-Record ML Pipeline: End-to-end system predicting UAV propeller thrust, power, and efficiency across 1.6 million experimental records.",
      "Physics-Informed Feature Engineering: Numerical integration for Blade Area & Solidity aerodynamic features, improving model generalization.",
      "Advanced Modeling (90% Accuracy): XGBoost, Gradient Boosting, Ensemble Learning with cross-validation and hyperparameter tuning.",
      "Production Deployment via REST API: React.js frontend + Flask REST API + PostgreSQL, Tableau dashboard, and Drone Type Recommender.",
    ],
    tags: ["XGBoost", "Flask", "React.js", "PostgreSQL", "Tableau", "Ensemble", "Python"],
    github: "https://github.com/RajguruDs",
    demo: "https://uav-propeller-ml-project.vercel.app/",
  },
  {
    num: "02",
    featured: false,
    color: "#7C3AED",
    grad: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)",
    tint: "#F5F3FF",
    border: "#DDD6FE",
    badge: "HR Analytics · Classification",
    title: "Employee Turnover Analysis",
    subtitle: "ML-Powered Attrition Prediction",
    description:
      "Classification pipeline predicting employee attrition with 90% accuracy and 0.90 ROC-AUC. SMOTE for imbalance, K-Means behavioral clustering, and feature importance-driven retention insights.",
    stats: [
      { v: "90%", l: "Accuracy" },
      { v: "0.90", l: "ROC-AUC" },
      { v: "14K+", l: "Records" },
    ],
    highlights: [
      "Random Forest + Logistic Regression + k-fold CV",
      "SMOTE to correct class imbalance",
      "K-Means behavioral segmentation",
      "Feature importance → retention recommendations",
    ],
    tags: ["Random Forest", "Logistic Regression", "SMOTE", "K-Means", "Python"],
    github: "https://github.com/RajguruDs/Employee-Turnover-Analysis-using-Machine-Learning",
    demo: null,
  },
];

/* ─── Browser window mockup ─────────────────────────────────── */
const BrowserMock = ({ p }: { p: typeof projects[0] }) => (
  <div
    className="rounded-2xl overflow-hidden w-full"
    style={{
      border: `1px solid ${p.border}`,
      boxShadow: `0 8px 32px ${p.color}18, 0 2px 8px rgba(17,24,39,0.08)`,
      background: "#FFFFFF",
    }}
  >
    {/* Browser chrome */}
    <div
      className="flex items-center gap-2 px-4 py-3"
      style={{ background: p.tint, borderBottom: `1px solid ${p.border}` }}
    >
      <div className="flex gap-1.5">
        {["#FC5F57", "#FEBD2E", "#27C840"].map((c) => (
          <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div
        className="flex-1 mx-3 h-6 rounded-md flex items-center px-3 text-[11px] font-mono"
        style={{ background: "rgba(255,255,255,0.75)", color: "#6B7280" }}
      >
        {p.demo ?? "github.com / " + p.title.toLowerCase().replace(" ", "-")}
      </div>
      <div
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: p.color, color: "#fff" }}
      >
        Live
      </div>
    </div>

    {/* Dashboard content */}
    {p.num === "01" ? <PropVisionUI color={p.color} tint={p.tint} border={p.border} /> : <AttritionUI color={p.color} tint={p.tint} border={p.border} />}
  </div>
);

const PropVisionUI = ({ color, tint, border }: { color: string; tint: string; border: string }) => (
  <div className="p-4 space-y-3" style={{ background: "#FAFCFF", minHeight: "220px" }}>
    {/* Metric row */}
    <div className="grid grid-cols-3 gap-2">
      {[{ v: "90%", l: "Accuracy" }, { v: "1.6M", l: "Records" }, { v: "5x", l: "Speed" }].map((m) => (
        <div key={m.l} className="rounded-xl p-3 text-center" style={{ background: tint, border: `1px solid ${border}` }}>
          <p className="text-xl font-extrabold" style={{ color }}>{m.v}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{m.l}</p>
        </div>
      ))}
    </div>
    {/* Chart */}
    <div className="rounded-xl p-3" style={{ background: "#fff", border: `1px solid ${border}` }}>
      <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Thrust vs RPM</p>
      <div className="flex items-end gap-1 h-16">
        {[45, 60, 52, 80, 68, 90, 74, 95, 82, 88, 76, 92].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: color, opacity: 0.18 + i * 0.06 }} />
        ))}
      </div>
    </div>
    {/* Mini status bar */}
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      <span className="text-[10px] text-gray-400 font-medium">Model active · Last prediction 2s ago</span>
    </div>
  </div>
);

const AttritionUI = ({ color, tint, border }: { color: string; tint: string; border: string }) => (
  <div className="p-4 space-y-3" style={{ background: "#FDFAFF", minHeight: "220px" }}>
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-xl p-3" style={{ background: tint, border: `1px solid ${border}` }}>
        <p className="text-[10px] text-gray-400 mb-1">Attrition Rate</p>
        <div className="h-1.5 rounded-full mb-1" style={{ background: "#E5E7EB" }}>
          <div className="h-full w-[16%] rounded-full" style={{ background: color }} />
        </div>
        <p className="text-lg font-extrabold" style={{ color }}>16.1%</p>
      </div>
      <div className="rounded-xl p-3" style={{ background: tint, border: `1px solid ${border}` }}>
        <p className="text-[10px] text-gray-400 mb-1">ROC-AUC</p>
        <p className="text-2xl font-extrabold" style={{ color }}>0.90</p>
      </div>
    </div>
    <div className="rounded-xl p-3" style={{ background: "#fff", border: `1px solid ${border}` }}>
      <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Feature Importance</p>
      {[["OverTime", 88], ["MonthlyIncome", 72], ["Age", 58], ["JobLevel", 44]].map(([f, w]) => (
        <div key={f} className="flex items-center gap-2 mb-1.5">
          <span className="text-[9px] w-24 text-gray-400 shrink-0">{f}</span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "#E5E7EB" }}>
            <div className="h-full rounded-full" style={{ width: `${w}%`, background: color, opacity: 0.75 }} />
          </div>
          <span className="text-[9px] text-gray-400">{w}%</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Section ───────────────────────────────────────────────── */
const Projects = () => (
  <section
    id="projects"
    className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16"
    style={{ background: "var(--bg-page)" }}
  >
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="section-label">Featured Projects</div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Things I've built
        </h2>
        <a
          href="https://github.com/RajguruDs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost self-start sm:self-auto"
        >
          <Github className="w-3.5 h-3.5" />
          All on GitHub
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Project cards */}
      <div className="space-y-6">
        {projects.map((p, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${p.border}`,
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(17,24,39,0.05)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
            whileHover={{ y: -4, boxShadow: `0 20px 48px ${p.color}12, 0 4px 12px rgba(17,24,39,0.07)` }}
          >
            {/* Top gradient bar */}
            <div className="h-[3px]" style={{ background: p.grad }} />

            {/* Decorative large number */}
            <div
              className="absolute top-4 right-8 text-[120px] font-black leading-none select-none pointer-events-none"
              style={{ color: `${p.color}06` }}
            >
              {p.num}
            </div>

            <div className="p-6 sm:p-8 grid lg:grid-cols-[1fr_420px] gap-8 xl:gap-12 items-start relative z-10">
              {/* ── Left ── */}
              <div className="flex flex-col h-full">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  {p.featured && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: p.tint, color: p.color, border: `1px solid ${p.border}` }}
                    >
                      <Zap className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    {p.badge.includes("·") ? p.badge.split("·").slice(-1)[0].trim() : p.badge}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm font-semibold mb-4" style={{ color: p.color }}>
                  {p.subtitle}
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                  {p.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  {p.highlights.map((h) => (
                    <div key={h} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: p.color }} />
                      <span className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: p.tint, color: p.color, border: `1px solid ${p.border}` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex gap-4 mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                  {p.stats.map(({ v, l }) => (
                    <div key={l}>
                      <p className="text-xl font-extrabold" style={{ color: p.color }}>{v}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>{l}</p>
                    </div>
                  ))}
                </div>

                {/* Action buttons — pushed to bottom */}
                <div className="flex flex-wrap gap-2.5 mt-auto">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    <Github className="w-3.5 h-3.5" /> View Code
                  </a>
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* ── Right: Browser mockup ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                className="hidden lg:block"
              >
                <BrowserMock p={p} />
              </motion.div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
