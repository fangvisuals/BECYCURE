// src/pages/Services.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx'
import GradientText from '../components/GradientText.jsx'
import ScrambleText from '../components/Scramble.jsx'
import Panel from '../components/Panel.jsx';
import SpotlightCard from '../components/SpotlightCard.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';
import SEO from '@/seo/SEO.jsx';

export default function Services() {
  const BASE = import.meta.env.BASE_URL || "/";
  const expertiseIcon = `${BASE}pictures/icons/expertise.svg`;
  const delaiIcon = `${BASE}pictures/icons/delai.svg`;

  return (
    <div className="w-full min-h-screen text-white/80 py-10 px-4 sm:px-6 md:px-10 lg:px-24 overflow-y-auto scroll-smooth">
      <SEO
        title="Services Managés — BeAnalyse 24/7 | BECYCURE"
        description="Services managés de sécurité: surveillance 24/7 follow‑the‑sun, support à la demande, heures ouvrées et couverture totale."
        canonicalPath="/services"
        ogImage={(import.meta.env.BASE_URL || "/") + "pictures/ogImage.png"}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BECYCURE",
          url: (import.meta.env.VITE_SITE_ORIGIN || window.location.origin),
          logo: ((import.meta.env.VITE_SITE_ORIGIN || window.location.origin).replace(/\/$/, "")) + (import.meta.env.BASE_URL || "/") + "android-chrome-512x512.png",
          sameAs: ["https://fr.linkedin.com/company/becycure"],
        }}
      />
      <BackButton strokeClass="stroke-green-300" className="mb-4" />
      <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05] mb-8">
        <span className="block">
          <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
            <GradientText
              colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
              animationSpeed={3}
            >
              <ScrambleText
                as="span"
                text="/ SERVICES MANAG&Eacute;S"
                trigger="mount"
                duration={300}
                cyclesPerLetter={8}
                shuffleMs={70}
                respectMotion={false}
                reserveWidth={false}
              />
            </GradientText>
          </span>
        </span>
      </h1>

      <div className="flex flex-col gap-16 md:gap-20">
        {/* Panel 1 */}
        <section className="w-full flex justify-start items-start">
          <Panel border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-2xl md:max-w-3xl self-start">
            <h2 className="text-2xl py-2 sm:text-3xl md:text-4xl font-semibold leading-tight mb-4 sm:mb-6 md:mb-8">
              <span className="font-bold text-green-400">BeAnalyse</span>, des services manag&eacute;s adapt&eacute;s &agrave; vos besoins r&eacute;els.
            </h2>
            <div className="flex items-center gap-5 sm:gap-6 md:gap-8">
              <p className="text-lg leading-relaxed text-gray-200">
                Nos ing&eacute;nieurs et analystes assurent une protection continue gr&acirc;ce &agrave; une surveillance
                mondiale en mod&egrave;le follow-the-sun, garantissant une disponibilit&eacute; 24/7 sans interruption.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-5 sm:gap-6 md:gap-8">
              <img
                src={expertiseIcon}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 self-center"
                loading="lazy"
                decoding="async"
              />
              <p className="text-lg leading-relaxed text-gray-200">
                Nos ing&eacute;nieurs associent <span className="font-bold">expertise technique</span> et <span className="font-bold">connaissance des environnements complexes</span> pour garantir une mise
                en &oelig;uvre en respectant les bonnes pratiques.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-5 sm:gap-6 md:gap-8">
              <img
                src={delaiIcon}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 self-center"
                loading="lazy"
                decoding="async"
              />
              <p className="text-lg leading-relaxed text-gray-200">
                Notre retour d'exp&eacute;rience et notre <span className="font-bold">approche pragmatique</span> permettent de
                r&eacute;duire les <span className="font-bold">d&eacute;lais de d&eacute;ploiement</span>.
              </p>
            </div>
          </Panel>
        </section>

        {/* Panel 2: 3 cartes Spotlight */}
        <section className="w-full flex justify-end items-center">
          <Panel border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-5xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight mb-4 sm:mb-6">
              D&eacute;couvrez <span className="font-bold text-green-400">BeAnalyse</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <SpotlightCard
                title="Tickets d'intervention"
                tagline="Support &agrave; la demande"
                description="Id&eacute;al pour les organisations qui souhaitent un support ponctuel et cibl&eacute;.
    Chaque ticket correspond &agrave; une intervention experte pour traiter vos incidents de s&eacute;curit&eacute; rapidement et efficacement."
                ctaLabel="Ouvrir un ticket"
                ctaTo="/conseil"
              />
              <SpotlightCard
                title="Heures ouvr&eacute;es"
                tagline="Une surveillance adapt&eacute;e &agrave; vos horaires."
                description="Couverture et assistance renforc&eacute;e sur vos plages horaires de bureau.
    Vos syst&egrave;mes sont surveill&eacute;s par nos analystes quand vos &eacute;quipes sont pr&eacute;sentes,
    pour un &eacute;quilibre optimal entre protection et budget."
                ctaLabelLines={["Prot&eacute;ger mes syst&egrave;mes","aux heures ouvr&eacute;es"]}
                ctaTo="/integration"
              />
              <SpotlightCard
                title="24/7"
                tagline="Surveillance continue"
                description="Une supervision continue gr&acirc;ce &agrave; nos centres de s&eacute;curit&eacute; en follow-the-sun.
    Vos environnements sont prot&eacute;g&eacute;s jour et nuit, sans rupture, avec une d&eacute;tection et une r&eacute;ponse en temps r&eacute;el."
                ctaLabel="Passer &agrave; une couverture totale"
                ctaTo="/services"
              />
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
