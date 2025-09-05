// src/pages/Integration.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx'
import GradientText from '../components/GradientText.jsx'
import ScrambleText from '../components/Scramble.jsx'
import Panel from '../components/Panel.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';

export default function Integration() {
  return (
    <PageContainer>
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Fond animé avec couleur spécifique */}

      {/* Contenu principal */}
      
      <div className="relative z-10 max-w-5xl">
        <BackButton strokeClass='stroke-green-300' className="mb-4" />
        <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05] mb-8">
            <span className="block">
              <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
                <GradientText
                  colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                  animationSpeed={3}
                >
                  <ScrambleText
                    as="span"
                    text={"/ INTÉGRATION"}
                    trigger="mount"
                    duration={300}
                    cyclesPerLetter={4}
                    shuffleMs={120}
                    respectMotion={false}
                    reserveWidth={false}  // évite les grands blancs pendant l’anim
                  />
                </GradientText>
              </span>
            </span>
        </h1>

        <Panel border='ring-1 ring-sky-500/10'>
        <p className="text-lg leading-relaxed text-gray-200 mb-6 pt-4">
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
        </Panel>
      </div>
    </div>
    </PageContainer>
  );
}
