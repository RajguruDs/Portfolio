import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projects } from "@/content/projects";
import { usePageMeta } from "@/lib/usePageMeta";

const NotFound = () => {
  const { pathname } = useLocation();
  usePageMeta("Page not found", "This page doesn't exist. Find Rajguru Mathiyalagan's case studies and contact details here.");

  return (
    <section aria-labelledby="nf-title" className="page py-24 md:py-32">
      <p className="eyebrow mb-5">404 · Not found</p>
      <h1 id="nf-title" className="display max-w-3xl">
        There's nothing at this address.
      </h1>
      <p className="lede mt-6 max-w-prose">
        <code className="code break-all">{pathname}</code> doesn't match any page. It may have moved, or the link may
        have a typo.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className="btn-primary">
          Go to the home page
        </Link>
        <Link to="/#work" className="btn-secondary">
          See selected work
        </Link>
      </div>
      <ul className="mt-14 max-w-prose border-b border-rule">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link to={p.path} className="group flex min-h-[56px] items-center justify-between border-t border-rule text-ink hover:text-accent">
              {p.title}
              <ArrowRight className="h-4 w-4 text-ink-3 group-hover:text-accent" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotFound;
