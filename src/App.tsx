import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AnimatedBackgroundWithRoute from "./components/AnimatedBackgroundWithRoute";
import Header from "./components/Header";
import BackButton from "./components/BackButton";
import Loader from "./components/Loader";

import Home from "./pages/Home";
import Integration from "./pages/Integration";
import Services from "./pages/Services";
import Conseil from "./pages/Conseil";
import Partenariats from "./pages/Partenariats";
import Blog from "./pages/Blog";

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
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/services" element={<Services />} />
          <Route path="/conseil" element={<Conseil />} />
          <Route path="/partenariats" element={<Partenariats />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Bloquer scroll pendant chargement
    document.body.style.overflow = "hidden";

    // Simuler un chargement initial (remplacer par fetch réel si besoin)
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = ""; // réactiver scroll
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
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
      <div className="min-h-screen bg-[#080808] text-white overflow-hidden relative">
        {/* Fond animé dynamique */}
        <div className="fixed inset-0 z-0">
          <AnimatedBackgroundWithRoute />
        </div>

        {/* Contenu au-dessus */}
        <div className="flex flex-col min-h-screen relative z-10 pt-24">
          <Header />
          <BackButton />

          <main className="flex-1 flex items-center justify-start px-24 overflow-hidden">
            <div className="w-full max-w-4xl">
              <AnimatedRoutes />
            </div>
          </main>

          <div className="fixed bottom-8 left-8 z-20">
            <div className="flex items-center font-mono text-sky-400">
              <ChevronRight className="w-4 h-4" />
              <div className="w-2 h-5 bg-sky-400 ml-1 animate-blink"></div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
