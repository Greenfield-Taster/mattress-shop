import { useEffect } from "react";
import { SITE_NAME, BASE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from "../utils/seoData";

function setMetaTag(property, content, attribute = "property") {
  let el = document.querySelector(`meta[${attribute}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

/**
 * usePageMeta — sets document title, meta description, OG tags,
 * Twitter Card, canonical URL, robots, and JSON-LD structured data.
 *
 * @param {Object} options
 * @param {string} options.title - Page title (appended with " — Just Sleep")
 * @param {string} [options.description] - Meta description
 * @param {string} [options.path] - Path for canonical URL (e.g. "/catalog")
 * @param {boolean} [options.noindex] - If true, sets robots to "noindex, nofollow"
 * @param {string} [options.ogImage] - OG image URL
 * @param {string} [options.ogType] - OG type (default: "website")
 * @param {Array} [options.jsonLd] - Array of JSON-LD objects to inject
 */
const usePageMeta = ({
  title,
  description,
  path,
  noindex = false,
  ogImage,
  ogType = "website",
  jsonLd,
} = {}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonicalUrl = path ? `${BASE_URL}${path}` : BASE_URL;
    const image = ogImage || DEFAULT_OG_IMAGE;

    // Title
    document.title = fullTitle;

    // Meta description
    setMetaTag("description", desc, "name");

    // Robots
    setMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow", "name");

    // Open Graph
    setMetaTag("og:title", fullTitle);
    setMetaTag("og:description", desc);
    setMetaTag("og:url", canonicalUrl);
    setMetaTag("og:image", image);
    setMetaTag("og:type", ogType);
    setMetaTag("og:locale", "uk_UA");
    setMetaTag("og:site_name", SITE_NAME);

    // Twitter Card
    setMetaTag("twitter:card", "summary_large_image", "name");
    setMetaTag("twitter:title", fullTitle, "name");
    setMetaTag("twitter:description", desc, "name");
    setMetaTag("twitter:image", image, "name");

    // Canonical
    setCanonical(canonicalUrl);

    // JSON-LD
    const scriptElements = [];
    if (jsonLd && jsonLd.length > 0) {
      jsonLd.forEach((data) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        scriptElements.push(script);
      });
    }

    return () => {
      // Reset title
      document.title = SITE_NAME;
      // Remove injected JSON-LD scripts
      scriptElements.forEach((el) => el.remove());
    };
  }, [title, description, path, noindex, ogImage, ogType, jsonLd]);
};

export default usePageMeta;
