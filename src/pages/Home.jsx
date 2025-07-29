import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const internalLinks = [
    { path: '/integration', label: '/INTÉGRATION' },
    { path: '/services', label: '/SERVICES MANAGÉS' },
    { path: '/conseil', label: '/CONSEIL' },
    { path: '/partenariats', label: '/PARTENARIATS' },
    { path: '/blog', label: '/ACTUALITÉS' },
  ];

  const externalLinks = [
    { href: 'https://fr.linkedin.com/company/becycure', label: '/LINKEDIN' },
    { href: 'https://becycure.com/newsletter/', label: '/NEWSLETTER' },
  ];

    return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="w-full max-w-4xl mx-auto px-6 space-y-8 flex flex-col justify-center"
  >
    {/* Titre */}
    <div className="space-y-3">
      <h1 className="title">
        <span className="gradient-text">L'IA</span>
        <span className="text-white opacity-90"> POUR ÉCLAIRER L'EXPERTISE </span>
        <span className="gradient-text">HUMAINE</span>
      </h1>
    </div>

    {/* Introduction */}
    <div className="font-mono text-sm space-y-1 text-gray-300 mt-8">
      <div className="text-sky-400">// BIENVENUE CHEZ <span className="font-inter font-bold">BECYCURE</span></div>
      <div className="mt-4 space-y-1">
        <div>NOTRE MISSION EST DE PROTÉGER ET SÉCURISER</div>
        <div>LES INFRASTRUCTURES NUMÉRIQUES</div>
      </div>

{/* Liens internes */}
<div className="mt-6 space-y-1 flex flex-col items-start">
  {internalLinks.map(({ path, label }) => (
    <Link
  key={path}
  to={path}
  className="group inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
>
  <ChevronRight 
    className="w-4 h-4 text-sky-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-300 ease-in-out" 
  />
  <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300 ease-in-out">{label}</span>
</Link>
  ))}
</div>

{/* Liens externes */}
<div className="mt-6">/SUIVEZ-NOUS</div>
<div className="space-y-1 flex flex-col items-start">
  {externalLinks.map(({ href, label }) => (
    <a
      key={href}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center text-sky-400 hover:text-sky-300 cursor-pointer transition-colors"
    >
      <ChevronRight className="w-4 h-4 text-sky-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-300 ease-in-out" />
      <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300 ease-in-out">{label}</span>
    </a>
  ))}
</div>
    </div>
  </motion.div>
);
;
  }