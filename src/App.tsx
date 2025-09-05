import React, { lazy, Suspense, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import BrandLink from "./components/BrandLink";
import BackButton from "./components/BackButton";
import Loader from "./components/Loader.jsx";


// 🔻 lazy split : le fond 3D (three + r3f + loaders)
const BackgroundCanvas = lazy(() => import("./components/BackgroundCanvas.jsx"));

// ——— Pages ———
const Home         = lazy(() => import("./pages/Home.jsx"));
const Integration  = lazy(() => import("./pages/Integration.jsx"));
const Services     = lazy(() => import("./pages/Services.jsx"));
const Conseil      = lazy(() => import("./pages/Conseil.jsx"));
const Partenariats = lazy(() => import("./pages/Partenariats.jsx"));
const Blog         = lazy(() => import("./pages/Blog.jsx"));
const BlogPost     = lazy(() => import("./pages/BlogPost.jsx"));




function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Suspense fallback={null}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/services" element={<Services />} />
            <Route path="/conseil" element={<Conseil />} />
            <Route path="/partenariats" element={<Partenariats />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  // ——— Loader initial court ———
  useEffect(() => {
    document.body.style.overflow = "";
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
    }, 1500);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  // ——— Montage différé du fond 3D (après 1er paint / en idle) ———
  const [showBg, setShowBg] = useState(false);
  useEffect(() => {
    const rIC =
      (window as any).requestIdleCallback ||
      ((cb: Function) => setTimeout(() => cb({ didTimeout: false }), 800));
    const id = rIC(() => setShowBg(true));
    return () => {
      const cIC = (window as any).cancelIdleCallback || clearTimeout;
      cIC(id);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808] z-50">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#010101] text-white overflow-x-hidden relative">
        {/* Fond 3D en lazy + idle */}
        {showBg && (
          <Suspense fallback={null}>
            <BackgroundCanvas showFaulty={true} />
          </Suspense>
        )}

        {/* Contenu principal */}
        <div className="flex flex-col min-h-screen relative pt-24 z-10 main-wrapper ml-15">
          <BrandLink />
          <main className="flex-1 flex items-start justify-start
                  px-4 sm:px-6 md:px-10 lg:px-24
                  overflow-y-auto">
            <div className="w-full max-w-4xl">
              <AnimatedRoutes />
            </div>
          </main>

          <div className="fixed bottom-8 left-8 z-20">
            <div className="flex items-center font-mono text-green-400">
              <ChevronRight className="w-4 h-4" />
              <div className="w-2 h-5 bg-green-400 ml-1 animate-blink"></div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
