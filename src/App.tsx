import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import BackButton from './components/BackButton';
import Loader from './components/Loader';

import Home from './pages/Home';
import Integration from './pages/Integration';
import Services from './pages/Services';
import Conseil from './pages/Conseil';
import Partenariats from './pages/Partenariats';
import Blog from './pages/Blog';

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
        style={{ minHeight: '100vh', width: '100%' }}
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

function AnimatedBackgroundWithRoute() {
  const location = useLocation();

  const getTargetColor = (pathname) => {
    if (pathname.startsWith('/integration')) return '#ff00cc';
    if (pathname.startsWith('/services')) return '#ffea00';
    if (pathname.startsWith('/conseil')) return '#00ff99';
    if (pathname.startsWith('/partenariats')) return '#ff6600';
    if (pathname.startsWith('/blog')) return '#a259ff';
    return '#00ffff';
  };

  const [color, setColor] = useState(getTargetColor(location.pathname));

  useEffect(() => {
    let frame;
    let start;
    const duration = 600;

    const hexToRgb = (hex) => {
      const m = hex.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
      return m ? [parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)] : [0,0,0];
    };

    const rgbToHex = ([r,g,b]) => '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');

    const lerp = (a, b, t) => a + (b - a) * t;

    const from = hexToRgb(color);
    const to = hexToRgb(getTargetColor(location.pathname));

    function animate(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const next = [
        Math.round(lerp(from[0], to[0], t)),
        Math.round(lerp(from[1], to[1], t)),
        Math.round(lerp(from[2], to[2], t)),
      ];
      setColor(rgbToHex(next));
      if (t < 1) frame = requestAnimationFrame(animate);
    }

    if (rgbToHex(from) !== rgbToHex(to)) {
      frame = requestAnimationFrame(animate);
    }

    return () => frame && cancelAnimationFrame(frame);
  }, [location.pathname]);

  return <AnimatedBackground color={color} />;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Bloquer scroll pendant chargement
    document.body.style.overflow = 'hidden';

    // Simuler un chargement de données (remplace par fetch réel si besoin)
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = ''; // réactiver scroll
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
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
        <div className="fixed inset-0 z-0">
          <AnimatedBackgroundWithRoute />
        </div>

        <div className="flex flex-col min-h-screen relative z-10 pt-24">
          <Header />
          <BackButton />

          <main className="flex-1 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8">
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
