import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, MapPin, Send, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxYVNj1773SzA0hEPxpXpLv27cXuQsMsop_KyBfx9Mn8ld35XqFKjpKAjCcZXH_RZOumA/exec";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field-level validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields before sending.");
      return;
    }

    // Early exit if browser is offline — no point in trying
    if (!navigator.onLine) {
      toast.error("You appear to be offline. Please check your connection.");
      return;
    }

    setSending(true);

    const onSuccess = () => {
      toast.success("Message sent successfully! I'll get back to you soon 🙌");
      setForm({ name: "", email: "", message: "" });
    };

    try {
      // POST bodies are stripped when Google's exec URL does its internal redirect.
      // GET query parameters survive the redirect and are reliably read via
      // e.parameter.name/email/message inside doGet() in the Apps Script.
      // mode: 'no-cors' suppresses the opaque-response CORS error.
      const params = new URLSearchParams({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      // fetch resolved without throwing → request reached Google's servers.
      onSuccess();
    } catch (err) {
      // Only a genuine network failure (offline, DNS error) lands here.
      console.error("Contact form network error:", err);
      toast.error("Failed to send. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const inputBase =
    "w-full rounded-lg text-sm border border-[var(--border)] bg-white text-[var(--text-primary)] " +
    "placeholder:text-[var(--text-faint)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] " +
    "focus-visible:ring-offset-0 focus-visible:outline-none transition-shadow";

  return (
    <section
      id="contact"
      className="py-12 md:py-16 px-6 sm:px-10 scroll-mt-16"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="section-label">Get in Touch</div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="card p-7"
          >
            <h2
              className="text-2xl font-extrabold mb-1 tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Let's work together
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Open to data science internships, research collaborations, and freelance ML projects.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className={inputBase}
                    style={{ height: "2.625rem" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className={inputBase}
                    style={{ height: "2.625rem" }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}
                >
                  Message
                </label>
                <Textarea
                  placeholder="Tell me about your project or opportunity…"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className={inputBase}
                  style={{ resize: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Right — info sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Contact info */}
            <div className="card-flat p-5">
              <p
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-faint)" }}
              >
                Contact Info
              </p>
              <div className="space-y-3">
                {[
                  { icon: Mail, v: "rajguru21.ds@gmail.com", href: "mailto:rajguru21.ds@gmail.com" },
                  { icon: MapPin, v: "Mumbai, Maharashtra", href: undefined },
                ].map(({ icon: Icon, v, href }) => (
                  <div key={v} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--accent-light)", border: "1px solid var(--accent-border)" }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium transition-colors hover:underline"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ""; }}
                      >
                        {v}
                      </a>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{v}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            {[
              {
                href: "https://github.com/RajguruDs",
                icon: Github,
                label: "GitHub",
                sub: "@RajguruDs",
              },
              {
                href: "https://linkedin.com/in/rajguru-mathiyalagan-63b921244",
                icon: Linkedin,
                label: "LinkedIn",
                sub: "Rajguru Mathiyalagan",
              },
            ].map(({ href, icon: Icon, label, sub }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-3 p-4"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {label}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>
                    {sub}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-faint)" }} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
