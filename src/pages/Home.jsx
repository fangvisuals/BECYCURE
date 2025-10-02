// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Scramble, { ScrambleText, ScrambleLink } from "@/components/Scramble.jsx";
import GradientText from "@/components/GradientText.jsx";
import PageContainer from "@/components/layout/PageContainer.jsx";
import CTAButton from "@/components/CTAButton.jsx";
import SEO from "@/seo/SEO.jsx";

export default function Home() {
  const internalLinks = [
    { path: "/integration", label: "/INTÉGRATION" },
    { path: "/services", label: "/SERVICES MANAGÉS" },
    { path: "/conseil", label: "/CONSEIL" },
    { path: "/partenariats", label: "/PARTENARIATS" },
    { path: "/blog", label: "/ACTUALITÉS" }
  ];

  const externalLinks = [
    { href: "https://fr.linkedin.com/company/becycure", label: "/LINKEDIN" },
    { href: "https://becycure.com/newsletter/", label: "/NEWSLETTER" },
  ];

  return (
    <PageContainer
      as="section"
      px="px-4 sm:px-5 md:px-6 lg:px-8"
      py="py-0"
      className="space-y-8 min-h-[calc(100svh-5rem)] flex flex-col justify-center sm:min-h-0 sm:justify-start pt-0 sm:pt-[12vh] md:pt-[20vh] pl-1 sm:pl-2 md:pl-3 lg:pl-5"
    >
      <SEO
        title="Accueil — BECYCURE"
        description="Cybersécurité pour les organisations: intégration (SOC, VOC, bastion), services managés 24/7 et conseil (audit, gouvernance, pentests)."
        canonicalPath="/"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl ml-0 mr-auto pr-4 sm:pr-6 space-y-8 flex flex-col justify-center ml-0 sm:ml-0 md:-ml-6 lg:-ml-12 xl:-ml-24"
      >
        {/* Titre */}
        <div className="space-y-2">
          <h1 className="title text-[clamp(26px,8.5vw,40px)] text-balance sm:text-[clamp(36px,6vw,56px)] lg:text-7xl leading-[1.05]">
            {/* Ligne 1 : L'IA (gradient animé) + POUR ÉCLAIRER (blanc) */}
            <span className="block">
              <span className="inline-flex items-baseline gap-x-2 sm:gap-x-3 whitespace-normal sm:whitespace-nowrap">
                <GradientText
                  colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                  animationSpeed={3}
                >
                  <Scramble
                    as="span"
                    text={"L'IA"}
                    trigger="mount"
                    delay={0}
                    duration={420}
                    cyclesPerLetter={3}
                    shuffleMs={35}
                    respectMotion={false}
                    reserveWidth={false}
                   initialBlank={true} />
                </GradientText>

                <span className="text-grey/90">
                  <Scramble
                    as="span"
                    text={"POUR ÉCLAIRER"}
                    trigger="mount"
                    delay={120}
                    duration={500}
                    cyclesPerLetter={3}
                    shuffleMs={35}
                    respectMotion={false}
                    reserveWidth={false}
                   initialBlank={true} />
                </span>
              </span>
            </span>

            {/* Ligne 2 : L'EXPERTISE (blanc) + HUMAINE (gradient animé) */}
            <span className="block mt-1">
              <span className="inline-flex items-baseline gap-x-2 sm:gap-x-3 whitespace-normal sm:whitespace-nowrap">
                <span className="text-grey/90">
                  <ScrambleText
                    as="span"
                    text={"L'EXPERTISE"}
                    trigger="mount"
                    delay={240}
                    duration={500}
                    cyclesPerLetter={3}
                    shuffleMs={35}
                    respectMotion={false}
                    reserveWidth={false}
                   initialBlank={true} />
                </span>

                <GradientText
                  colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                  animationSpeed={3}
                >
                  <ScrambleText
                    as="span"
                    text={"HUMAINE"}
                    trigger="mount"
                    delay={360}
                    duration={650}
                    cyclesPerLetter={2}
                    shuffleMs={40}
                    respectMotion={false}
                    reserveWidth={false}
                   initialBlank={true} />
                </GradientText>
              </span>
            </span>
          </h1>
        </div>

        <div className="mt-6"><CTAButton label="Parlons sécurité" variant="original" /></div>

        {/* Sous-texte + liens */}
<div className="font-mono text-base space-y-1 text-gray-300 mt-8">
  <div className="space-y-1 text-lg font-bold">
    {/* wrapper qui borne la largeur + force le wrap pour tout le contenu enfant */}
    <div className="max-w-[30ch] sm:max-w-[56ch] [&_*]:whitespace-normal">
      <ScrambleText
        as="p"
        text={"NOTRE MISSION EST DE PROTÉGER ET SÉCURISER "}
        trigger="view"
        delay={0}
        duration={1200}
        cyclesPerLetter={8}
        shuffleMs={70}
        respectMotion={false}
        reserveWidth={false}               // <- IMPORTANT: autorise le wrap
        initialBlank={true}
        className="
          block leading-relaxed text-pretty break-words
          [hyphens:auto] tracking-tight
        "
      />
    </div>
      {/* Deuxieme paragraphe */}
      <div className="mt-4 space-y-1 text-lg font-bold">
        <div className="max-w-[30ch] sm:max-w-[40ch] md:max-w-[56ch] [&_*]:whitespace-normal">
          <ScrambleText
            as="p"
            text={"VOS INFRASTRUCTURES NUMÉRIQUES"}
            trigger="view"
            delay={0}
            duration={1200}
            cyclesPerLetter={8}
            shuffleMs={70}
            respectMotion={false}
            reserveWidth={false}               // <- IMPORTANT aussi ici
            initialBlank={true}
            className="
              block leading-relaxed text-pretty break-words
              [hyphens:auto] tracking-tight
            "
          />
        </div>
      </div>
          

          {/* Liens internes */}
          <div className="mt-4 space-y-1 flex flex-col items-start">
            {internalLinks.map(({ path, label }) => (
              <ScrambleLink
                key={path}
                to={path}
                label={label}
                initialBlank={true} trigger="view" alsoOnHover={true}
                respectMotion={false}
                className="group inline-flex items-center text-green-400 hover:text-green-300 transition-colors font-medium"
                icon={
                  <ChevronRight className="w-4 h-4 text-green-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-300 ease-in-out" />
                }
              />
            ))}
          </div>

          {/* Liens externes */}
          <ScrambleText
        as="p"
        text={"/SUIVEZ-NOUS"}
        trigger="view"
        delay={0}
        duration={1200}
        cyclesPerLetter={8}
        shuffleMs={70}
        respectMotion={false}
        reserveWidth={false}               // <- IMPORTANT: autorise le wrap
        initialBlank={true}
        className="
          block leading-relaxed text-pretty break-words
          [hyphens:auto] tracking-tight
        "
      />
          <div className="space-y-1 flex flex-col items-start">
            {externalLinks.map(({ href, label }) => (
              <ScrambleLink
                key={href}
                href={href}
                label={label}
                initialBlank={true} trigger="view" alsoOnHover={true}
                className="group inline-flex items-center text-green-400 hover:text-green-300 transition-colors font-medium"
                icon={
                  <ChevronRight className="w-4 h-4 text-green-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-300 ease-in-out" />
                }
                respectMotion={false}
              />
            ))}
          </div>
        </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}








