import { motion } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";

/* ── Certificate preview mockup ── */
const CertPreview = ({ color, tint, border, icon, title, org, year }: {
    color: string; tint: string; border: string; icon: string; title: string; org: string; year: string;
}) => (
    <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: tint, border: `1px solid ${border}`, boxShadow: `0 4px 16px ${color}12` }}
    >
        {/* Certificate header band */}
        <div className="px-5 pt-5 pb-4 flex flex-col items-center text-center"
            style={{ background: `linear-gradient(160deg, ${tint} 0%, #fff 100%)`, borderBottom: `1px solid ${border}` }}>
            {/* Emblem */}
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
                style={{ background: "#fff", border: `2px solid ${border}`, boxShadow: `0 4px 12px ${color}18` }}
            >
                {icon}
            </div>
            <div
                className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-2"
                style={{ color }}
            >
                Certificate of Completion
            </div>
            <p className="text-xs font-bold leading-snug" style={{ color: "#111827", maxWidth: "160px" }}>{title}</p>
        </div>

        {/* Bottom info row */}
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1.5">
                <Award className="w-3 h-3" style={{ color }} />
                <span className="text-[10px] font-semibold" style={{ color: "#374151" }}>{org}</span>
            </div>
            <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-semibold text-green-600">Verified · {year}</span>
            </div>
        </div>
    </div>
);

const certs = [
    {
        icon: "🐍",
        title: "Introduction to Programming Using Python",
        org: "Simplilearn",
        year: "2024",
        color: "#2563EB",
        tint: "#EFF6FF",
        border: "#BFDBFE",
        grad: "linear-gradient(135deg,#2563EB 0%,#0D9488 100%)",
        skills: ["Python Basics", "Functions", "OOP", "File I/O"],
        verifyUrl: "https://www.linkedin.com/posts/rajguru-mathiyalagan-63b921244_rajguru-mathiyalagan-has-successfully-completed-activity-7277603323740901376-uJWj?utm_source=share&utm_medium=member_desktop&rcm=ACoAADymGE8BmXrzWg9B1IPvBS30zvTZlNj-QUk",
    },
    {
        icon: "📊",
        title: "Data Science with Python",
        org: "Simplilearn",
        year: "2025",
        color: "#7C3AED",
        tint: "#F5F3FF",
        border: "#DDD6FE",
        grad: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)",
        skills: ["EDA", "Pandas", "Scikit-learn", "ML Models"],
        verifyUrl: "https://www.linkedin.com/posts/rajguru-mathiyalagan-63b921244_datascience-simplilearn-edatools-activity-7328786367805648896-bsrZ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADymGE8BmXrzWg9B1IPvBS30zvTZlNj-QUk",
    },
];

const Certifications = () => (
    <section
        id="certifications"
        className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16"
        style={{ background: "var(--bg-subtle)" }}
    >
        <div className="max-w-6xl mx-auto">
            <div className="section-label">Certifications</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 tracking-tight" style={{ color: "var(--text-primary)" }}>
                Verified credentials
            </h2>

            <div className="grid sm:grid-cols-2 max-w-2xl gap-6">
                {certs.map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        style={{
                            background: "#FFFFFF",
                            border: `1px solid ${c.border}`,
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(17,24,39,0.05)",
                        }}
                        whileHover={{ y: -4, boxShadow: `0 12px 32px ${c.color}14, 0 4px 8px rgba(17,24,39,0.06)` }}
                    >
                        {/* Gradient bar */}
                        <div className="h-[3px]" style={{ background: c.grad }} />

                        <div className="p-5">
                            {/* Certificate mockup preview */}
                            <div className="mb-5">
                                <CertPreview
                                    color={c.color} tint={c.tint} border={c.border}
                                    icon={c.icon} title={c.title} org={c.org} year={c.year}
                                />
                            </div>

                            {/* Skills covered */}
                            <div className="mb-4">
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--text-faint)" }}>
                                    Topics Covered
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {c.skills.map(s => (
                                        <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full"
                                            style={{ background: c.tint, color: c.color, border: `1px solid ${c.border}` }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Verify button */}
                            <a
                                href={c.verifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-bold w-full justify-center py-2.5 rounded-xl transition-all duration-200"
                                style={{ background: c.tint, color: c.color, border: `1px solid ${c.border}` }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = c.color; el.style.color = "#fff"; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = c.tint; el.style.color = c.color; }}
                            >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                View on LinkedIn
                                <ExternalLink className="w-3 h-3 ml-auto" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default Certifications;
