// GA-TODO: Provide VITE_GA_ID in your environment (.env) to enable tracking
import React, { useEffect } from "react";

function insertScript(src, id) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  s.id = id;
  document.head.appendChild(s);
}

export default function GoogleAnalytics() {
  useEffect(() => {
    const GA_ID = import.meta.env.VITE_GA_ID;
    if (!GA_ID) return; // GA-TODO: set VITE_GA_ID to enable

    // gtag base
    insertScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, 'ga-script');
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    // @ts-ignore
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }, []);

  return null;
}

