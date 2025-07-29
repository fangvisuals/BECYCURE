import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10 px-8 py-40 max-w-5xl mx-auto">
        <h1 className="title gradient-text mb-8">/ SERVICES MANAGÉS</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          Nos services managés assurent la supervision, la maintenance et l’optimisation continue de vos solutions de cybersécurité, 24/7.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Supervision & Réactivité</h2>
        <p className="text-gray-300 mb-6">
          Notre SOC surveille en temps réel vos infrastructures, détecte les incidents et intervient rapidement pour limiter les impacts.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Reporting & conformité</h2>
        <p className="text-gray-300 mb-6">
          Vous recevez des rapports réguliers, des analyses de tendances et des recommandations pour rester conforme aux exigences réglementaires.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">Accompagnement personnalisé</h2>
        <p className="text-gray-300 mb-6">
          Un interlocuteur dédié vous accompagne pour adapter nos services à l’évolution de vos besoins et de votre contexte métier.
        </p>
      </div>
    </div>
  );
}
