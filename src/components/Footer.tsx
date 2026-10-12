import { Link } from "react-router-dom";
import { homeSections, links, profile } from "@/content/site";
import { projects } from "@/content/projects";

const Footer = () => (
  <footer className="border-t border-rule bg-surface">
    <div className="page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
      <div>
        <p className="font-serif text-xl text-ink">{profile.name}</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-3">
          Data analytics, data science and machine learning · {profile.location}
        </p>
      </div>

      <nav aria-label="Footer — sections">
        <p className="eyebrow mb-3">Sections</p>
        <ul className="space-y-2 text-sm">
          {homeSections
            .filter((s) => s.id !== "top")
            .map((s) => (
              <li key={s.id}>
                <Link to={`/#${s.id}`} className="text-ink-2 hover:text-accent">
                  {s.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <nav aria-label="Footer — case studies">
        <p className="eyebrow mb-3">Case studies</p>
        <ul className="space-y-2 text-sm">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={p.path} className="text-ink-2 hover:text-accent">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <p className="eyebrow mb-3">Elsewhere</p>
        <ul className="space-y-2 text-sm">
          <li>
            <a href={links.email} className="text-ink-2 hover:text-accent">
              Email
            </a>
          </li>
          <li>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-accent">
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-accent">
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={links.resume} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-accent">
              Resume (PDF)<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="page">
      <div className="border-t border-rule py-6 text-xs text-ink-3">
        © {new Date().getFullYear()} {profile.name}
      </div>
    </div>
  </footer>
);

export default Footer;
