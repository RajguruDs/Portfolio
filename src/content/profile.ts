// Experience, capabilities, skills and credentials.
// Sources: public/Rajguru_Resume.pdf, the project notebooks, and the Roopsee repositories
// authored under github.com/RajguruDs (roopsee-doctor-validation, roopsee-product-scoring).

export type Capability = {
  title: string;
  summary: string;
  evidence: { label: string; to: string }[];
};

export const capabilities: Capability[] = [
  {
    title: "Data Analytics",
    summary: "Cleaning real-world data, exploring it, and turning the results into dashboards people can filter.",
    evidence: [
      { label: "Marketing Campaign", to: "/work/marketing-campaign-analysis" },
      { label: "Employee Turnover", to: "/work/attrition" },
    ],
  },
  {
    title: "Data Science",
    summary:
      "Hypothesis tests, correlation analysis and clustering — and being clear about what the data can't support.",
    evidence: [
      { label: "Employee Turnover", to: "/work/attrition" },
      { label: "Marketing Campaign", to: "/work/marketing-campaign-analysis" },
    ],
  },
  {
    title: "Machine Learning",
    summary: "Regression and classification models with feature engineering, imbalance handling and honest evaluation.",
    evidence: [
      { label: "PropVision", to: "/work/propvision" },
      { label: "Employee Turnover", to: "/work/attrition" },
    ],
  },
  {
    title: "AI/ML Engineering",
    summary: "Putting trained models behind an API, routing requests to the right model and logging what they predict.",
    evidence: [{ label: "PropVision", to: "/work/propvision" }],
  },
  {
    title: "Applied Software & Data Engineering",
    summary: "Python services, data-validation tooling and automated tests for systems other people depend on.",
    evidence: [
      { label: "Roopsee internship", to: "/#experience" },
      { label: "PropVision", to: "/work/propvision" },
    ],
  },
];

export type Role = {
  organisation: string;
  title: string;
  /** Kind of engagement, shown above the organisation name. */
  type: string;
  /** Dates as confirmed by Rajguru. */
  period: string;
  context: string;
  /**
   * Responsibility groups. `text` is the role's scope as written in the offer letter; `did` (optional) is only
   * work evidenced in the repositories, so the scope is never presented as personally completed work.
   */
  highlights: { lead: string; text: string; did?: string }[];
  stack: string[];
};

export const experience: Role[] = [
  {
    organisation: "Roopsee",
    title: "Junior AI/ML Data Analyst Intern",
    type: "Internship",
    period: "Sep 2026 – Oct 2026",
    context:
      "The role spans data analysis, AI/ML support and web development. Roopsee scores skincare products against a user's skin profile; my hands-on work was on the data and validation side of that scoring system.",
    highlights: [
      {
        lead: "Data Collection & Preparation",
        text: "Collecting, cleaning and preparing data for analysis and AI/ML work.",
        did: "Implemented auditable ingredient-name resolution for an 87-product validation catalogue — a fixed sequence of exclusion lists, reviewed mappings and exact or normalised matches, with no fuzzy matching — and worked on a canonical population of 4,037 products (one per GTIN).",
      },
      {
        lead: "AI/ML & Data Analysis",
        text: "Data analysis and basic AI/ML model development in support of the company's AI/ML initiatives.",
        did: "My hands-on work here was on Roopsee's rule-based product-scoring system: tracing how each product's score is derived from its raw ingredient names.",
      },
      {
        lead: "Application & Database Development",
        text: "Web application development across the frontend and backend, and database management for AI/ML projects.",
        did: "Built a Python and Flask doctor-validation service that lets a domain expert trace each catalogue product from raw ingredient names, through the reviewed mapping, to its final score.",
      },
      {
        lead: "Testing, Dashboards & Deployment",
        text: "Testing, debugging and deploying AI/ML and web solutions, and building dashboards that support data-driven decisions.",
        did: "Wrote tests for the catalogue, scoring rules and API, plus an end-to-end check that requests all 87 products from the running service; the scoring pipeline has a pytest suite for GTIN handling, ingredient parsing and scoring invariants.",
      },
    ],
    stack: ["Python", "pandas", "Flask", "pytest", "Excel / openpyxl", "JavaScript"],
  },
];

export type SkillTool = {
  name: string;
  /** Short code shown on the tool's tile — the conventional import alias or abbreviation. */
  code: string;
};

export type SkillGroup = {
  title: string;
  summary: string;
  icon: "analysis" | "ml" | "backend" | "tools";
  /** Recognisable tools, shown as tiles. */
  tools: SkillTool[];
  /** Techniques and practices, shown as text lists (optionally under a heading). */
  practices: { heading?: string; items: string[] }[];
  /** Projects where these skills are used. */
  evidence: { label: string; to: string }[];
};

// Hands-on skills: every entry appears in project code or internship work (see `evidence`).
// SciPy and imbalanced-learn come from the projects' own tool lists (src/content/projects.ts).
export const skillGroups: SkillGroup[] = [
  {
    title: "Data Analysis & Visualisation",
    summary: "Cleaning, exploring and charting real datasets.",
    icon: "analysis",
    tools: [
      { name: "Python", code: "py" },
      { name: "pandas", code: "pd" },
      { name: "NumPy", code: "np" },
      { name: "Matplotlib", code: "plt" },
      { name: "Seaborn", code: "sns" },
      { name: "Tableau", code: "tab" },
    ],
    practices: [{ items: ["Exploratory data analysis", "Outlier treatment (IQR)"] }],
    evidence: [
      { label: "Marketing Campaign", to: "/work/marketing-campaign-analysis" },
      { label: "Employee Turnover", to: "/work/attrition" },
      { label: "PropVision", to: "/work/propvision" },
    ],
  },
  {
    title: "Machine Learning & Statistics",
    summary: "Supervised models, clustering and statistical tests, and how to evaluate them.",
    icon: "ml",
    tools: [
      { name: "scikit-learn", code: "sk" },
      { name: "XGBoost", code: "xgb" },
      { name: "imbalanced-learn", code: "imb" },
      { name: "SciPy", code: "sp" },
    ],
    practices: [
      {
        heading: "Modelling",
        items: [
          "Gradient Boosting",
          "Random Forest",
          "Logistic Regression",
          "K-Means clustering",
          "SMOTE",
          "Feature engineering",
        ],
      },
      {
        heading: "Statistics & evaluation",
        items: ["Hypothesis testing (Welch t-test)", "Pearson correlation", "R², MAE, RMSE", "ROC-AUC"],
      },
    ],
    evidence: [
      { label: "PropVision", to: "/work/propvision" },
      { label: "Employee Turnover", to: "/work/attrition" },
      { label: "Marketing Campaign", to: "/work/marketing-campaign-analysis" },
    ],
  },
  {
    title: "Databases, APIs & Data Engineering",
    summary: "Serving models and validating data behind small APIs.",
    icon: "backend",
    tools: [
      { name: "SQL", code: "sql" },
      { name: "PostgreSQL", code: "pg" },
      { name: "Flask REST APIs", code: "api" },
      { name: "pytest", code: "test" },
    ],
    practices: [{ items: ["Data validation"] }],
    evidence: [
      { label: "PropVision", to: "/work/propvision" },
      { label: "Roopsee internship", to: "/#experience" },
    ],
  },
  {
    title: "Development Tools & Applications",
    summary: "Version control, notebooks, and the front ends the projects ship with.",
    icon: "tools",
    tools: [
      { name: "Git & GitHub", code: "git" },
      { name: "Jupyter", code: "nb" },
      { name: "VS Code", code: "vsc" },
      { name: "React", code: "jsx" },
      { name: "JavaScript", code: "js" },
      { name: "Vercel", code: "vcl" },
    ],
    practices: [],
    evidence: [
      { label: "PropVision", to: "/work/propvision" },
      { label: "Roopsee internship", to: "/#experience" },
    ],
  },
];

// Covered in coursework, certificates and the resume, without a project on this site to show for it yet.
export const additionalKnowledge = {
  summary: "Covered in coursework and training, but not yet shown in a project on this site.",
  source: "the resume, course certificates and the Deloitte job simulation",
  items: ["Microsoft Excel", "Google Colab", "A/B testing concepts", "ETL concepts"],
};

export const education = {
  degree: "B.Sc. Information Technology",
  institution: "D.G. Ruparel College, University of Mumbai",
  period: "2023 – 2026",
  status: "Completed",
  grade: "CGPA 8.60 / 10",
  coursework: ["Statistics", "Data Structures", "DBMS", "Linear Algebra", "Operating Systems"],
};

export type Credential = {
  title: string;
  issuer: string;
  year: string;
  kind: "Course certificate" | "Job simulation";
  note: string;
  href?: string;
};

export const credentials: Credential[] = [
  {
    title: "Data Science with Python",
    issuer: "Simplilearn",
    year: "2025",
    kind: "Course certificate",
    note: "Data wrangling, EDA, statistical modelling, supervised and unsupervised learning, model evaluation.",
    href: "https://www.linkedin.com/posts/rajguru-mathiyalagan-63b921244_datascience-simplilearn-edatools-activity-7328786367805648896-bsrZ",
  },
  {
    title: "Introduction to Programming Using Python",
    issuer: "Simplilearn",
    year: "2024",
    kind: "Course certificate",
    note: "Python fundamentals, OOP, file handling, NumPy and pandas.",
    href: "https://www.linkedin.com/posts/rajguru-mathiyalagan-63b921244_rajguru-mathiyalagan-has-successfully-completed-activity-7277603323740901376-uJWj",
  },
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte via Forage",
    year: "2026",
    kind: "Job simulation",
    note: "Practical tasks in data analysis and forensic technology, including spreadsheet analysis and data classification.",
  },
];
