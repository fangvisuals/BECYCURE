import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function BackButton() {
  const location = useLocation();

  // Ne pas afficher sur la page d'accueil
  if (location.pathname === '/') return null;

  return (
    <Link
      to="/"
       className="flex items-center text-sky-400 hover:text-sky-300 font-mono text-sm transition-colors"
    >
      <ChevronLeft className="w-4 h-4 mr-2" />
      Retour
    </Link>
  );
}
