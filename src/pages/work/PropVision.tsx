import GroupedBarChart from "@/components/charts/GroupedBarChart";
import { CaseSection, CaseStudy, MethodNotes, TableWrap } from "@/components/case-study/CaseStudy";
import { FigureGrid, ImageFigure, TableauEmbed } from "@/components/case-study/Figure";
import Pipeline from "@/components/case-study/Pipeline";
import { projectBySlug } from "@/content/projects";

// All figures below are copied from saved outputs in ML/notebooks/UAV-Project.ipynb
// (github.com/RajguruDs/UAV-Propeller-ml-project). The notebook prints MAE and RMSE multiplied by 100;
// they are shown here in coefficient units. R² is shown as a fraction.
const results = [
  {
    model: "A",
    data: "2-blade, complete geometry",
    algo: "XGBoost",
    ct: { r2: 0.987, mae: 0.0035, rmse: 0.0045 },
    cp: { r2: 0.986, mae: 0.0016, rmse: 0.0021 },
    ef: { r2: 0.929, mae: 0.058, rmse: 0.13 },
  },
  {
    model: "B",
    data: "3- & 4-blade, imputed geometry",
    algo: "XGBoost",
    ct: { r2: 0.994, mae: 0.0034, rmse: 0.005 },
    cp: { r2: 0.991, mae: 0.0023, rmse: 0.0036 },
    ef: { r2: 0.988, mae: 0.021, rmse: 0.045 },
  },
  {
    model: "C",
    data: "All blades, solidity removed",
    algo: "Gradient Boosting (defaults)",
    ct: { r2: 0.926, mae: 0.0093, rmse: 0.0123 },
    cp: { r2: 0.879, mae: 0.0062, rmse: 0.0082 },
    ef: { r2: 0.751, mae: 0.125, rmse: 0.286 },
  },
];

const targets = [
  { key: "ct", label: "Thrust coefficient (CT)" },
  { key: "cp", label: "Power coefficient (CP)" },
  { key: "ef", label: "Efficiency" },
] as const;

const toc = [
  { id: "problem", title: "Problem" },
  { id: "data", title: "Data" },
  { id: "features", title: "Feature engineering" },
  { id: "eda", title: "Exploratory analysis" },
  { id: "models", title: "Models" },
  { id: "results", title: "Results & evaluation" },
  { id: "caveats", title: "Evaluation & limitations" },
  { id: "application", title: "The application" },
  { id: "next", title: "Next steps" },
];

const PropVision = () => {
  const project = projectBySlug("propvision")!;

  return (
    <CaseStudy
      project={project}
      cover={{
        src: "/work/propvision/app-home.webp",
        width: 1600,
        height: 1000,
        alt: "Home page of the deployed PropVision web app: a dark header reading 'PropVision — UAV Propeller Performance Analysis System' with buttons to start predicting, explore the dataset and view the dashboard.",
        source: "Live app",
        caption: "The deployed React front end (uav-propeller-ml-project.vercel.app), screenshot taken October 2026.",
      }}
      metaDescription="PropVision: regression models predicting UAV propeller thrust, power and efficiency from blade geometry, served through a Flask API and React app — with results and evaluation caveats."
      lede={
        <p>
          A regression project that predicts three performance measures of a UAV propeller from its size, pitch and
          blade geometry, and serves the trained models through a small web application.
        </p>
      }
      facts={[
        { label: "Task", value: "Regression, three separate targets" },
        { label: "Models", value: "XGBoost (A, B); Gradient Boosting (C)" },
        { label: "Raw data", value: "27,495 test measurements + 2,316 blade-geometry rows" },
        { label: "Stack", value: "pandas, scikit-learn, XGBoost, Flask, PostgreSQL, React, Tableau" },
      ]}
      toc={toc}
    >
      <CaseSection id="problem" title="Problem">
        <div className="prose-case">
          <p>
            A propeller's performance is usually described by three dimensionless numbers: the{" "}
            <strong>thrust coefficient</strong>, the <strong>power coefficient</strong> and its{" "}
            <strong>efficiency</strong>. They depend on the propeller's diameter, pitch and blade shape, and on the
            advance ratio it runs at.
          </p>
          <p>
            The goal was to estimate all three for a propeller configuration from tabulated test data, and to put the
            estimates behind an interface where someone can enter a diameter, pitch, blade count and advance ratio and
            get predictions back.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="data" title="Data">
        <div className="prose-case">
          <p>The notebook combines two sets of CSV files:</p>
          <ul>
            <li>
              <strong>Experiments</strong> — three files, 27,495 rows: propeller brand, blade count, diameter, pitch,
              advance ratio, RPM, and the measured thrust coefficient, power coefficient and efficiency.
            </li>
            <li>
              <strong>Blade geometry</strong> — three files, 2,316 rows: the chord length and blade angle at stations
              along the radius of each blade, stored as ratios of the blade radius.
            </li>
          </ul>
          <p>
            Geometry features are attached to each experiment by joining on brand, blade count, diameter and pitch. Not
            every propeller has geometry data. Rows without it are dropped for Model A and mean-imputed for Models B and
            C.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="features" title="Feature engineering">
        <div className="prose-case">
          <p>
            The geometry tables only give chord and radius as ratios, so the first step was turning them into physical
            quantities:
          </p>
          <ul>
            <li>Chord and radius distributions: the ratios multiplied by the blade radius (half the diameter).</li>
            <li>
              <strong>Blade area</strong>: chord integrated along the radius with the trapezoidal rule (
              <code>np.trapz</code>), per propeller.
            </li>
            <li>
              <strong>Disc area</strong> (πR²) and <strong>total blade area</strong> (blade area × blade count).
            </li>
            <li>
              <strong>Solidity</strong>: total blade area divided by disc area — the fraction of the disc the blades
              cover.
            </li>
          </ul>
          <p>
            Each model's inputs are diameter, pitch, advance ratio, blade area, disc area, total blade area and
            solidity. RPM is not used as an input.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="eda" title="Exploratory analysis">
        <div className="space-y-6">
          <ImageFigure
            src="/work/propvision/correlation-matrix.webp"
            alt="Correlation heatmap of propeller inputs and outputs. Thrust and power coefficients correlate at 0.88; thrust and advance ratio at −0.82; blade area, disc area and total blade area correlate with each other above 0.93; solidity correlates weakly with all three outputs."
            width={1287}
            height={798}
            source="Notebook"
            label="Correlation matrix"
            caption="Correlation matrix of the 2-blade rows with complete geometry. The number-of-blades row is blank because this subset contains only 2-blade propellers."
          />
          <FigureGrid>
            <ImageFigure
              src="/work/propvision/target-distributions.webp"
              width={1335}
              height={853}
              source="Notebook"
              label="Distributions of the targets and RPM"
              alt="Four histograms: thrust coefficient (most values between about 0.05 and 0.12), power coefficient (mostly 0.02 to 0.06), efficiency (most values between 0 and 0.8 with a long tail of negative values) and RPM (peaks at round values between about 2,000 and 7,000)."
              caption="Histograms of the three targets and RPM (2-blade rows with complete geometry). Efficiency has a tail of negative values, which the notebook attributes to poor operating conditions; RPM clusters at the test-rig's set speeds."
            />
            <ImageFigure
              src="/work/propvision/bivariate-scatter.webp"
              width={1300}
              height={1594}
              source="Notebook"
              label="Bivariate scatter plots"
              alt="Eight scatter plots: solidity, blade area, diameter, pitch and RPM against the outputs. The clearest pattern is a tight, rising band in power coefficient versus thrust coefficient; most geometry-versus-output panels show vertical stripes, one per propeller."
              caption="Eight pairwise scatter plots on the same rows. Power vs thrust is the one clean relationship; geometry features appear as vertical stripes because each propeller has a single geometry value across many test points."
            />
          </FigureGrid>
          <div className="prose-case">
            <p>What the correlation matrix and distribution plots in the notebook show:</p>
            <ul>
              <li>Thrust and power coefficients move together strongly (r = 0.88).</li>
              <li>Thrust falls as advance ratio rises (r = −0.82), as expected for a propeller moving forward.</li>
              <li>
                Blade area, disc area and total blade area are almost interchangeable (r ≥ 0.93), so they carry
                overlapping information.
              </li>
              <li>
                Solidity has only a weak linear relationship with any output (|r| ≤ 0.1). Any effect it has would have
                to be non-linear, which is one reason to use tree-based models.
              </li>
              <li>
                RPM values cluster around a few levels (roughly 3,000 to 7,000), which reflects a structured test
                procedure rather than random operating speeds.
              </li>
            </ul>
          </div>
        </div>
      </CaseSection>

      <CaseSection id="models" title="Models">
        <div className="space-y-6">
          <div className="prose-case">
            <p>
              Three model variants were trained, each with one regressor per target and an 80/20 random train/test
              split. Models A and B use XGBoost with fixed settings (300 trees, learning rate 0.05, max depth 5,
              subsample 0.9, column sample 0.8). Model C uses scikit-learn's Gradient Boosting with default settings.
              There was no hyperparameter search and no cross-validation.
            </p>
          </div>
          <TableWrap>
            <table className="data-table min-w-[36rem]">
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Algorithm</th>
                  <th scope="col">Training data</th>
                  <th scope="col" className="num">
                    Rows
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-ink">A</td>
                  <td>XGBoost</td>
                  <td>2-blade propellers with complete geometry</td>
                  <td className="num">1,218,235</td>
                </tr>
                <tr>
                  <td className="font-medium text-ink">B</td>
                  <td>XGBoost</td>
                  <td>3- and 4-blade propellers; geometry mean-imputed where missing</td>
                  <td className="num">66,418</td>
                </tr>
                <tr>
                  <td className="font-medium text-ink">C</td>
                  <td>Gradient Boosting</td>
                  <td>All blade counts, imputed, with solidity removed</td>
                  <td className="num">1,699,453</td>
                </tr>
              </tbody>
            </table>
          </TableWrap>
          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-ink-3">
            Row counts are after the geometry join, which repeats experiment rows — see{" "}
            <a href="#caveats" className="link">
              Model evaluation &amp; limitations
            </a>
            .
          </p>
        </div>
      </CaseSection>

      <CaseSection id="results" title="Results & evaluation">
        <div className="space-y-6">
          <div className="prose-case">
            <p>
              Test-set R² for each target, as saved in the notebook's comparison table. Models A and B are what the
              deployed app uses. Model C is shown in grey because it differs from them in more than one way (below).
            </p>
            <p>
              The notebook doesn't save predicted values, so there are no actual-vs-predicted or residual plots to show
              — these charts are drawn from its saved metrics table.
            </p>
          </div>
          <GroupedBarChart
            title="Test-set R² by target"
            max={1}
            groups={targets.map((t) => ({
              label: t.label,
              bars: results.map((r) => ({
                label: `Model ${r.model}`,
                value: r[t.key].r2,
                display: r[t.key].r2.toFixed(3),
                muted: r.model === "C",
              })),
            }))}
            caption="Bars start at zero. Model C (grey) is not directly comparable to A and B — see Model evaluation & limitations below."
          />
          <TableWrap caption="Test-set metrics from a single random 80/20 split. MAE and RMSE are in the target's own units (dimensionless coefficients); the notebook prints them multiplied by 100.">
            <table className="data-table min-w-[40rem]">
              <thead>
                <tr>
                  <th scope="col">Target</th>
                  {results.map((r) => (
                    <th key={r.model} scope="col" className="num" colSpan={3}>
                      Model {r.model}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th scope="col" className="sr-only">
                    Metric
                  </th>
                  {results.flatMap((r) =>
                    ["R²", "MAE", "RMSE"].map((m) => (
                      <th key={`${r.model}-${m}`} scope="col" className="num !pt-1 normal-case tracking-normal">
                        {m}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {targets.map((t) => (
                  <tr key={t.key}>
                    <th
                      scope="row"
                      className="!border-b !border-rule !py-2.5 !font-sans !text-sm !font-medium !normal-case !tracking-normal !text-ink"
                    >
                      {t.label}
                    </th>
                    {results.flatMap((r) => [
                      <td key={`${r.model}-r2`} className="num">
                        {r[t.key].r2.toFixed(3)}
                      </td>,
                      <td key={`${r.model}-mae`} className="num">
                        {r[t.key].mae}
                      </td>,
                      <td key={`${r.model}-rmse`} className="num">
                        {r[t.key].rmse}
                      </td>,
                    ])}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
      </CaseSection>

      <CaseSection id="caveats" title="Model evaluation & limitations">
        <MethodNotes
          intro="The scores above are the notebook's saved test-set results. Three properties of how they were measured affect how far they can be trusted:"
          notes={[
            {
              label: "Data leakage",
              title: "The R² values are probably optimistic",
              emphasis: "May inflate scores",
              body: (
                <>
                  Joining geometry onto the experiments repeats rows: the merged table has 1,699,453 rows, and the
                  notebook's own duplicate check flags 1,672,959 of them as exact duplicates. With a random split,
                  copies of the same measurement land in both the training and test sets, so the test set is not truly
                  unseen data.
                </>
              ),
            },
            {
              label: "Comparison",
              title: "Model C is not a clean ablation",
              emphasis: "Limits the comparison",
              body: (
                <>
                  Model C removes solidity, but it also switches algorithm (default Gradient Boosting instead of XGBoost
                  with fixed settings) and trains on a different subset. Its lower scores can't be attributed to
                  solidity alone.
                </>
              ),
            },
            {
              label: "Validation",
              title: "Single split, no tuning",
              body: "Each number comes from one random 80/20 split, with no cross-validation and no hyperparameter search.",
            },
          ]}
        />
      </CaseSection>

      <CaseSection id="application" title="The application">
        <div className="space-y-6">
          <Pipeline
            title="From raw CSVs to a prediction in the browser"
            stages={[
              {
                title: "Load & combine",
                where: "Notebook",
                items: ["3 experiment CSVs → 27,495 rows", "3 blade-geometry CSVs → 2,316 rows"],
              },
              {
                title: "Engineer geometry features",
                where: "Notebook",
                items: [
                  "Chord & radius from c/R and r/R ratios",
                  <>
                    Blade area via <code className="code">np.trapz</code>; disc area; total blade area; solidity
                  </>,
                  "Join onto experiments by brand, blades, diameter, pitch",
                ],
              },
              {
                title: "Train one regressor per target",
                where: "Notebook → joblib",
                items: [
                  "Model A: XGBoost on 2-blade rows",
                  "Model B: XGBoost on 3- & 4-blade rows",
                  "Targets: thrust coefficient, power coefficient, efficiency",
                ],
              },
              {
                title: "Serve predictions",
                where: "Backend/app.py · Flask",
                items: [
                  <>
                    <code className="code">POST /predict</code> routes by blade count to Model A or B
                  </>,
                  "Geometry looked up from the nearest matching propeller",
                  "Rule-based drone-type label from the predicted values",
                ],
              },
              {
                title: "Store & display",
                where: "PostgreSQL · React on Vercel",
                items: [
                  "Each prediction inserted into prediction_logs",
                  "React pages: prediction, dataset explorer, dashboard, insights",
                ],
              },
            ]}
            caption="Drawn from the notebook and Backend/app.py in the repository. Model C was an experiment in the notebook and isn't deployed. The Tableau dashboard is a separate visualisation of the merged data, not part of this request path."
          />
          <div className="prose-case">
            <p>
              The geometry for a request is not supplied by the user: the API finds the closest propeller in the
              training data (same blade count, nearest diameter, then nearest pitch) and uses its blade area and
              solidity. The drone-type label (for example racing, agriculture, delivery, surveillance or mapping) comes
              from fixed threshold rules on the predictions, not from a trained model.
            </p>
          </div>
          <FigureGrid>
            <ImageFigure
              src="/work/propvision/app-prediction.webp"
              width={1600}
              height={1000}
              source="Live app"
              label="Prediction page"
              alt="PropVision prediction page with an input form for number of blades, propeller diameter, pitch and advance ratio, and an empty results panel."
              caption="The prediction form. The app only enables prediction for inputs inside the range of the training data."
            />
            <ImageFigure
              src="/work/propvision/app-dataset.webp"
              width={1600}
              height={1000}
              source="Live app"
              label="Dataset explorer"
              alt="PropVision dataset explorer showing tabs for experimental and geometrical data, summary cards (250 records displayed, 25 unique brands) and a table of brand, diameter, pitch, blades, RPM, thrust coefficient, power coefficient and efficiency."
              caption="The dataset explorer, which shows a 250-row sample served by the API's /api/experiment endpoint."
            />
          </FigureGrid>
          <TableauEmbed
            title="UAV-Project dashboard on Tableau Public"
            viewUrl="https://public.tableau.com/views/UAV-Project/Dashboard1"
            poster={{ src: "/work/propvision/tableau-dashboard-preview.webp", width: 1200, height: 1230 }}
            vizSize={{ width: 1200, height: 2660 }}
            posterAlt="Top of the UAV Tableau dashboard: filters for RPM range, blade count and diameter; summary tiles for total records and average thrust coefficient, power coefficient and efficiency; and line charts of average thrust coefficient and efficiency across RPM ranges."
            caption={
              <>
                The project's Tableau Public dashboard (top section shown; the full dashboard also covers pitch,
                diameter, blade count and solidity). Its record count and averages are computed over the merged table,
                including the duplicated rows described under{" "}
                <a href="#caveats" className="link">
                  Model evaluation &amp; limitations
                </a>
                .
              </>
            }
          />
        </div>
      </CaseSection>

      <CaseSection id="next" title="Next steps">
        <div className="prose-case">
          <ul>
            <li>
              <strong>De-duplicate before modelling</strong>, and split by propeller rather than by row, so the test set
              contains propellers the model has never seen.
            </li>
            <li>
              <strong>Test solidity properly</strong>: train the same algorithm on the same rows with and without it.
            </li>
            <li>
              <strong>Use cross-validation</strong> to report a spread rather than a single number, and tune
              hyperparameters inside it.
            </li>
            <li>
              Model B relies on <strong>imputed geometry</strong>. More measured blade geometry for 3- and 4-blade
              propellers would make it more trustworthy.
            </li>
            <li>
              Consider <strong>RPM as an input</strong>. It varies within the data but isn't currently used.
            </li>
          </ul>
        </div>
      </CaseSection>
    </CaseStudy>
  );
};

export default PropVision;
