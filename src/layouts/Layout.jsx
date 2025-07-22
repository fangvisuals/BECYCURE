import React from 'react';
import { ChevronRight } from 'lucide-react';

import Header from '../components/Header';
import BackButton from '../components/BackButton';
import AnimatedRoutes from '../routes/AnimatedRoutes';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative z-10 pt-24 text-white bg-[#080808] overflow-hidden">
      <Header />
      <BackButton />

      <main className="flex-1 flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-8">
          <AnimatedRoutes />
        </div>
      </main>

      {/* Terminal animé en bas */}
      <div className="fixed bottom-8 left-8 z-20">
        <div className="flex items-center font-mono text-sky-400">
          <ChevronRight className="w-4 h-4" />
          <div className="w-2 h-5 bg-sky-400 ml-1 animate-blink"></div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
