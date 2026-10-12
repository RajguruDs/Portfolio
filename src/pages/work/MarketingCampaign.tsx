import BarChart from "@/components/charts/BarChart";
import { CaseSection, CaseStudy, MethodNotes } from "@/components/case-study/CaseStudy";
import { ImageFigure, TableauEmbed } from "@/components/case-study/Figure";
import { projectBySlug } from "@/content/projects";

// All figures below are copied from saved outputs in "Market Campaign Project.ipynb"
// (github.com/RajguruDs/Market-Campaign-Project-EDA-), computed on the 2,226 rows left after outlier filtering.

const TABLEAU_URL = "https://public.tableau.com/views/MarketingCampaignAnalysis_17630457873700/Dashboard1";

const categorySpend = [
  { label: "Wines", value: 676255 },
  { label: "Meat", value: 365773 },
  { label: "Gold", value: 98103 },
  { label: "Fish", value: 83620 },
  { label: "Sweets", value: 60107 },
  { label: "Fruits", value: 58319 },
];

const responsesByCountry = [
  { label: "Spain", value: 176 },
  { label: "South Africa", value: 51 },
  { label: "Canada", value: 37 },
  { label: "Australia", value: 23 },
  { label: "Germany", value: 17 },
  { label: "India", value: 13 },
  { label: "USA", value: 13 },
  { label: "ME", value: 2 },
];

const spendByChildren = [
  { label: "No children", value: 692759 },
  { label: "1 child", value: 531427 },
  { label: "2 children", value: 103437 },
  { label: "3 children", value: 14554 },
];

const tests = [
  {
    question: "Do customers aged 60+ make a different number of web purchases from younger customers?",
    test: "Welch t-test · 856 vs 1,370 customers",
    stat: "t = 5.80, p < 0.001",
    result: "Yes. Customers aged 60+ made more web purchases on average.",
  },
  {
    question: "Do customers with children make a different number of web purchases?",
    test: "Welch t-test · 1,596 with vs 630 without",
    stat: "t = −3.69, p = 0.0002",
    result: "Yes, but the other way round: customers without children made more web purchases on average.",
  },
  {
    question: "Are web sales cannibalising store sales?",
    test: "Pearson correlation · web vs store purchases",
    stat: "r = 0.50, p < 0.001",
    result: "No evidence of it in this data: customers who buy more online also tend to buy more in store.",
  },
  {
    question: "Do US customers buy more in total than the rest of the world?",
    test: "Welch t-test · mean 13.37 vs 12.50 purchases",
    stat: "t = 1.27, p = 0.21",
    result: "No statistically significant difference.",
  },
];

const toc = [
  { id: "objective", title: "Objective" },
  { id: "data", title: "Data" },
  { id: "cleaning", title: "Cleaning" },
  { id: "tests", title: "Hypothesis tests" },
  { id: "findings", title: "Key findings" },
  { id: "dashboard", title: "Tableau dashboard" },
  { id: "limitations", title: "Limitations & interpretation" },
  { id: "next", title: "Next steps" },
];

const MarketingCampaign = () => {
  const project = projectBySlug("marketing-campaign-analysis")!;

  return (
    <CaseStudy
      project={project}
      cover={{
        src: "/work/marketing/tableau-dashboard.webp",
        width: 1800,
        height: 897,
        alt: "Tableau dashboard titled 'Marketing Campaign Analysis – Customer Analytics' with five panels: average total expenditure by number of children, a heatmap of age against last-campaign acceptance, complaints by education level, revenue by product category (wines highest), and countries with the highest campaign acceptance (Spain highest).",
        source: "Tableau Public",
        caption:
          "The published dashboard, rendered from Tableau Public in October 2026. It is the project's main deliverable; the charts below come from the notebook behind it.",
      }}
      metaDescription="Marketing Campaign Analysis: cleaning and exploratory analysis of 2,240 customers, four hypothesis tests on purchasing behaviour, and a published Tableau dashboard."
      lede={
        <p>
          An exploratory analysis of a retailer's customer and campaign data: clean it, test some common assumptions
          about how different customers shop, and publish the results as an interactive dashboard.
        </p>
      }
      facts={[
        { label: "Type", value: "EDA, statistical testing, dashboarding" },
        { label: "Data", value: "2,240 customers · 2,226 after outlier filtering" },
        { label: "Methods", value: "Welch t-tests, Pearson correlation, IQR outlier treatment" },
        { label: "Stack", value: "pandas, SciPy, Seaborn, Tableau" },
      ]}
      toc={toc}
    >
      <CaseSection id="objective" title="Objective">
        <div className="prose-case">
          <p>The analysis aimed to:</p>
          <ul>
            <li>understand customer profiles and how they spend across product categories and channels;</li>
            <li>look at who accepted the most recent campaign;</li>
            <li>test specific assumptions about shopping behaviour rather than eyeballing them; and</li>
            <li>give stakeholders a dashboard they could explore themselves.</li>
          </ul>
        </div>
      </CaseSection>

      <CaseSection id="data" title="Data">
        <div className="prose-case">
          <p>
            <code>marketing_data.csv</code>: one row per customer, 2,240 rows. The columns fall into four groups:
          </p>
          <ul>
            <li>
              <strong>People</strong> — birth year, education, marital status, income, children and teenagers at home,
              country.
            </li>
            <li>
              <strong>Product</strong> — spend on wine, fruit, meat, fish, sweets and gold.
            </li>
            <li>
              <strong>Place</strong> — number of web, catalogue and store purchases, and web visits per month.
            </li>
            <li>
              <strong>Promotion</strong> — whether the customer accepted each of five earlier campaigns and the most
              recent one, and whether they complained.
            </li>
          </ul>
          <p>
            The dataset has no impression, click or campaign-cost data, so measures like CTR, conversion funnels or
            campaign ROI can't be calculated from it. They aren't reported here.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="cleaning" title="Cleaning">
        <div className="space-y-6">
          <div className="prose-case">
            <ul>
              <li>
                Fixed the <code>Income</code> column: stripped the stray spaces in its name and the <code>$</code> and
                comma characters in its values, converted it to a number, and filled missing values with the median.
              </li>
              <li>Parsed customer sign-up dates into proper dates.</li>
              <li>
                Merged rare or invalid marital-status labels ("Alone", "Absurd", "YOLO", "Widow") into "Single", and
                merged "2n Cycle" into "Graduation".
              </li>
              <li>
                Derived total children, age (2025 minus birth year), total spending across the six categories, and total
                purchases across the three channels.
              </li>
              <li>
                Removed outliers on income, age, total spending and total purchases with the 1.5 × IQR rule, leaving
                2,226 customers.
              </li>
            </ul>
          </div>
          <ImageFigure
            src="/work/marketing/income-after-iqr.webp"
            width={1189}
            height={490}
            source="Notebook"
            label="Income after outlier treatment"
            alt="Histogram and box plot of customer income after IQR filtering, ranging from about 19,000 to 84,000, with spikes at both ends of the histogram and no points beyond the box-plot whiskers."
            caption="Income after the 1.5 × IQR filter — the notebook plots it once outliers are removed, so the box plot has no points beyond its whiskers. The histogram has spikes at both ends of the remaining range, which the notebook doesn't investigate."
          />
        </div>
      </CaseSection>

      <CaseSection id="tests" title="Hypothesis tests">
        <div className="space-y-6">
          <div className="prose-case">
            <p>Four assumptions were tested at α = 0.05.</p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {tests.map((t, i) => (
              <li key={t.question} className="flex flex-col rounded-md border border-rule bg-surface p-5">
                <span className="font-mono text-xs text-ink-3">H{i + 1}</span>
                <p className="mt-2 font-medium leading-snug text-ink">{t.question}</p>
                <p className="mt-3 text-sm text-ink-3">{t.test}</p>
                <p className="mt-1 font-mono text-sm tabular-nums text-ink">{t.stat}</p>
                <div className="mt-auto pt-4">
                  <p className="border-t border-rule pt-3 text-[0.9375rem] leading-relaxed text-ink-2">{t.result}</p>
                </div>
              </li>
            ))}
          </ol>
          <MethodNotes
            columns={1}
            notes={[
              {
                label: "Notebook narrative",
                title: "Two results contradict the original hypotheses",
                body: (
                  <>
                    The notebook framed H1 around in-store shopping and H2 around parents being short of time. The
                    computed statistics point the other way: older customers made <em>more</em> web purchases, and
                    customers without children made <em>more</em> web purchases. The figures above are reported as
                    computed.
                  </>
                ),
              },
            ]}
          />
        </div>
      </CaseSection>

      <CaseSection id="findings" title="Key findings">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <BarChart
              title="Total spend by product category"
              max={676255}
              labelWidth="4.5rem"
              bars={categorySpend}
              caption="Sum of spend across all 2,226 customers, in the dataset's currency units. Wine brings in nearly twice as much as meat, the next category."
            />
            <BarChart
              title="Customers who accepted the latest campaign, by country"
              max={176}
              labelWidth="6.5rem"
              bars={responsesByCountry}
              caption="Counts of acceptances, not response rates — the notebook doesn't adjust for how many customers each country has. The dataset only gives the code ME: the notebook reads it as Montenegro, the Tableau workbook as Mexico."
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <BarChart
              title="Total spend by number of children at home"
              max={692759}
              labelWidth="6.5rem"
              bars={spendByChildren}
              caption="Totals, not averages. Households without children spend the most in aggregate, but group sizes differ."
            />
            <div className="prose-case self-center">
              <ul>
                <li>
                  <strong>Age shows no linear relationship</strong> with response to the latest campaign (r = −0.016).
                </li>
                <li>
                  <strong>Complaints were rare</strong> — 20 in two years. 17 came from the Graduation group, but these
                  are counts that aren't adjusted for group size.
                </li>
                <li>
                  <strong>Web and store purchases rise together</strong> (H3, r = 0.50). That fits multi-channel
                  customers, but a correlation alone doesn't show how one channel affects the other.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CaseSection>

      <CaseSection id="dashboard" title="Tableau dashboard">
        <div className="space-y-6">
          <div className="prose-case">
            <p>
              The analysis is published on Tableau Public as a dashboard and a story, so stakeholders can filter it
              themselves. The screenshot below is the real dashboard; open the live version to filter and hover.
            </p>
          </div>
          <TableauEmbed
            title="Marketing Campaign Analysis dashboard on Tableau Public"
            viewUrl={TABLEAU_URL}
            poster={{ src: "/work/marketing/tableau-dashboard.webp", width: 1800, height: 897 }}
            vizSize={{ width: 1740, height: 920 }}
            posterAlt="Screenshot of the Marketing Campaign Analysis Tableau dashboard with five charts: spend by number of children, age versus campaign acceptance, complaints by education, revenue by product category and acceptances by country."
            caption={
              <>
                The workbook appears to use the data before the notebook's cleaning — it keeps "2n Cycle" as its own
                education level, which the notebook merged into Graduation — and its children chart shows{" "}
                <em>average</em> spend per customer where the notebook chart above shows totals. Small differences from
                the notebook figures are expected.
              </>
            }
          />
        </div>
      </CaseSection>

      <CaseSection id="limitations" title="Limitations & interpretation">
        <MethodNotes
          intro="Every result here compares groups of existing customers. Read them as associations in this dataset, not as evidence of what a campaign caused."
          notes={[
            {
              label: "Interpretation",
              title: "Associations, not causes",
              body: "The tests and charts describe how customer groups differ. They don't isolate the effect of a campaign, a channel or a customer attribute.",
            },
            {
              label: "Scope",
              title: "No cost or exposure data",
              body: "The dataset has no campaign cost, impression or click data, so campaign ROI, CTR, funnel metrics and profitability can't be computed from it.",
            },
            {
              label: "Comparisons",
              title: "Counts, not rates",
              emphasis: "Affects comparisons",
              body: "Country, complaint and children comparisons use totals, so bigger groups look bigger.",
            },
            {
              label: "Data preparation",
              title: "Fixed reference year and merged categories",
              body: (
                <>
                  Age is 2025 minus birth year, not age at the time of the campaign. "2n Cycle" is grouped with
                  "Graduation", which affects education breakdowns.
                </>
              ),
            },
          ]}
        />
      </CaseSection>

      <CaseSection id="next" title="Next steps">
        <div className="prose-case">
          <ul>
            <li>
              Compare <strong>response rates</strong> by segment instead of raw counts.
            </li>
            <li>Train a classifier to predict which customers are likely to respond to the next campaign.</li>
            <li>Segment customers on recency, frequency and spend to target campaigns.</li>
          </ul>
        </div>
      </CaseSection>
    </CaseStudy>
  );
};

export default MarketingCampaign;
