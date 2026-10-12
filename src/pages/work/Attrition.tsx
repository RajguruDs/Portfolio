import BarChart from "@/components/charts/BarChart";
import { CaseSection, CaseStudy, MethodNotes, TableWrap } from "@/components/case-study/CaseStudy";
import { FigureGrid, ImageFigure } from "@/components/case-study/Figure";
import { projectBySlug } from "@/content/projects";

// All figures below are copied from saved outputs in Coursendproject.ipynb
// (github.com/RajguruDs/Employee-Turnover-Analysis-using-Machine-Learning).

const models = [
  { name: "Random Forest", auc: 0.991, cvAcc: 0.977, cvRecall: 0.971 },
  { name: "Gradient Boosting", auc: 0.978, cvAcc: 0.951, cvRecall: 0.942 },
  { name: "Logistic Regression", auc: 0.661, cvAcc: 0.679, cvRecall: 0.724 },
];

const clusters = [
  { id: 0, n: 1667, sat: 0.41, evalScore: 0.52, reading: "Moderate-to-low satisfaction, low evaluations" },
  { id: 1, n: 965, sat: 0.81, evalScore: 0.92, reading: "Satisfied, highly rated — left anyway" },
  { id: 2, n: 939, sat: 0.11, evalScore: 0.87, reading: "Highly rated but very unsatisfied" },
];

const riskZones = [
  { label: "Low", value: 2153 },
  { label: "Moderate", value: 132 },
  { label: "High", value: 64 },
  { label: "Critical", value: 651 },
];

const toc = [
  { id: "problem", title: "Problem" },
  { id: "data", title: "Data" },
  { id: "eda", title: "Exploratory analysis" },
  { id: "clusters", title: "Who left" },
  { id: "prep", title: "Preparation" },
  { id: "results", title: "Results & evaluation" },
  { id: "risk", title: "Risk zones" },
  { id: "limitations", title: "Methodology notes" },
  { id: "next", title: "Next steps" },
];

const Attrition = () => {
  const project = projectBySlug("attrition")!;

  return (
    <CaseStudy
      project={project}
      cover={{
        src: "/work/attrition/distributions.webp",
        width: 1984,
        height: 484,
        alt: "Three stacked histograms comparing employees who left with those who stayed. Leavers cluster at very low satisfaction (around 0.1) and around 0.4, and at both low and high evaluation scores and monthly hours.",
        source: "Notebook",
        caption:
          "Satisfaction, last evaluation and average monthly hours, split by employees who left (1, orange) and stayed (0, green). Leavers concentrate in a few distinct bands rather than spreading evenly.",
      }}
      metaDescription="Employee Turnover Analysis: EDA, K-Means clustering of leavers and a comparison of three classifiers on 14,999 HR records, with test and cross-validation results reported separately."
      lede={
        <p>
          An HR analytics project: explore 14,999 employee records to see what separates people who left from people who
          stayed, then train classifiers to flag who is likely to leave next.
        </p>
      }
      facts={[
        { label: "Task", value: "Binary classification + clustering" },
        { label: "Data", value: "14,999 employees · 3,571 left (23.8%)" },
        { label: "Best model", value: "Random Forest · test ROC-AUC 0.991" },
        { label: "Stack", value: "pandas, scikit-learn, imbalanced-learn, Seaborn" },
      ]}
      toc={toc}
    >
      <CaseSection id="problem" title="Problem">
        <div className="prose-case">
          <p>
            Losing employees is expensive and disruptive, and the reasons aren't always obvious. The project set out to
            answer three questions:
          </p>
          <ul>
            <li>Which factors are most associated with an employee leaving?</li>
            <li>Can a model predict, from routine HR data, who is likely to leave?</li>
            <li>How could HR use those predictions to prioritise retention efforts?</li>
          </ul>
        </div>
      </CaseSection>

      <CaseSection id="data" title="Data">
        <div className="prose-case">
          <p>
            A public HR dataset (<code>HR_comma_sep.csv</code>) with 14,999 rows and 10 columns: satisfaction level,
            last evaluation score, number of projects, average monthly hours, years at the company, work accidents,
            promotion in the last five years, department, salary band, and whether the employee left. It has no missing
            values.
          </p>
          <p>
            3,571 employees (23.8%) left and 11,428 stayed, so the classes are imbalanced — a model that always
            predicted "stayed" would already be 76% accurate, which is why ROC-AUC and recall matter more than accuracy
            here.
          </p>
        </div>
        <BarChart
          className="mt-6"
          title="Employees by outcome (n = 14,999)"
          max={11428}
          labelWidth="4.5rem"
          bars={[
            { label: "Stayed", value: 11428, muted: true },
            { label: "Left", value: 3571 },
          ]}
          caption="From the notebook's value counts of the target column. About one employee in four left."
        />
      </CaseSection>

      <CaseSection id="eda" title="Exploratory analysis">
        <div className="space-y-6">
          <ImageFigure
            src="/work/attrition/project-count.webp"
            width={784}
            height={484}
            natural
            source="Notebook"
            label="Project count by outcome"
            alt="Grouped bar chart of employees by number of projects. With 2 projects, about 1,570 left versus about 830 who stayed; with 3 to 5 projects most stayed; with 6 projects more left than stayed; everyone with 7 projects left."
            caption="Employees by number of projects, split by outcome. Leavers dominate at 2 projects and at 6–7 projects; the middle of the range is where people stay."
          />
          <div className="prose-case">
            <p>What the exploratory analysis showed (the histograms at the top of this page and the chart above):</p>
            <ul>
              <li>
                <strong>Satisfaction</strong> has the strongest relationship with leaving (r = −0.39). Leavers bunch at
                very low satisfaction and around 0.4.
              </li>
              <li>
                Leavers sit at <strong>both extremes</strong> of evaluation score and monthly hours: under-used and
                over-worked employees both leave.
              </li>
              <li>
                Employees with <strong>2 projects or 6–7 projects</strong> leave more often. Those with 3–5 projects
                mostly stay.
              </li>
              <li>Promotions and work accidents have only weak correlations with leaving.</li>
            </ul>
          </div>
        </div>
      </CaseSection>

      <CaseSection id="clusters" title="Who left: three groups">
        <div className="space-y-6">
          <div className="prose-case">
            <p>
              To see whether leavers share common profiles, the 3,571 employees who left were clustered with K-Means on
              standardised satisfaction and last evaluation. The elbow method suggested three clusters.
            </p>
          </div>
          <FigureGrid>
            <ImageFigure
              src="/work/attrition/elbow.webp"
              width={707}
              height={473}
              source="Notebook"
              label="Elbow method"
              alt="Line chart of within-cluster sum of squares against the number of clusters from 1 to 12, falling steeply until about 3 clusters and flattening afterwards."
              caption="Within-cluster sum of squares for 1–12 clusters. The curve flattens after three, which is why k = 3 was chosen."
            />
            <ImageFigure
              src="/work/attrition/leaver-clusters.webp"
              width={784}
              height={484}
              source="Notebook"
              label="K-Means clusters of leavers"
              alt="Scatter plot of employees who left, satisfaction on the x-axis and last evaluation on the y-axis, showing three dense groups: low evaluation with satisfaction near 0.4, high satisfaction with high evaluation, and very low satisfaction with high evaluation."
              caption="The three clusters of employees who left, on satisfaction (x) and last evaluation (y)."
            />
          </FigureGrid>
          <div>
            <TableWrap caption="Cluster means from the notebook's summary table.">
              <table className="data-table min-w-[22rem]">
                <thead>
                  <tr>
                    <th scope="col">Cluster</th>
                    <th scope="col" className="num">
                      People
                    </th>
                    <th scope="col" className="num">
                      Satisf.
                    </th>
                    <th scope="col" className="num">
                      Eval.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clusters.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span className="font-medium text-ink">{c.id}</span>
                        <span className="block text-[0.8125rem] text-ink-3">{c.reading}</span>
                      </td>
                      <td className="num">{c.n.toLocaleString("en-US")}</td>
                      <td className="num">{c.sat.toFixed(2)}</td>
                      <td className="num">{c.evalScore.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </div>
          <div className="prose-case">
            <p>
              The groups suggest different retention conversations: support and feedback for cluster 0; recognition and
              growth for the strong performers in clusters 1 and 2. Cluster 2 — rated highly but deeply unsatisfied —
              looks most like burnout.
            </p>
          </div>
        </div>
      </CaseSection>

      <CaseSection id="prep" title="Preparation">
        <div className="prose-case">
          <ul>
            <li>Salary band label-encoded; department one-hot encoded.</li>
            <li>
              Model inputs: last evaluation, number of projects, average monthly hours, years at the company, and five
              department indicators (accounting, HR, sales, support, technical).{" "}
              <strong>Satisfaction level was not used as an input.</strong>
            </li>
            <li>80/20 train/test split. The test set has 2,291 employees who stayed and 709 who left.</li>
            <li>
              <strong>SMOTE</strong> applied to the training set only, balancing it to 9,137 employees in each class.
              The test set keeps its real class balance.
            </li>
          </ul>
        </div>
      </CaseSection>

      <CaseSection id="results" title="Results & evaluation">
        <div className="space-y-6">
          <div className="prose-case">
            <p>
              Three classifiers were trained on the balanced training set. Two kinds of number are reported, and they
              mean different things:
            </p>
            <ul>
              <li>
                <strong>ROC-AUC on the held-out test set</strong> — the most trustworthy figure here.
              </li>
              <li>
                <strong>Accuracy and recall from 5-fold cross-validation</strong> on the SMOTE-balanced training set —
                likely optimistic (see limitations).
              </li>
            </ul>
          </div>
          <div>
            <BarChart
              title="Test-set ROC-AUC"
              max={1}
              labelWidth="9.5rem"
              bars={models.map((m) => ({ label: m.name, value: m.auc, display: m.auc.toFixed(3) }))}
              caption="Area under the ROC curve on the 3,000-employee test set, which was not resampled. 0.5 is chance."
            />
          </div>
          <FigureGrid columns={3}>
            {[
              {
                file: "roc-random-forest",
                name: "Random Forest",
                auc: "0.99",
                shape: "rises almost vertically to a true positive rate near 1.0",
              },
              {
                file: "roc-gradient-boosting",
                name: "Gradient Boosting",
                auc: "0.98",
                shape: "rises steeply, slightly less sharply than Random Forest",
              },
              {
                file: "roc-logistic-regression",
                name: "Logistic Regression",
                auc: "0.66",
                shape: "stays close to the diagonal chance line",
              },
            ].map((r) => (
              <ImageFigure
                key={r.file}
                src={`/work/attrition/${r.file}.webp`}
                width={540}
                height={396}
                source="Notebook"
                label={`ROC curve — ${r.name}`}
                alt={`ROC curve for ${r.name} on the test set, which ${r.shape}; legend shows AUC = ${r.auc}.`}
                caption={`${r.name}, test set. The curve ${r.shape}.`}
              />
            ))}
          </FigureGrid>
          <TableWrap caption="Accuracy and recall for the 'left' class come from 5-fold cross-validated predictions on the SMOTE-balanced training set, not from the test set.">
            <table className="data-table min-w-[34rem]">
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col" className="num">
                    Test ROC-AUC
                  </th>
                  <th scope="col" className="num">
                    CV accuracy
                  </th>
                  <th scope="col" className="num">
                    CV recall (left)
                  </th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name}>
                    <td className="font-medium text-ink">{m.name}</td>
                    <td className="num">{m.auc.toFixed(3)}</td>
                    <td className="num">{(m.cvAcc * 100).toFixed(1)}%</td>
                    <td className="num">{(m.cvRecall * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          <ImageFigure
            src="/work/attrition/confusion-random-forest-cv.webp"
            width={630}
            height={473}
            natural
            source="Notebook"
            label="Random Forest confusion matrix (5-fold CV)"
            alt="Confusion matrix for Random Forest from 5-fold cross-validation: 8,974 stayed correctly predicted, 163 stayed predicted as left, 264 left predicted as stayed, 8,873 left correctly predicted."
            caption={
              <>
                Random Forest, 5-fold cross-validated predictions on the{" "}
                <strong className="font-medium text-ink-2">SMOTE-balanced training set</strong> (9,137 per class) — not
                the test set. 264 leavers were missed and 163 stayers flagged. Treat these counts as optimistic for the
                reason given under{" "}
                <a href="#limitations" className="link">
                  Methodology notes
                </a>
                .
              </>
            }
          />
          <div className="prose-case">
            <p>
              Recall on the "left" class was the metric to watch. A missed leaver (false negative) is the costly error,
              because HR never gets the chance to intervene. The two tree ensembles far outperform Logistic Regression,
              which suggests the relationships are non-linear — consistent with leavers sitting at both extremes of
              hours and evaluation.
            </p>
          </div>
        </div>
      </CaseSection>

      <CaseSection id="risk" title="Turning probabilities into risk zones">
        <div className="space-y-6">
          <div className="prose-case">
            <p>
              To make the output usable, the Random Forest's predicted probability of leaving was grouped into four
              zones: low (≤ 0.20), moderate (≤ 0.60), high (≤ 0.90) and critical (above 0.90). Applied to the test set:
            </p>
          </div>
          <BarChart
            title="Employees per risk zone, test set (n = 3,000)"
            max={2153}
            labelWidth="5.5rem"
            bars={riskZones}
            caption="Saved output of the risk-zone cell. Most employees score as either clearly low or clearly critical, with few in between."
          />
        </div>
      </CaseSection>

      <CaseSection id="limitations" title="Methodology notes">
        <MethodNotes
          intro="Only the test-set ROC-AUC comes from data the models never saw. Keep these points in mind when reading the other figures:"
          notes={[
            {
              label: "Cross-validation",
              title: "Cross-validation ran on oversampled data",
              emphasis: "May inflate CV scores",
              body: (
                <>
                  SMOTE creates synthetic employees by interpolating between real ones. Cross-validation was run{" "}
                  <em>after</em> oversampling, so the validation folds contain synthetic points built from training-fold
                  neighbours. That makes the CV accuracy and recall likely optimistic. The test-set ROC-AUC isn't
                  affected, because the test set was never resampled.
                </>
              ),
            },
            {
              label: "Reporting",
              title: "No test-set confusion matrix",
              body: "The notebook reports precision, recall and the confusion matrix only on the cross-validated training predictions. Test-set accuracy and recall at a chosen threshold weren't computed.",
            },
            {
              label: "Sampling",
              title: "Split wasn't stratified",
              body: (
                <>
                  The notebook's notes describe a stratified split, but the code doesn't pass <code>stratify</code>. The
                  test set's 23.6% leaver rate happens to be close to the overall 23.8%.
                </>
              ),
            },
            {
              label: "Generalisation",
              title: "A public benchmark dataset",
              body: "The dataset is a widely used public HR dataset, so these patterns may not transfer to a specific organisation's workforce.",
            },
          ]}
        />
      </CaseSection>

      <CaseSection id="next" title="Next steps">
        <div className="prose-case">
          <ul>
            <li>
              Put SMOTE <strong>inside the cross-validation pipeline</strong> (an imbalanced-learn <code>Pipeline</code>
              ) so each fold is oversampled separately.
            </li>
            <li>
              Report <strong>test-set precision, recall and a confusion matrix</strong> at a threshold chosen for the
              cost of missing a leaver.
            </li>
            <li>
              Add <strong>satisfaction level</strong> as a feature. It was the strongest single signal in the EDA.
            </li>
            <li>Inspect feature importance to explain individual risk scores to HR.</li>
          </ul>
        </div>
      </CaseSection>
    </CaseStudy>
  );
};

export default Attrition;
