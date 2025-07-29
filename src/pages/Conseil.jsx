import React from 'react';
import { Link } from 'react-router-dom';

export default function Conseil() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10 px-8 py-40 max-w-5xl mx-auto">
        <h1 className="title gradient-text mb-8">/ CONSEIL</h1>
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
      </div>
    </div>
  );
}
