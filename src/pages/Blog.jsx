import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx'

export default function Blog() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <BackButton className="mb-4" />
        <h1 className="title gradient-text mb-8">/ ACTUALITÉS</h1>
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
      </div>
    </div>
  );
}
