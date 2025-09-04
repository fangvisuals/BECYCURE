// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Scramble, { ScrambleText, ScrambleLink } from "@/components/Scramble.jsx";
import GradientText from "@/components/GradientText.jsx";
import PageContainer from "@/components/layout/PageContainer.jsx";

export default function Home() {
  const internalLinks = [
    { path: "/integration", label: "/INTÉGRATION" },
    { path: "/services", label: "/SERVICES MANAGÉS" },
    { path: "/conseil", label: "/CONSEIL" },
    { path: "/partenariats", label: "/PARTENARIATS" },
    { path: "/blog", label: "/ACTUALITÉS" },
  ];

  const externalLinks = [
    { href: "https://fr.linkedin.com/company/becycure", label: "/LINKEDIN" },
    { href: "https://becycure.com/newsletter/", label: "/NEWSLETTER" },
  ];

  return (
    <PageContainer
      as="section"
      centerY
      maxW="max-w-[min(94vw,1200px)] xl:max-w-[1200px]"
      px="px-5 sm:px-6 md:px-8 lg:px-12"
      py="py-10 sm:py-12 md:py-16"
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl ml-0 mr-auto md:mx-auto
        px-4 sm:px-6 space-y-8 flex flex-col justify-center"
      >
        {/* Titre */}
        <div className="space-y-2">
          <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05]">
            {/* Ligne 1 : L'IA (gradient animé) + POUR ÉCLAIRER (blanc) */}
            <span className="block">
              <span className="inline-flex items-baseline flex-wrap gap-x-0 sm:gap-x-3 whitespace-nowrap">
                <GradientText
                  colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                  animationSpeed={3}
                >
                  <Scramble
                    as="span"
                    text={"L'IA"}
                    trigger="mount"
                    duration={300}
                    cyclesPerLetter={4}
                    shuffleMs={120}
                    respectMotion={false}
                    reserveWidth={false}
                  />
                </GradientText>

                <span className="text-white/90">
                  <Scramble
                    as="span"
                    text={"POUR ÉCLAIRER"}
                    trigger="mount"
                    duration={300}
                    cyclesPerLetter={4}
                    shuffleMs={120}
                    respectMotion={false}
                    reserveWidth={false}
                  />
                </span>
              </span>
            </span>

            {/* Ligne 2 : L'EXPERTISE (blanc) + HUMAINE (gradient animé) */}
            <span className="block mt-1">
              <span className="inline-flex items-baseline flex-wrap gap-x-0 sm:gap-x-3 whitespace-nowrap">
                <span className="text-white/90">
                  <ScrambleText
                    as="span"
                    text={"L'EXPERTISE"}
                    trigger="mount"
                    duration={300}
                    cyclesPerLetter={4}
                    shuffleMs={120}
                    respectMotion={false}
                    reserveWidth={false}
                  />
                </span>

                <GradientText
                  colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]}
                  animationSpeed={3}
                >
                  <ScrambleText
                    as="span"
                    text={"HUMAINE"}
                    trigger="mount"
                    duration={1000}
                    cyclesPerLetter={2}
                    shuffleMs={70}
                    respectMotion={false}
                    reserveWidth={false}
                  />
                </GradientText>
              </span>
            </span>
          </h1>
        </div>

        {/* Sous-texte + liens */}
        <div className="font-mono text-sm space-y-1 text-gray-300 mt-8">
          <div className="text-green-400">
            <ScrambleText
              as="span"
              text={"BIENVENUE CHEZ "}
              trigger="mount"
              duration={1000}
              cyclesPerLetter={8}
              shuffleMs={70}
              respectMotion={false}
              className="gradient-text"
            />
            <span className="font-inter font-bold">
              <ScrambleText
                as="span"
                text={"BECYCURE"}
                trigger="mount"
                duration={1000}
                cyclesPerLetter={8}
                shuffleMs={70}
                respectMotion={false}
                className="gradient-text"
              />
            </span>
          </div>

          <div className="mt-4 space-y-1">
            <ScrambleText
              as="span"
              text={"NOTRE MISSION EST DE PROTÉGER ET SÉCURISER "}
              trigger="mount"
              duration={1200}
              cyclesPerLetter={8}
              shuffleMs={70}
              respectMotion={false}
            />
          </div>

          <div className="mt-4 space-y-1">
            <ScrambleText
              as="span"
              text={"LES INFRASTRUCTURES NUMÉRIQUES"}
              trigger="view"
              duration={1200}
              cyclesPerLetter={8}
              shuffleMs={70}
              respectMotion={false}
            />
          </div>

          {/* Liens internes */}
          <div className="mt-6 space-y-1 flex flex-col items-start">
            {internalLinks.map(({ path, label }) => (
              <ScrambleLink
                key={path}
                to={path}
                label={label}
                respectMotion={false}
                className="group inline-flex items-center text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                icon={
                  <ChevronRight className="w-4 h-4 text-green-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-300 ease-in-out" />
                }
              />
            ))}
          </div>

          {/* Liens externes */}
          <div className="mt-6">/SUIVEZ-NOUS</div>
          <div className="space-y-1 flex flex-col items-start">
            {externalLinks.map(({ href, label }) => (
              <ScrambleLink
                key={href}
                href={href}
                label={label}
                className="group inline-flex items-center text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                icon={
                  <ChevronRight className="w-4 h-4 text-green-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-300 ease-in-out" />
                }
                respectMotion={false}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
