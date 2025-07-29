import React from 'react';
import { Link } from 'react-router-dom';

export default function Partenariats() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10 px-8 py-40 max-w-5xl mx-auto">
        <h1 className="title gradient-text mb-8">/ PARTENARIATS</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          Nous collaborons avec un écosystème de partenaires technologiques et institutionnels pour offrir des solutions innovantes et robustes.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Éditeurs & intégrateurs</h2>
        <p className="text-gray-300 mb-6">
          Nous sélectionnons les meilleurs éditeurs et intégrateurs pour garantir la performance et la sécurité de vos projets.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Institutions & réseaux</h2>
        <p className="text-gray-300 mb-6">
          BECYCURE s’implique dans des réseaux professionnels et des initiatives institutionnelles pour anticiper les évolutions du secteur.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Innovation & veille</h2>
        <p className="text-gray-300 mb-6">
          Nous menons une veille technologique active et participons à des projets d’innovation pour rester à la pointe de la cybersécurité.
        </p>
      </div>
    </div>
  );
}
