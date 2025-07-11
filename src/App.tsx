import React from 'react';
import { ChevronRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background geometric elements */}
      <div className="absolute inset-0">
        {/* Top right geometric lines */}
        <div className="absolute top-8 right-32 w-64 h-32">
          <div className="absolute top-0 right-0 w-32 h-16 border-2 border-sky-400 transform rotate-12"></div>
          <div className="absolute top-8 right-8 w-24 h-12 border-2 border-sky-400 transform -rotate-12"></div>
        </div>
        
        {/* Bottom left geometric element */}
        <div className="absolute bottom-16 left-8 w-48 h-96">
          <div className="w-2 h-full bg-gradient-to-t from-sky-400 to-transparent"></div>
        </div>
        
        {/* Large circular element on the right */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4">
          <div className="w-96 h-96 rounded-full border-4 border-gray-600 opacity-30"></div>
          <div className="absolute inset-8 rounded-full border-2 border-gray-500 opacity-40"></div>
          <div className="absolute inset-16 rounded-full border border-gray-400 opacity-50"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-8">
          <div className="flex items-center text-sky-400 text-xl font-mono">
            <span className="mr-2"> /</span>
            <span className="font-bold">BECYCURE</span>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8">
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
                  <div></div>
                </div>

                <div className="mt-6 space-y-1">
                  <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                    <span className="text-sky-400">/</span>INTÉGRATION
                  </div>
                  <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                    <span className="text-sky-400">/</span>SERVICES MANAGÉS
                  </div>
                  <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                    <span className="text-sky-400">/</span>CONSEIL
                  </div>
                  <div>
                    /ACTUALITÉS
                  </div>
                  <div className="ml-4 space-y-1">
                      <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                          <span className="text-sky-400">/</span>PARTENARIATS
                        </div>
                        <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                          <span className="text-sky-400">/</span>BLOG
                        </div>
                      </div>
                  </div>
                  <div>
                    /SUIVEZ-NOUS
                  </div>
                  <div className="ml-4 space-y-1">
                      <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="text-sky-400 hover:text-sky-300 cursor-pointer transition-colors">
                          <span className="text-sky-400">/</span>LINKEDIN
                        </div>
                        <div className="text-sky-400 hover:text-sky-00 cursor-pointer transition-colors">
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
            <ChevronRight className="w-4 h-4 animate-blink" />
            <div className="w-2 h-5 bg-sky-400 ml-1 animate-blink"></div>
          </div>
        </div>
      </div>

      {/* Additional geometric decorations */}
      <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-gradient-to-b from-sky-400 to-transparent opacity-30 transform rotate-45"></div>
    </div>
  );
}

export default App;