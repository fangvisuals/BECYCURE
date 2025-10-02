// SEO-TODO: Reuse this component on each page to set page-specific metadata
import React, { useEffect } from "react";

function setMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  } else {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
}

export default function SEO({
  // SEO-TODO: Fill these props where SEO is used on pages
  title,
  description,
  canonicalPath,
  ogImage,
  noindex = false,
  structuredData, // optional JSON-LD object
}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta('meta[name="description"]', { name: 'description', content: description });

    // Open Graph
    if (title) setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    if (description) setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    if (ogImage) setMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });

    // Twitter
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    if (title) setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    if (description) setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    if (ogImage) setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    // Canonical (works even with HashRouter — we still set base canonical without the hash)
    if (canonicalPath) {
      const base = (import.meta.env.VITE_SITE_ORIGIN || window.location.origin).replace(/\/$/, '');
      const href = `${base}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    }

    // robots noindex at page level (e.g., staging or private pages)
    if (noindex) setMeta('meta[name="robots"]', { name: 'robots', content: 'noindex,nofollow' });

    // JSON-LD
    let ldTag;
    if (structuredData) {
      ldTag = document.createElement('script');
      ldTag.type = 'application/ld+json';
      ldTag.text = JSON.stringify(structuredData);
      document.head.appendChild(ldTag);
    }
    return () => {
      if (noindex) {
        const node = document.head.querySelector('meta[name="robots"][content="noindex,nofollow"]');
        if (node) node.remove();
      }
      if (ldTag) ldTag.remove();
    };
  }, [title, description, canonicalPath, ogImage, noindex, structuredData]);

  return null;
}

