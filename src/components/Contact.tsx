import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowUpRight, Check, FileText, Github, Linkedin, Loader2, Mail } from "lucide-react";
import Section from "@/components/Section";
import { m } from "framer-motion";
import Reveal from "@/components/Reveal";
import { links, profile } from "@/content/site";
import { cn } from "@/lib/utils";
import { fadeRise, RHYTHM, usePrefersReducedMotion } from "@/lib/motion";

// Public Google Apps Script web-app endpoint (not a secret). Override with VITE_CONTACT_ENDPOINT when the
// script is redeployed under a new URL. The script is apps-script/contact-form.gs; it must be deployed with
// "Execute as: Me" and "Who has access: Anyone" — see README ("Contact form").
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT ||
  "https://script.google.com/macros/s/AKfycbxYVNj1773SzA0hEPxpXpLv27cXuQsMsop_KyBfx9Mn8ld35XqFKjpKAjCcZXH_RZOumA/exec";

/** Give up waiting after this long; delivery is then unknown, so the visitor is told to email instead. */
const REQUEST_TIMEOUT_MS = 15000;

/** Development-only hint about why a submission wasn't confirmed (never shown to visitors). */
const devWarn = (reason: string) => {
  if (import.meta.env.DEV) console.warn(`[contact] submission not confirmed: ${reason}`);
};

const MAX_MESSAGE = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "unconfirmed" | "failed";

const validate = ({ name, email, message }: Fields): Errors => {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  if (!email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "That email address doesn't look right.";
  if (message.trim().length < 10) errors.message = "Please write a message of at least 10 characters.";
  return errors;
};

/**
 * Interprets the reply from apps-script/contact-form.gs, which is always {result:"success"} or
 * {result:"error", error:"…"}. Only an explicit "success" counts as sent; anything else is unconfirmed.
 */
const readResult = (payload: unknown): "sent" | "failed" | "unconfirmed" => {
  const result = payload && typeof payload === "object" ? (payload as { result?: unknown }).result : undefined;
  if (result === "success") return "sent";
  if (result === "error") return "failed";
  return "unconfirmed";
};

class ReplyError extends Error {
  constructor(readonly reason: "timeout" | "load-failed" | "no-callback") {
    super(reason);
  }
}

/**
 * Calls the Apps Script web app with JSONP. Apps Script returns the reply as a script that calls `callback`,
 * which the browser can always run — unlike a fetch() response, it doesn't depend on CORS headers. If the
 * script never runs (an "Access denied" page, a network failure, or no reply in time), this rejects.
 */
const requestJsonp = (url: string, params: URLSearchParams, timeoutMs: number) =>
  new Promise<unknown>((resolve, reject) => {
    const callback = `__portfolioContact_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const registry = window as unknown as Record<string, unknown>;
    const script = document.createElement("script");
    let settled = false;

    const finish = (settle: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      script.remove();
      // Leave a no-op behind briefly so a very late reply doesn't throw, then clean up.
      registry[callback] = () => undefined;
      window.setTimeout(() => delete registry[callback], 60000);
      settle();
    };

    const timer = window.setTimeout(() => finish(() => reject(new ReplyError("timeout"))), timeoutMs);
    registry[callback] = (payload: unknown) => finish(() => resolve(payload));
    script.onerror = () => finish(() => reject(new ReplyError("load-failed")));
    // Fires after the script ran; if it never called back, the reply wasn't the expected format.
    script.onload = () => finish(() => reject(new ReplyError("no-callback")));

    params.set("callback", callback);
    script.async = true;
    script.src = `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;
    document.head.appendChild(script);
  });

const channels = [
  { label: "Email", value: profile.email, href: links.email, icon: Mail, external: false },
  { label: "LinkedIn", value: "Rajguru Mathiyalagan", href: links.linkedin, icon: Linkedin, external: true },
  { label: "GitHub", value: "RajguruDs", href: links.github, icon: Github, external: true },
  { label: "Resume", value: "PDF, one page", href: links.resume, icon: FileText, external: true },
];

const EmailLink = () => (
  <a href={links.email} className="link">
    {profile.email}
  </a>
);

const Field = ({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {hint}
    </div>
    {children}
    <p id={`${id}-error`} className="mt-1.5 min-h-[1.25rem] text-[0.8125rem] text-danger-ink" aria-live="polite">
      {error}
    </p>
  </div>
);

/**
 * Shown only after the Apps Script confirmed the send (status "sent"). Focus moves to the heading so
 * keyboard and screen-reader users land on the confirmation instead of the removed submit button.
 */
const SentConfirmation = ({ onReset }: { onReset: () => void }) => {
  const reduce = usePrefersReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), []);

  return (
    <m.div
      role="status"
      aria-live="polite"
      {...fadeRise(reduce, 0, { y: 8, duration: 0.45 })}
      className="flex flex-col"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-accent-line bg-accent-soft text-accent">
        <Check className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <p className="eyebrow mt-6 text-[0.6875rem]">Message sent</p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-serif text-[1.75rem] leading-tight text-ink focus:outline-none sm:text-[2rem]"
      >
        Thanks for reaching out.
      </h3>
      <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-2">
        Your message is on its way. I&rsquo;ll get back to you by email as soon as I can.
      </p>
      <div className="mt-8 border-t border-rule pt-6">
        <button type="button" onClick={onReset} className="btn-secondary">
          Send another message
        </button>
      </div>
    </m.div>
  );
};

const Contact = () => {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const inFlight = useRef(false);
  const uid = useId();
  const ids = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message`, trap: `${uid}-website` };

  const update = (key: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...fields, [key]: e.target.value };
    setFields(next);
    // Once a field has been visited, keep its message in step with what's typed.
    if (touched[key]) setErrors((er) => ({ ...er, [key]: validate(next)[key] }));
    if (status === "failed" || status === "unconfirmed") setStatus("idle");
  };

  const onBlur = (key: keyof Fields) => (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e.target.value) return; // don't nag about a field the visitor merely tabbed through
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((er) => ({ ...er, [key]: validate(fields)[key] }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;

    const form = e.currentTarget;
    // Honeypot: real visitors never see or fill this field.
    if ((form.elements.namedItem("website") as HTMLInputElement | null)?.value) return;

    const found = validate(fields);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    inFlight.current = true;
    setStatus("sending");
    try {
      const params = new URLSearchParams({
        name: fields.name.trim(),
        email: fields.email.trim(),
        message: fields.message.trim(),
      });
      const reply = await requestJsonp(CONTACT_ENDPOINT, params, REQUEST_TIMEOUT_MS);
      const outcome = readResult(reply);
      if (outcome !== "sent") devWarn(`reply: ${JSON.stringify(reply)?.slice(0, 160)}`);
      setStatus(outcome);
      if (outcome === "sent") {
        setFields({ name: "", email: "", message: "" });
        setTouched({});
      }
    } catch (err) {
      // The script reply never arrived or never called back: a timeout, a network error, or a page that isn't
      // the script (e.g. the deployment's "Access denied" page). Delivery is unknown in every case, so say so.
      const reason = err instanceof ReplyError ? err.reason : String(err);
      devWarn(reason === "timeout" ? `no reply within ${REQUEST_TIMEOUT_MS / 1000}s` : reason);
      setStatus(navigator.onLine ? "unconfirmed" : "failed");
    } finally {
      inFlight.current = false;
    }
  };

  const inputClass = (invalid: boolean) =>
    cn(
      "block w-full rounded border bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink transition-[border-color,box-shadow] duration-150",
      "focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-soft",
      invalid ? "border-danger" : "border-control hover:border-ink-3",
    );
  const describedBy = (key: keyof Fields, extra?: string) =>
    [errors[key] ? `${ids[key]}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const sending = status === "sending";

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk."
      intro="I'm looking for entry-level roles in data analytics, data science and machine learning. Email is the quickest way to reach me."
    >
      <div className="grid gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14 lg:gap-20">
        {/* Direct channels */}
        <Reveal>
          <ul className="border-t border-rule" aria-label="Contact details">
            {channels.map(({ label, value, href, icon: Icon, external }) => (
              <li key={label} className="border-b border-rule">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group -mx-3 flex min-h-[64px] items-center gap-4 rounded px-3 py-3 transition-colors duration-200 hover:bg-surface focus-visible:bg-surface"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-rule bg-surface text-ink-2 transition-colors duration-200 group-hover:border-accent-line group-hover:text-accent">
                    <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block text-[0.6875rem]">{label}</span>
                    <span className="mt-0.5 block truncate text-[0.9375rem] text-ink transition-colors duration-200 group-hover:text-accent">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-ink-3 transition-[color,transform] duration-200 group-hover:text-accent motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-ink-3">Based in {profile.location}.</p>
        </Reveal>

        {/* Form */}
        <Reveal delay={RHYTHM.contact}>
          <div className="rounded-md border border-rule bg-surface p-6 sm:p-8">
            {status === "sent" ? (
              <SentConfirmation onReset={() => setStatus("idle")} />
            ) : (
              <form noValidate onSubmit={onSubmit} aria-labelledby="contact-form-title" aria-busy={sending}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 id="contact-form-title" className="font-serif text-[1.5rem] leading-tight text-ink">
                    Send a message
                  </h3>
                  <p className="text-[0.8125rem] text-ink-3">All fields required</p>
                </div>

                <fieldset disabled={sending} className="mt-6 grid gap-x-5 gap-y-1 sm:grid-cols-2">
                  <Field id={ids.name} label="Name" error={errors.name}>
                    <input
                      id={ids.name}
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      value={fields.name}
                      onChange={update("name")}
                      onBlur={onBlur("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={describedBy("name")}
                      className={inputClass(!!errors.name)}
                    />
                  </Field>
                  <Field id={ids.email} label="Email" error={errors.email}>
                    <input
                      id={ids.email}
                      name="email"
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      inputMode="email"
                      value={fields.email}
                      onChange={update("email")}
                      onBlur={onBlur("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={describedBy("email")}
                      className={inputClass(!!errors.email)}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field
                      id={ids.message}
                      label="Message"
                      error={errors.message}
                      hint={
                        <span id={`${ids.message}-count`} className="font-mono text-xs tabular-nums text-ink-3">
                          {fields.message.length}/{MAX_MESSAGE}
                        </span>
                      }
                    >
                      <textarea
                        id={ids.message}
                        name="message"
                        rows={5}
                        maxLength={MAX_MESSAGE}
                        value={fields.message}
                        onChange={update("message")}
                        onBlur={onBlur("message")}
                        aria-invalid={!!errors.message}
                        aria-describedby={describedBy("message", `${ids.message}-count`)}
                        className={cn(inputClass(!!errors.message), "min-h-[8.5rem] resize-y")}
                      />
                    </Field>
                  </div>
                </fieldset>

                {/* Honeypot field, hidden from people and assistive technology */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor={ids.trap}>Website</label>
                  <input id={ids.trap} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary disabled:cursor-wait disabled:opacity-80"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                  <p className="text-[0.8125rem] text-ink-3">
                    Or email <EmailLink /> directly.
                  </p>
                </div>

                <div role="status" aria-live="polite" className="empty:hidden">
                  {status === "unconfirmed" && (
                    <p className="mt-5 flex gap-2.5 rounded border-l-2 border-caution bg-caution-soft px-4 py-3 text-sm leading-relaxed text-ink-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-caution" aria-hidden="true" />
                      <span>
                        I couldn't confirm that your message arrived. To be sure it reaches me, please email{" "}
                        <EmailLink /> directly.
                      </span>
                    </p>
                  )}
                  {status === "failed" && (
                    <p className="mt-5 flex gap-2.5 rounded border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm leading-relaxed text-ink-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true" />
                      <span>
                        Your message wasn't sent. Please check your connection and try again, or email <EmailLink />.
                      </span>
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
};

export default Contact;
