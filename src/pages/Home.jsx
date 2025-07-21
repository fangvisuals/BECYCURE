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
    { path: '/blog', label: '/BLOG' },
  ];

  const externalLinks = [
    { href: 'https://www.linkedin.com/', label: '/LINKEDIN' },
    { href: 'https://www.youtube.com/', label: '/YOUTUBE' },
  ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-2/3 space-y-8 flex flex-col justify-center min-h-[80vh] mx-3"
>
        <div className="w-2/3 space-y-8 flex flex-col justify-center min-h-[80vh] mx-3">
          {/* Titre */}
          <div className="space-y-3">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight font-space-grotesk">
              <span className="text-sky-400">L'IA</span>
              <span className="text-white"> POUR ÉCLAIRER L'EXPERTISE</span>
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
            <div className="mt-6 space-y-1">
              {internalLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="group flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Liens externes */}
            <div className="mt-6">/SUIVEZ-NOUS</div>
            <div className="space-y-1">
              {externalLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-sky-400 hover:text-sky-300 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }