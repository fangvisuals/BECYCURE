import React from "react";
import BackButton from "../components/BackButton.jsx";
import GradientText from "../components/GradientText.jsx";
import Scramble from "../components/Scramble.jsx";
import Panel from "../components/Panel.jsx";
import SpotlightCard from "../components/SpotlightCard.jsx";
import SEO from "../seo/SEO.jsx";

export default function Conseil() {
  const BASE = import.meta.env.BASE_URL || "/";
  const checklistIcon = `${BASE}pictures/icons/checklist.svg`;
  const livrableIcon = `${BASE}pictures/icons/livrable.svg`;

  return (
    <div className="w-full min-h-screen text-white/80 py-10 px-4 sm:px-6 md:px-10 lg:px-24 overflow-y-auto scroll-smooth">
      <SEO
        title="Conseil — Audit, Gouvernance, Pentests | BECYCURE"
        description="Audit de conformité (RGPD, DORA, NIS2, ISO 27001...), gouvernance sécurité et tests d’intrusion réalistes. Méthodologie rigoureuse et recommandations actionnables."
        canonicalPath="/conseil"
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
      <BackButton to="/" strokeClass="stroke-green-300" className="mb-4" />
      <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05] mb-8">
        <span className="block">
          <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
            <GradientText colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]} animationSpeed={3}>
              <Scramble
                as="span"
                text={"/ CONSEIL"}
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

      <div className="flex flex-col gap-16 md:gap-20">
        {/* Panel 1: alignee gauche (structure Services) */}
        <section id="conseil-1" className="w-full flex justify-start items-start">
          <Panel bg="bg-black/40" border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-2xl md:max-w-3xl self-start">
            <h2 className="text-2xl py-2 sm:text-3xl md:text-4xl font-semibold leading-tight mb-4 sm:mb-6 md:mb-8">
              La conformit&eacute;, un enjeu majeur de confiance et de r&eacute;silience.
            </h2>
            <div className="flex items-center gap-5 sm:gap-6 md:gap-8">
              <p className="text-lg leading-relaxed text-gray-200">
                <span className="font-semibold">BECYCURE</span> accompagne les organisations dans l'audit et la mise en conformit&eacute; face aux cadres essentiels : <span className="font-semibold">RGPD, DORA, NIS2, ISO 27001, HDS, PCI-DSS</span>. Nos consultants identifient les &eacute;carts, &eacute;valuent les risques et fournissent une feuille de route claire et prioris&eacute;e.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-5 sm:gap-6 md:gap-8">
              <img
                src={checklistIcon}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 self-center"
                loading="lazy"
                decoding="async"
              />
              <p className="text-lg leading-relaxed text-gray-200">
                Nous v&eacute;rifions aussi bien la <span className="font-semibold">gouvernance</span> (r&ocirc;les, proc&eacute;dures, reporting) que les <span className="font-semibold">points techniques</span> (acc&egrave;s, journalisation, sauvegardes, vuln&eacute;rabilit&eacute;s). Chaque mission est adapt&eacute;e &agrave; la taille, au secteur et aux priorit&eacute;s m&eacute;tiers de nos clients.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-5 sm:gap-6 md:gap-8">
              <img
                src={livrableIcon}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 self-center"
                loading="lazy"
                decoding="async"
              />
              <p className="text-lg leading-relaxed text-gray-200">
                Nos livrables sont con&ccedil;us pour &ecirc;tre directement exploitables : constats, preuves, plans d'actions, mod&egrave;les de politiques et registres. Nous transformons la conformit&eacute; en levier de s&eacute;curit&eacute; et de performance.
              </p>
            </div>
          </Panel>
        </section>

        {/* Panel 2: Intro pentest (align&eacute; &agrave; droite) */}
        <section id="conseil-2" className="w-full flex justify-end items-start">
          <Panel bg="bg-black/40" border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-3xl self-start">
            <h2 className="text-2xl sm:text-3xl font-semibold leading-tight mb-4">
              Tests d'intrusion r&eacute;alistes
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Les audits de conformit&eacute; permettent de savoir o&ugrave; vous en &ecirc;tes, mais seuls les tests d'intrusion montrent comment un attaquant pourrait exploiter vos faiblesses.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-200">
              <span className="font-semibold">BECYCURE</span> r&eacute;alise des pentests r&eacute;alistes, men&eacute;s par des ing&eacute;nieurs sp&eacute;cialis&eacute;s, afin de mesurer concr&egrave;tement la r&eacute;silience de vos environnements.
            </p>
          </Panel>
        </section>

        {/* Panel 3: Types de pentests (align&eacute; &agrave; gauche) */}
        <section id="conseil-3" className="w-full flex justify-start items-start">
          <Panel bg="bg-black/40" border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-5xl self-start">
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight mb-4">Nos principaux types de pentests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <SpotlightCard
                title="Pentest r&eacute;seau"
                tagline="Infrastructure"
                description="Identification des failles d'infrastructure (interne, externe, Wi‑Fi, segmentation)."
                ctaLabel={null}
              />
              <SpotlightCard
                title="Pentest applicatif"
                tagline="Applications web, mobiles et APIs"
                description="Analyse approfondie (injections, authentification, logique m&eacute;tier)."
                ctaLabel={null}
              />
              <SpotlightCard
                title="Pentest cloud"
                tagline="Configurations et acc&egrave;s"
                description="Contr&ocirc;le des environnements publics/hybrides (IAM, stockage, r&eacute;seaux virtuels)."
                ctaLabel={null}
              />
              <SpotlightCard
                title="Pentest social engineering"
                tagline="Phishing, vishing, tests physiques"
                description="Mesure de la sensibilisation et de la r&eacute;silience humaine."
                ctaLabel={null}
              />
            </div>
          </Panel>
        </section>

        {/* Panel 4: M&eacute;thodologie (align&eacute; &agrave; droite) */}
        <section id="conseil-4" className="w-full flex justify-end items-start">
          <Panel bg="bg-black/40" border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-3xl self-start">
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight mb-3">M&eacute;thodologie</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-200">
              <li>Cadrage pr&eacute;cis (p&eacute;rim&egrave;tre, objectifs, contraintes).</li>
              <li>Tests manuels et automatis&eacute;s bas&eacute;s sur les standards (OWASP, MITRE ATT&amp;CK, PTES).</li>
              <li>Exploitation contr&ocirc;l&eacute;e pour mesurer l'impact r&eacute;el (&eacute;l&eacute;vation de privil&egrave;ges, persistance, exfiltration).</li>
              <li>Restitution claire avec preuves, sc&eacute;narios d'attaque et recommandations correctives.</li>
            </ul>
          </Panel>
        </section>

        {/* Panel 5: Valeur ajout&eacute;e (align&eacute; &agrave; gauche) */}
        <section id="conseil-5" className="w-full flex justify-start items-start">
          <Panel bg="bg-black/40" border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-3xl self-start">
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight mb-3">Valeur ajout&eacute;e</h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Nos pentests apportent une vision factuelle et prioris&eacute;e des vuln&eacute;rabilit&eacute;s, afin d'investir vos ressources l&agrave; o&ugrave; le risque est le plus critique.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-200">
              Ils compl&egrave;tent les audits organisationnels et r&eacute;glementaires en fournissant des preuves tangibles de la robustesse de vos syst&egrave;mes.
            </p>
          </Panel>
        </section>
      </div>
    </div>
  );
}
