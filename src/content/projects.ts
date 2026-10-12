// Project summaries for the home page. Every figure here is copied from a saved notebook output;
// the case-study pages in src/pages/work/ give the evaluation context for each one.

export const categories = ["Analytics", "Machine Learning"] as const;

export type Category = (typeof categories)[number];

export type Outcome = {
  value: string;
  label: string;
};

export type ProjectSummary = {
  slug: string;
  path: string;
  title: string;
  kind: string;
  categories: Category[];
  problem: string;
  contribution: string;
  tools: string[];
  outcomes: Outcome[];
  links: { label: string; href: string }[];
  /** Decorative cover artwork for the home-page list (design/covers). Case studies keep the real evidence. */
  thumb: { src: string; width: number; height: number; alt: string };
};

export const projects: ProjectSummary[] = [
  {
    slug: "propvision",
    path: "/work/propvision",
    title: "PropVision",
    kind: "Regression · Applied ML",
    categories: ["Machine Learning"],
    problem:
      "Predict a UAV propeller's thrust coefficient, power coefficient and efficiency from its geometry and operating conditions.",
    contribution:
      "Engineered blade-area and solidity features from blade geometry, trained XGBoost and Gradient Boosting regressors, and served the models through a Flask API and React app that logs predictions to PostgreSQL.",
    tools: ["Python", "pandas", "XGBoost", "scikit-learn", "Flask", "PostgreSQL", "React", "Tableau"],
    outcomes: [
      { value: "0.93–0.99", label: "Test R² across three targets, Models A & B (random 80/20 split — read the caveats)" },
      { value: "2 models", label: "Routed by blade count inside the deployed prediction API" },
    ],
    thumb: {
      src: "/covers/propvision-cover.webp",
      width: 1600,
      height: 1000,
      alt: "Portfolio artwork (illustration, not project output): a navy three-blade propeller inside a dashed rotor disc, with airflow lines bending around it and an abstract scatter-and-trend-line motif.",
    },
    links: [
      { label: "GitHub", href: "https://github.com/RajguruDs/UAV-Propeller-ml-project" },
      { label: "Live app", href: "https://uav-propeller-ml-project.vercel.app/" },
    ],
  },
  {
    slug: "attrition",
    path: "/work/attrition",
    title: "Employee Turnover Analysis",
    kind: "Classification · HR Analytics",
    categories: ["Analytics", "Machine Learning"],
    problem: "Find out which employees are likely to leave, and what distinguishes the people who already have.",
    contribution:
      "Explored 14,999 HR records, clustered leavers with K-Means, balanced the training data with SMOTE and compared Logistic Regression, Gradient Boosting and Random Forest classifiers.",
    tools: ["Python", "pandas", "scikit-learn", "imbalanced-learn", "Seaborn"],
    outcomes: [
      { value: "0.991", label: "Random Forest ROC-AUC on the held-out test set" },
      { value: "3 groups", label: "Distinct profiles of employees who left, from K-Means clustering" },
    ],
    thumb: {
      src: "/covers/employee-turnover-cover.webp",
      width: 1600,
      height: 1000,
      alt: "Portfolio artwork (illustration, not project output): a grid of abstract employee figures, some highlighted and some faded, linked to three dashed groups of coloured points.",
    },
    links: [{ label: "GitHub", href: "https://github.com/RajguruDs/Employee-Turnover-Analysis-using-Machine-Learning" }],
  },
  {
    slug: "marketing-campaign-analysis",
    path: "/work/marketing-campaign-analysis",
    title: "Marketing Campaign Analysis",
    kind: "EDA · Statistical testing · Dashboard",
    categories: ["Analytics"],
    problem: "Understand who buys what, through which channels, and who responded to the latest campaign.",
    contribution:
      "Cleaned a 2,240-customer dataset, tested four purchasing hypotheses with t-tests and correlation, and published the results as an interactive Tableau dashboard.",
    tools: ["Python", "pandas", "SciPy", "Seaborn", "Tableau"],
    outcomes: [
      { value: "4", label: "Hypotheses tested on 2,226 customers after outlier filtering" },
      { value: "Tableau", label: "Published interactive dashboard" },
    ],
    thumb: {
      src: "/covers/marketing-campaign-cover.webp",
      width: 1600,
      height: 1000,
      alt: "Portfolio artwork (illustration, not project output): an abstract dashboard layout with unlabelled bar shapes, a ring segment, paired comparison bars and a connected-dot line.",
    },
    links: [
      { label: "GitHub", href: "https://github.com/RajguruDs/Market-Campaign-Project-EDA-" },
      {
        label: "Tableau dashboard",
        href: "https://public.tableau.com/views/MarketingCampaignAnalysis_17630457873700/Dashboard1",
      },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
