// src/pages/Integration.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function Integration() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Fond animé avec couleur spécifique */}

      {/* Contenu principal */}
      <div className="relative z-10 px-8 py-40 max-w-5xl ml-0">
        <h1 className="title gradient-text mb-8">/ INTÉGRATION</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          <span className='font-bold font-inter'>BECYCURE</span> vous accompagne dans l'intégration de vos solutions de cybersécurité avec une approche modulaire, progressive et totalement adaptée à vos contraintes SI.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Une expertise multi-technologies</h2>
        <p className="text-gray-300 mb-6">
          Nos équipes maîtrisent l’intégration des meilleures technologies du marché : XDR, SIEM, SOAR, EDR, NDR, IAM, et plateformes de détection de données sensibles.
          Nous travaillons en partenariat avec des éditeurs de confiance tels que IBM, Palo Alto Networks, Sekoia.io, HarfangLab ou encore Jizô.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Déploiement rapide et sécurisé</h2>
        <p className="text-gray-300 mb-6">
          Grâce à notre méthodologie éprouvée, nous assurons une intégration fluide, documentée et supervisée de bout en bout : cadrage, configuration, tests de recette, transfert de compétences.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Connecteurs & automatisation</h2>
        <p className="text-gray-300 mb-6">
          Nous développons des connecteurs sur mesure pour interfacer vos outils métiers (ITSM, SIEM, IAM, etc.) et maximiser l’automatisation des tâches à faible valeur ajoutée.
        </p>
      </div>
    </div>
  );
}
