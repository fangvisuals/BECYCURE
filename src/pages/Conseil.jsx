import React from 'react';
import { Link } from 'react-router-dom';

export default function Conseil() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10 px-8 py-40 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-sky-400 mb-8 font-space-grotesk">/ CONSEIL</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          Nos experts vous accompagnent dans la définition, la mise en œuvre et l’optimisation de votre stratégie cybersécurité.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Audit & analyse de risques</h2>
        <p className="text-gray-300 mb-6">
          Nous réalisons des audits techniques et organisationnels pour identifier vos vulnérabilités et prioriser les actions à mener.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Stratégie & gouvernance</h2>
        <p className="text-gray-300 mb-6">
          Nous vous aidons à structurer votre gouvernance SSI, à définir des politiques adaptées et à piloter la conformité réglementaire.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Accompagnement au changement</h2>
        <p className="text-gray-300 mb-6">
          Nos consultants facilitent l’appropriation des nouveaux usages et la montée en compétence de vos équipes.
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
