import { ExternalLink, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

/* ── Tableau Dashboard Preview (UAV) ── */
const UAVPreview = () => (
    <div className="w-full h-full p-4 flex flex-col gap-3" style={{ background: "#F8FBFF" }}>
        <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#2563EB" }}>UAV Analytics</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>Live</span>
        </div>
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-1.5">
            {[["90%", "Accuracy"], ["1.6M", "Records"], ["4", "Drone Types"]].map(([v, l]) => (
                <div key={l} className="rounded-lg p-2 text-center" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                    <p className="text-sm font-extrabold" style={{ color: "#2563EB" }}>{v}</p>
                    <p className="text-[9px] text-gray-400">{l}</p>
                </div>
            ))}
        </div>
        {/* Bar chart */}
        <div className="rounded-lg p-3 flex-1" style={{ background: "#fff", border: "1px solid #DBEAFE" }}>
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-2">Thrust vs RPM</p>
            <div className="flex items-end gap-1 h-14">
                {[40, 58, 50, 82, 65, 90, 72, 95, 80, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `#2563EB`, opacity: 0.2 + i * 0.08 }} />
                ))}
            </div>
        </div>
        {/* Efficiency line */}
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[9px] text-gray-400">Model active · 1.6M records processed</span>
        </div>
    </div>
);

/* ── Tableau Dashboard Preview (Marketing) ── */
const MarketingPreview = () => (
    <div className="w-full h-full p-4 flex flex-col gap-3" style={{ background: "#FDFAFF" }}>
        <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7C3AED" }}>Marketing Analytics</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE" }}>Tableau</span>
        </div>
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-1.5">
            {[["340%", "ROI"], ["4.2%", "CTR"], ["1,247", "Conversions"]].map(([v, l]) => (
                <div key={l} className="rounded-lg p-2 text-center" style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
                    <p className="text-sm font-extrabold" style={{ color: "#7C3AED" }}>{v}</p>
                    <p className="text-[9px] text-gray-400">{l}</p>
                </div>
            ))}
        </div>
        {/* Funnel */}
        <div className="rounded-lg p-3" style={{ background: "#fff", border: "1px solid #EDE9FE" }}>
            <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-2">Conversion Funnel</p>
            {[["Impressions", "100%", 1], ["Clicks", "38%", 0.38], ["Leads", "12%", 0.12], ["Customers", "4.2%", 0.042]].map(([l, p, w]) => (
                <div key={l as string} className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] w-16 text-gray-400 shrink-0">{l}</span>
                    <div className="flex-1 h-2.5 rounded-full" style={{ background: "#F5F3FF" }}>
                        <div className="h-full rounded-full" style={{ width: `${(w as number) * 100}%`, background: "#7C3AED", opacity: 0.7 }} />
                    </div>
                    <span className="text-[9px] text-gray-400 w-7 text-right">{p}</span>
                </div>
            ))}
        </div>
    </div>
);

/* ── Browser chrome wrapper ── */
const DashboardBrowser = ({ color, tint, border, url, children }: {
    color: string; tint: string; border: string; url: string; children: React.ReactNode;
}) => (
    <div className="rounded-2xl overflow-hidden w-full" style={{ border: `1px solid ${border}`, boxShadow: `0 8px 28px ${color}14, 0 2px 8px rgba(17,24,39,0.06)`, background: "#fff" }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: tint, borderBottom: `1px solid ${border}` }}>
            <div className="flex gap-1.5">
                {["#FC5F57", "#FEBD2E", "#27C840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
            </div>
            <div className="flex-1 mx-2 h-5 rounded-md flex items-center px-2 text-[10px] font-mono" style={{ background: "rgba(255,255,255,0.8)", color: "#9CA3AF" }}>
                public.tableau.com/{url}
            </div>
        </div>
        <div style={{ height: "220px" }}>{children}</div>
    </div>
);

const dashboards = [
    {
        color: "#2563EB",
        grad: "linear-gradient(135deg,#2563EB 0%,#0D9488 100%)",
        tint: "#EFF6FF",
        border: "#BFDBFE",
        title: "UAV Propeller Analytics",
        subtitle: "Performance Prediction Dashboard",
        description: "Interactive visualisation of propeller-level KPIs across 1.6M records — thrust, power efficiency, and RPM distributions with drill-down filters.",
        tags: ["Tableau", "XGBoost", "Physics-Informed ML"],
        url: "views/UAV-Project/Dashboard1",
        link: "https://public.tableau.com/views/UAV-Project/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
        preview: <UAVPreview />,
    },
    {
        color: "#7C3AED",
        grad: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)",
        tint: "#F5F3FF",
        border: "#DDD6FE",
        title: "Marketing Campaign Analysis",
        subtitle: "Customer Analytics Dashboard",
        description: "Campaign performance, conversion funnels, and segment-level ROI. Surfaces actionable insights for targeting and budget allocation decisions.",
        tags: ["Tableau", "Customer Analytics", "Marketing"],
        url: "views/MarketingCampaign/Dashboard1",
        link: "https://public.tableau.com/views/MarketingCampaignAnalysis_17630457873700/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
        preview: <MarketingPreview />,
    },
];

const Dashboards = () => (
    <section
        id="dashboards"
        className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16 relative"
        style={{ background: "var(--bg-page)" }}
    >
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-40" />
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="section-label">Visual Analytics</div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Dashboards & Insights
                </h2>
                <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
                    Data storytelling through interactive Tableau visualisations.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                {dashboards.map((d, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            background: "#FFFFFF",
                            border: `1px solid ${d.border}`,
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(17,24,39,0.05)",
                        }}
                        whileHover={{ y: -4, boxShadow: `0 16px 40px ${d.color}14, 0 4px 8px rgba(17,24,39,0.06)` }}
                    >
                        {/* Gradient bar */}
                        <div className="h-[3px]" style={{ background: d.grad }} />

                        {/* Dashboard browser preview */}
                        <div className="p-4 pb-0">
                            <DashboardBrowser color={d.color} tint={d.tint} border={d.border} url={d.url}>
                                {d.preview}
                            </DashboardBrowser>
                        </div>

                        {/* Card body */}
                        <div className="p-5">
                            <h3 className="text-base font-extrabold mb-0.5" style={{ color: "var(--text-primary)" }}>
                                {d.title}
                            </h3>
                            <p className="text-xs font-semibold mb-3" style={{ color: d.color }}>{d.subtitle}</p>
                            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{d.description}</p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {d.tags.map(t => (
                                    <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: d.tint, color: d.color, border: `1px solid ${d.border}` }}>{t}</span>
                                ))}
                            </div>

                            <a
                                href={d.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-bold w-full justify-center py-2.5 rounded-xl transition-all duration-200"
                                style={{ background: d.tint, color: d.color, border: `1px solid ${d.border}` }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = d.color; el.style.color = "#fff"; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = d.tint; el.style.color = d.color; }}
                            >
                                <ExternalLink className="w-3.5 h-3.5" /> View on Tableau Public
                                <ArrowUpRight className="w-3 h-3 ml-auto" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default Dashboards;
