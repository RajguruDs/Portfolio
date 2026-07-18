import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Calendar, MapPin, BookOpen, Star } from "lucide-react";

const highlights = [
    "Data Structures & Algorithms",
    "Database Management Systems",
    "Operating Systems",
    "Statistics & Probability",
    "Machine Learning Fundamentals",
    "Web Technologies",
];

const Education = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section
            id="education"
            className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16"
            style={{ background: "var(--bg-page)" }}
            ref={ref}
        >
            <div className="max-w-6xl mx-auto">
                <div className="section-label">Education</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Academic background
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl"
                    style={{
                        background: "#FFFFFF",
                        border: "1px solid #BFDBFE",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(17,24,39,0.05)",
                    }}
                >
                    {/* Gradient bar */}
                    <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#2563EB,#0D9488)" }} />

                    <div className="p-7">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", boxShadow: "0 2px 8px #2563EB14" }}
                            >
                                <GraduationCap className="w-6 h-6" style={{ color: "#2563EB" }} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                                    B.Sc. Information Technology
                                </h3>
                                <p className="text-sm font-medium mt-0.5" style={{ color: "#2563EB" }}>
                                    D.G. Ruparel College · Mumbai University
                                </p>
                            </div>
                        </div>

                        {/* Meta badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="tag tag-blue">
                                <Calendar className="w-3 h-3 mr-1" />2023 – 2026
                            </span>
                            <span className="tag" style={{ background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}>
                                <MapPin className="w-3 h-3 mr-1" />Mumbai, Maharashtra
                            </span>
                            <span className="tag tag-green">
                                <Star className="w-3 h-3 mr-1 fill-current" />Currently Pursuing
                            </span>
                        </div>

                        {/* CGPA row */}
                        <div className="rounded-xl p-4 mb-6" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1E40AF" }}>
                                    Academic Performance (CGPA)
                                </span>
                                <span className="text-xl font-extrabold" style={{ color: "#2563EB" }}>8.60 / 10</span>
                            </div>
                            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#DBEAFE" }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: "linear-gradient(90deg,#2563EB,#0D9488)" }}
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: "86%" } : {}}
                                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-[10px] mt-1.5 font-medium" style={{ color: "#3B82F6" }}>
                                86th percentile · Top of cohort
                            </p>
                        </div>

                        {/* Key subjects */}
                        <div>
                            <div className="flex items-center gap-1.5 mb-3">
                                <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} />
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: "var(--text-faint)" }}>
                                    Key Subjects
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {highlights.map((h) => (
                                    <span
                                        key={h}
                                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                                        style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                                    >
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Education;
