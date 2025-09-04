import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx'
import GradientText from '../components/GradientText.jsx';
import Scramble from '../components/Scramble.jsx';
import Panel from '../components/Panel.jsx'
import PageContainer from '../components/layout/PageContainer.jsx';

export default function Conseil() {
  return (
    <PageContainer>
      <div className="min-h-screen text-white relative overflow-x-hidden">
        <div className="relative">
        <BackButton className="mb-4" />
        <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05] mb-8">
                    <span className="block">
                      <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
                        <GradientText
                          colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                          animationSpeed={3}
                        >
                          <Scramble
                            as="span"
                            text={"/ CONSEIL"}
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
                
        <Panel border='ring-1 ring-green-500/20 p-8'>
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
        </Panel>
      </div>
    </div>
    </PageContainer>
  );
}
