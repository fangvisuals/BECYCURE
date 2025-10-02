import React, { lazy, Suspense, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import BrandLink from "./components/BrandLink";
import Loader from "./components/Loader.jsx";
import GoogleAnalytics from "./analytics/GoogleAnalytics.jsx"; // GA-TODO: Requires VITE_GA_ID

const BackgroundCanvas = lazy(() => import("./components/BackgroundCanvas.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Integration = lazy(() => import("./pages/Integration.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Conseil = lazy(() => import("./pages/Conseil.jsx"));
const Partenariats = lazy(() => import("./pages/Partenariats.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
import MinimalFooter from "./components/MinimalFooter.jsx";

const ROUTE_PRELOADS = [
  () => import("./pages/Integration.jsx"),
  () => import("./pages/Services.jsx"),
  () => import("./pages/Conseil.jsx"),
  () => import("./pages/Partenariats.jsx"),
  () => import("./pages/Blog.jsx"),
  () => import("./pages/BlogPost.jsx"),
  () => import("./pages/Contact.jsx"),
  () => import("./pages/Privacy.jsx"),
  () => import("./pages/Legal.jsx"),
];

function RouteFallback() {
  return (
    <div className="flex w-full items-center justify-center py-24">
      <div className="rounded-full border border-white/15 bg-white/5 px-5 py-2 font-mono text-xs uppercase tracking-[0.45em] text-white/60">
        Chargement
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  React.useEffect(() => {
    // Ne pas remonter si l'URL contient un hash (ancre)
    if (window.location.hash) return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";
    const mainEl = document.querySelector("main");
    if (mainEl && "scrollTo" in mainEl) {
      (mainEl as HTMLElement).scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  }, [location.pathname]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full"
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/services" element={<Services />} />
            <Route path="/conseil" element={<Conseil />} />
            <Route path="/partenariats" element={<Partenariats />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/politique-de-confidentialite" element={<Privacy />} />
            <Route path="/mentions-legales" element={<Legal />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [essentialReady, setEssentialReady] = useState(false);
  const [domReady, setDomReady] = useState(() => document.readyState === "complete");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("./pages/Home.jsx"),
      import("./components/Scramble.jsx"),
      import("./components/GradientText.jsx"),
    ])
      .catch(() => void 0)
      .finally(() => {
        if (!cancelled) setEssentialReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (domReady) return;
    const handle = () => setDomReady(true);
    window.addEventListener("load", handle, { once: true });
    return () => window.removeEventListener("load", handle);
  }, [domReady]);

  const loading = !(essentialReady && domReady);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  useEffect(() => {
    const idle =
      window.requestIdleCallback ||
      ((cb) => setTimeout(() => cb({ didTimeout: false }), 1200));
    const id = idle(() => {
      ROUTE_PRELOADS.forEach((load) => {
        try {
          load();
        } catch (err) {
          console.warn("Prefetch failed", err);
        }
      });
    });
    return () => {
      const cancel = window.cancelIdleCallback || clearTimeout;
      cancel(id);
    };
  }, []);

  const [showBg, setShowBg] = useState(false);
  useEffect(() => {
    const rIC =
      window.requestIdleCallback ||
      ((cb) => setTimeout(() => cb({ didTimeout: false }), 800));
    const id = rIC(() => setShowBg(true));
    return () => {
      const cIC = window.cancelIdleCallback || clearTimeout;
      cIC(id);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#071019] text-white/80 overflow-x-hidden relative selection:bg-green-300 selection:text-green-900">
        {/* GA-TODO: Google Analytics mount (set VITE_GA_ID in .env) */}
        <GoogleAnalytics />
        {showBg && (
          <Suspense fallback={null}>
            <BackgroundCanvas showFaulty={true} />
          </Suspense>
        )}

        <div className="flex flex-col min-h-screen relative pt-20 z-10 main-wrapper">
          <BrandLink />
          <main id="app-main" className="flex-1 flex items-start justify-start px-4 sm:px-6 overflow-y-auto scroll-smooth">
              <AnimatedRoutes />
          </main>

          {/* Very subtle fixed footer (bottom-right) */}
          <MinimalFooter />

          <div className="fixed bottom-8 left-8 z-20">
            <div className="flex items-center font-mono text-green-400">
              <ChevronRight className="w-4 h-4" />
              <div className="w-2 h-5 bg-green-400 ml-1 animate-blink" />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
