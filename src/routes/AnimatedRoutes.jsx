import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import Home from '../pages/Home';
import Integration from '../pages/Integration';
import Services from '../pages/Services';
import Conseil from '../pages/Conseil';
import Partenariats from '../pages/Partenariats';
import Blog from '../pages/Blog';

function AnimatedRoutes() {
  const location = useLocation();

  return (
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
  );
}

export default AnimatedRoutes;
