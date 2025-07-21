import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen py-60">
        {/* Header */}
        <header className="p-8">
          <div className="flex items-center text-sky-400 text-xl font-mono">
            <span className="font-bold">BECYCURE</span>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-5xl ml-8 px-8">
            {/* Left side - All content */}
            <div className="w-2/3 space-y-8">
              {/* Hero text */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-sky-400">L'IA</span>
                  <span className="text-white"> POUR ÉCLAIRER L'EXPERTISE</span>
                  <br />
                </h1>
              </div>

              {/* Terminal-style navigation */}
              <div className="font-mono text-sm space-y-1 text-gray-300 mt-8">
                <div className="text-sky-400">// BIENVENUE CHEZ BECYCURE </div>
                <div className="mt-4 space-y-1">
                  <div>NOTRE MISSION EST DE</div>
                  <div>PROTÉGER ET SÉCURISER</div>
                  <div>LES INFRASTRUCTURES NUMÉRIQUES</div>
                </div>

                <div className="mt-6 space-y-1">
                  <Link to="/integration" className="text-sky-400 hover:text-sky-300 transition-colors">
                    /INTÉGRATION
                    </Link>
                  <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                    <span className="text-sky-400">/</span>SERVICES MANAGÉS
                  </div>
                  <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                    <span className="text-sky-400">/</span>CONSEIL
                  </div>
                  <div>/ACTUALITÉS</div>
                  <div className="ml-4 space-y-1">
                    <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors" />
                    <div className="ml-4 space-y-1">
                      <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                        <span className="text-sky-400">/</span>PARTENARIATS
                      </div>
                      <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                        <span className="text-sky-400">/</span>BLOG
                      </div>
                    </div>
                  </div>
                  <div>/SUIVEZ-NOUS</div>
                  <div className="ml-4 space-y-1">
                    <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors" />
                    <div className="ml-4 space-y-1">
                      <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                        <span className="text-sky-400">/</span>LINKEDIN
                      </div>
                      <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                        <span className="text-sky-400">/YOUTUBE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Animated cursor */}
        <div className="fixed bottom-8 left-8">
          <div className="flex items-center font-mono text-sky-400">
            <ChevronRight className="w-4 h-4" />
            <div className="w-2 h-5 bg-sky-400 ml-1 animate-blink"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
