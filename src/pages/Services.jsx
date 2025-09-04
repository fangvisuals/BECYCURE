import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx'
import GradientText from '../components/GradientText.jsx';
import Scramble from '../components/Scramble.jsx';

export default function Services() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
          {/* En-tête (conteneur étroit) */}
          <div className="relative z-10 px-6 md:px-10 pt-10 md:pt-16  mx-auto">
            <BackButton className="mb-4" />
            <h1 className="title leading-tight">
              <span className="block">
                <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
                  <GradientText
                    colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                    animationSpeed={3}
                  >
                    <Scramble
                      as="span"
                      text={"/ SERVICES MANAGÉS"}
                      trigger="mount"
                      duration={300}
                      cyclesPerLetter={4}
                      shuffleMs={120}
                      respectMotion={false}
                      reserveWidth={false}
                    />
                  </GradientText>
                </span>
              </span>
            </h1>
          </div>
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
  );
}
