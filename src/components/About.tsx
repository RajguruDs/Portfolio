import { Download } from "lucide-react";
import { motion } from "framer-motion";

const downloadResume = () => {
  const a = document.createElement("a");
  a.href = "/Rajguru_Mathiyalagan_Resume.pdf";
  a.download = "Rajguru_Mathiyalagan_Resume.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const facts = [
  { k: "Degree", v: "B.Sc. Information Technology" },
  { k: "College", v: "D.G. Ruparel College" },
  { k: "University", v: "Mumbai University" },
  { k: "CGPA", v: "8.60 / 10" },
  { k: "Batch", v: "2023 – 2026" },
  { k: "Focus", v: "End-to-End ML Systems" },
  { k: "Location", v: "Mumbai, Maharashtra" },
];

const About = () => (
  <section
    id="about"
    className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16"
    style={{ background: "var(--bg-subtle)" }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="section-label">About Me</div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">

        {/* Left — Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-5 tracking-tight leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Entry-Level Data Scientist{" "}
            <span className="text-accent-gradient">ready to make an impact.</span>
          </h2>

          <div
            className="space-y-4 text-base leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              Hands-on experience building and deploying end-to-end machine learning systems.
              Built a{" "}
              <strong style={{ color: "var(--text-primary)" }}>UAV performance prediction platform</strong>
              {" "}processing{" "}
              <strong style={{ color: "var(--text-primary)" }}>1.6 million records</strong>
              {" "}using Physics-Informed ML,{" "}
              <strong style={{ color: "var(--text-primary)" }}>XGBoost</strong>, and ensemble methods.
            </p>
            <p>
              Developed full-stack ML applications with{" "}
              <strong style={{ color: "var(--text-primary)" }}>Flask and React</strong>, and communicated
              insights through interactive{" "}
              <strong style={{ color: "var(--text-primary)" }}>Tableau dashboards</strong>. Currently
              pursuing a B.Sc. in Information Technology{" "}
              <strong style={{ color: "var(--text-primary)" }}>(CGPA: 8.60/10)</strong>{" "}and seeking
              opportunities as a Data Science intern or junior analyst.
            </p>
          </div>

          {/* Code snippet — PropVision XGBoost */}
          <div
            className="mt-7 rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(17,24,39,0.05)" }}
          >
            {/* File tab */}
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#F3F4F6", borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1.5">
                {["#FC5F57", "#FEBD2E", "#27C840"].map(c => <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
              </div>
              <span className="text-[10px] font-mono ml-2" style={{ color: "var(--text-muted)" }}>propvision_model.py</span>
            </div>
            <div
              className="p-4 font-mono text-xs leading-relaxed overflow-x-auto"
              style={{ background: "#FAFAFA", color: "var(--text-muted)" }}
            >
              <span style={{ color: "#0D9488" }}># PropVision — UAV Thrust Prediction</span><br />
              <span style={{ color: "#7C3AED" }}>from</span>
              <span> xgboost </span>
              <span style={{ color: "#7C3AED" }}>import</span>
              <span> XGBRegressor</span><br /><br />
              <span style={{ color: "#7C3AED" }}>model</span>
              <span> = </span>
              <span style={{ color: "#2563EB" }}>XGBRegressor</span>
              <span>(</span>
              <span style={{ color: "#D97706" }}>n_estimators</span>
              <span>=500, </span>
              <span style={{ color: "#D97706" }}>max_depth</span>
              <span>=6)</span><br />
              <span style={{ color: "#7C3AED" }}>model</span>
              <span>.</span>
              <span style={{ color: "#2563EB" }}>fit</span>
              <span>(X_train, y_train)</span>
              <span style={{ color: "#0D9488" }}>  # 1.6M records</span><br />
              <span style={{ color: "#7C3AED" }}>score</span>
              <span> = model.</span>
              <span style={{ color: "#2563EB" }}>score</span>
              <span>(X_test, y_test)</span>
              <span style={{ color: "#0D9488" }}>  # → 0.90</span>
            </div>
          </div>

          <button onClick={downloadResume} className="btn-primary mt-7">
            <Download className="w-4 h-4" /> Download Resume
          </button>
        </motion.div>

        {/* Right — Facts card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="card-flat p-5">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-faint)" }}
            >
              Quick Facts
            </p>
            <dl className="space-y-3">
              {facts.map(({ k, v }) => (
                <div
                  key={k}
                  className="flex gap-3 text-sm pb-3 last:pb-0"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <dt
                    className="w-24 flex-shrink-0 text-xs font-semibold"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {k}
                  </dt>
                  <dd
                    className="font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;
