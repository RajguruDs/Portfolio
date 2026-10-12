import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "@/content/site";

const DEFAULT_TITLE = "Rajguru Mathiyalagan · Data Analytics, Data Science & Machine Learning";

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Keeps the document title, description, canonical URL and Open Graph tags in sync with the route. */
export const usePageMeta = (title: string | null, description: string) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} · Rajguru Mathiyalagan` : DEFAULT_TITLE;
    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
  }, [title, description, pathname]);
};
