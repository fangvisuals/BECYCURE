// Animation de transition de page
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
          <Route path="/" element={<HomeLinks />} />
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
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Integration from './pages/Integration';
import Services from './pages/Services';
import Conseil from './pages/Conseil';
import Partenariats from './pages/Partenariats';
import Blog from './pages/Blog';

import { useState, useEffect, useRef } from 'react';
function AnimatedBackgroundWithRoute() {
  const location = useLocation();
  // Couleurs différentes selon la route
  const getTargetColor = (pathname) => {
    if (pathname.startsWith('/integration')) return '#ff00cc';
    if (pathname.startsWith('/services')) return '#ffea00';
    if (pathname.startsWith('/conseil')) return '#00ff99';
    if (pathname.startsWith('/partenariats')) return '#ff6600';
    if (pathname.startsWith('/blog')) return '#a259ff';
    return '#00ffff';
  };
  const [color, setColor] = useState(getTargetColor(location.pathname));
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

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
    const from = hexToRgb(colorRef.current);
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
    // eslint-disable-next-line
  }, [location.pathname]);

  return <AnimatedBackground color={color} />;
}

function App() {
  const location = window.location.pathname;
  useEffect(() => {
    if (location === '/') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [location]);
  return (
    <Router>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Fond animé fixé en arrière-plan */}
        <div className="fixed inset-0 z-0">
          <AnimatedBackgroundWithRoute />
        </div>
        {/* Contenu scrollable au-dessus */}
        <div className="flex flex-col min-h-screen relative z-10 pt-24">
          <header className="fixed top-0 left-0 p-8 z-20">
            <div className="flex items-center text-sky-400 text-xl font-mono">
              <span className="mr-2 text-white"> /</span>
              <span className="font-bold">BECYCURE</span>
            </div>
          </header>
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

// Liens de la page d'accueil

import { useLocation } from 'react-router-dom';
function HomeLinks() {
  const location = useLocation();
  return (
    <div className={`w-2/3 space-y-8 flex flex-col justify-center min-h-[80vh] mx-auto${location.pathname === '/' ? ' overflow-hidden' : ''}`}>
      <div className="space-y-4">
        <h1 className="text-6xl lg:text-7xl font-bold leading-tight font-space-grotesk">
          <span className="text-sky-400">L'IA</span>
          <span className="text-white"> POUR ÉCLAIRER L'EXPERTISE</span>
          <br />
        </h1>
      </div>
      <div className="font-mono text-sm space-y-1 text-gray-300 mt-8">
        <div className="text-sky-400">// BIENVENUE CHEZ BECYCURE </div>
        <div className="mt-4 space-y-1">
          <div>NOTRE MISSION EST DE</div>
          <div>PROTÉGER ET SÉCURISER</div>
          <div>LES INFRASTRUCTURES NUMÉRIQUES</div>
        </div>
        <div className="mt-6 space-y-1">
          <Link to="/integration" className="text-sky-400 hover:text-sky-300 transition-colors">/INTÉGRATION</Link>
          <br />
          <Link to="/services" className="text-sky-400 hover:text-sky-300 transition-colors">/SERVICES MANAGÉS</Link>
          <br />
          <Link to="/conseil" className="text-sky-400 hover:text-sky-300 transition-colors">/CONSEIL</Link>
          <br />
          <Link to="/partenariats" className="text-sky-400 hover:text-sky-300 transition-colors">/PARTENARIATS</Link>
          <br />
          <Link to="/blog" className="text-sky-400 hover:text-sky-300 transition-colors">/BLOG</Link>
        </div>
        <div className="mt-6">/ACTUALITÉS</div>
        <div className="mt-6">/SUIVEZ-NOUS</div>
        <div className="ml-4 space-y-1">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
            <span className="text-sky-400">/</span>LINKEDIN
          </a>
          <br />
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
            <span className="text-sky-400">/YOUTUBE</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;