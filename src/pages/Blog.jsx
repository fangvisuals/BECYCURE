import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10 px-8 py-40 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-sky-400 mb-8 font-space-grotesk">/BLOG</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          Retrouvez ici nos actualités, analyses, retours d’expérience et conseils pour renforcer votre cybersécurité.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Veille & tendances</h2>
        <p className="text-gray-300 mb-6">
          Suivez les dernières tendances, menaces et innovations du secteur à travers nos articles de veille.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Retours d’expérience</h2>
        <p className="text-gray-300 mb-6">
          Découvrez des cas concrets, des témoignages clients et des bonnes pratiques issues de nos missions.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Conseils d’experts</h2>
        <p className="text-gray-300 mb-6">
          Nos consultants partagent leurs recommandations pour améliorer la sécurité de votre système d’information.
        </p>
        <div className="mt-12">
        <Link to="/" className="button" aria-label="Retour à l'accueil">
          <span className="button-box">
            <svg className="button-elem out" viewBox="0 0 20 20">
              <polyline points="12 4 6 10 12 16" stroke="#f0eeef" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="button-elem in" viewBox="0 0 20 20">
              <polyline points="12 4 6 10 12 16" stroke="#f0eeef" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
        </div>
      </div>
    </div>
  );
}
