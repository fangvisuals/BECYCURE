import React from "react";
import BackButton from "../components/BackButton.jsx";
import GradientText from "../components/GradientText.jsx";
import { ScrambleText } from "../components/Scramble.jsx";
import Panel from "../components/Panel.jsx";
import SEO from "@/seo/SEO.jsx";

export default function Legal() {
  return (
    <div className="w-full min-h-screen text-white/80 py-10 px-4 sm:px-6 md:px-10 lg:px-24 overflow-y-auto">
      <SEO
        title="Mentions légales – BECYCURE"
        description="Consultez les mentions légales de BECYCURE : informations sur l’éditeur, l’hébergement et les conditions d’utilisation du site."
        canonicalPath="/mentions-legales"
        ogImage={(import.meta.env.BASE_URL || "/") + "pictures/ogImage.png"}
      />
      <BackButton to="/" strokeClass="stroke-green-300" className="mb-4" />
      <h1 className="title leading-tight mb-6">
        <span className="block">
          <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
            <GradientText colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]} animationSpeed={3}>
              <ScrambleText as="span" text={"/ MENTIONS LÉGALES"} trigger="mount" duration={300} cyclesPerLetter={4} shuffleMs={120} respectMotion={false} reserveWidth={false} />
            </GradientText>
          </span>
        </span>
      </h1>
      <Panel border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-4xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Éditeur</h2>
        <p className="text-gray-200/90 leading-relaxed">BECYCURE — Informations légales à compléter.</p>
      </Panel>
    </div>
  );
}
