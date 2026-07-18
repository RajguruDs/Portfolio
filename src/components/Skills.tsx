import { motion } from "framer-motion";

const categories = [
  {
    icon: "{ }",
    label: "Languages",
    color: "#2563EB",
    grad: "linear-gradient(135deg,#2563EB,#0D9488)",
    tint: "#EFF6FF",
    border: "#BFDBFE",
    isCode: true,
    skills: ["Python", "SQL"],
  },
  {
    icon: "⚡",
    label: "Libraries & Frameworks",
    color: "#7C3AED",
    grad: "linear-gradient(135deg,#7C3AED,#EC4899)",
    tint: "#F5F3FF",
    border: "#DDD6FE",
    isCode: false,
    skills: ["Pandas", "NumPy", "Scikit-learn", "XGBoost", "Matplotlib", "Seaborn", "Flask", "React (basic)"],
  },
  {
    icon: "🤖",
    label: "Machine Learning",
    color: "#0284C7",
    grad: "linear-gradient(135deg,#0284C7,#2563EB)",
    tint: "#F0F9FF",
    border: "#BAE6FD",
    isCode: false,
    skills: [
      "Supervised Learning", "Unsupervised Learning", "Predictive Modeling",
      "Ensemble Learning", "Gradient Boosting", "Random Forest",
      "Logistic Regression", "K-Means Clustering", "SMOTE",
      "Cross-validation", "Hyperparameter Tuning", "Model Evaluation",
    ],
  },
  {
    icon: "📊",
    label: "Data Skills",
    color: "#0D9488",
    grad: "linear-gradient(135deg,#0D9488,#059669)",
    tint: "#F0FDFA",
    border: "#99F6E4",
    isCode: false,
    skills: [
      "Exploratory Data Analysis (EDA)", "Data Wrangling", "Data Preprocessing",
      "Feature Engineering", "Data Visualization", "Statistical Analysis",
      "Hypothesis Testing", "Data Cleaning", "Communication of Insights",
    ],
  },
  {
    icon: "🛠️",
    label: "Tools & Platforms",
    color: "#B45309",
    grad: "linear-gradient(135deg,#B45309,#D97706)",
    tint: "#FFFBEB",
    border: "#FDE68A",
    isCode: false,
    skills: ["Jupyter Notebook", "Git", "GitHub", "Tableau", "Google Colab", "VS Code", "Microsoft Excel"],
  },
  {
    icon: "🚀",
    label: "Deployment & APIs",
    color: "#6D28D9",
    grad: "linear-gradient(135deg,#6D28D9,#7C3AED)",
    tint: "#F5F3FF",
    border: "#C4B5FD",
    isCode: false,
    skills: ["Flask", "React.js", "REST API", "PostgreSQL"],
  },
];

const allSkills = [
  "Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "Matplotlib",
  "Seaborn", "Flask", "React.js", "Tableau", "GitHub", "Jupyter Notebook",
  "Google Colab", "PostgreSQL", "REST API", "VS Code", "Microsoft Excel",
];

const Skills = () => (
  <section
    id="skills"
    className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16 relative"
    style={{ background: "var(--bg-subtle)" }}
  >
    <div className="absolute inset-0 dot-grid pointer-events-none opacity-50" />

    <div className="max-w-6xl mx-auto relative z-10">
      <div className="section-label">Technical Skills</div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          What I work with
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>{allSkills.length}+ technologies</span>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            style={{
              background: "#FFFFFF",
              border: `1px solid ${cat.border}`,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(17,24,39,0.05)",
            }}
            whileHover={{ y: -3, boxShadow: `0 10px 28px ${cat.color}12, 0 2px 8px rgba(17,24,39,0.06)` }}
          >
            {/* Gradient bar */}
            <div className="h-[3px]" style={{ background: cat.grad }} />

            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: `linear-gradient(to bottom, ${cat.tint}, #fff)`, borderBottom: `1px solid ${cat.border}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#fff",
                  border: `1px solid ${cat.border}`,
                  fontSize: cat.isCode ? "11px" : "16px",
                  fontFamily: cat.isCode ? "'JetBrains Mono', monospace" : "inherit",
                  fontWeight: 700,
                  color: cat.color,
                  boxShadow: `0 2px 8px ${cat.color}14`,
                }}
              >
                {cat.icon}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h3 className="text-xs font-extrabold" style={{ color: cat.color }}>{cat.label}</h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#fff", color: cat.color, border: `1px solid ${cat.border}` }}
                >
                  {cat.skills.length}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="p-3">
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((s) => (
                  <motion.span
                    key={s}
                    className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full cursor-default"
                    style={{
                      background: "var(--bg-subtle)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                    whileHover={{
                      background: cat.tint,
                      color: cat.color,
                      borderColor: cat.border,
                      scale: 1.04,
                    }}
                    transition={{ duration: 0.12 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Marquee */}
      <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] mb-4" style={{ color: "var(--text-faint)" }}>
          Full stack · {allSkills.length} technologies
        </p>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...allSkills, ...allSkills].map((s, i) => (
              <span key={i} className="tag flex-shrink-0 font-medium" style={{ fontSize: "12px" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
