import React from "react";
import BackButton from "@/components/BackButton.jsx";
import GradientText from "@/components/GradientText.jsx";
import { ScrambleText } from "@/components/Scramble.jsx";
import PartnersGrid from "@/components/PartnersGrid.jsx";

export default function Partenariats() {
  const partners = [
    {
      name: "IBM",
      logo: "./pictures/partners/ibm-logo.webp",
      url: "https://www.ibm.com/fr-fr",
      blurb:
        "Innovateur technologique mondial depuis plus d'un siècle : IA, automatisation et cloud hybride."
    },
    {
      name: "Splunk",
      logo: "./pictures/partners/splunk-logo.webp",
      url: "https://www.splunk.com/fr_fr",
      blurb:
        "Unifiez sécurité et observabilité grâce à l’IA pour faire face à toutes les situations."
    },
    {
      name: "Palo Alto Networks",
      logo: "./pictures/partners/palo-alto-networks-logo.webp",
      url: "https://www.paloaltonetworks.fr/",
      blurb: "Accélérez votre sécurité avec des plateformes nativement intégrées."
    },
    {
      name: "Sekoia",
      logo: "./pictures/partners/sekoia-logo.webp",
      url: "https://www.sekoia.io/fr/homepage/",
      blurb: "Boostez votre sécurité avec la plateforme SOC Sekoia."
    },
    {
      name: "Sesame it",
      logo: "./pictures/partners/sesame-it-logo.webp",
      url: "https://sesame-it.com/fr-fr",
      blurb:
        "Depuis 2017, Sesame it accompagne les organisations dans leur stratégie de cyberdéfense."
    },
    {
      name: "Harfang Lab",
      logo: "./pictures/partners/harfang-lab-logo.webp",
      url: "https://harfanglab.io/fr/",
      blurb:
        "Suite ouverte et performante pour sécuriser postes de travail et serveurs contre les menaces."
    },
    {
      name: "WALLIX",
      logo: "./pictures/partners/wallix-logo.webp",
      url: "https://www.wallix.com",
      blurb:
        "Leader européen de la sécurisation des identités et des accès aux environnements IT/OT."
    },
    {
      name: "Cyberwatch",
      logo: "./pictures/partners/cyberwatch-logo.webp",
      url: "https://cyberwatch.fr/",
      blurb:
        "Supervisez vos vulnérabilités et contrôlez vos conformités dans une seule plateforme."
    },
    {
      name: "Tenable",
      logo: "./pictures/partners/tenable-logo.webp",
      url: "https://fr.tenable.com/",
      blurb:
        "Gestion des vulnérabilités pour détecter, évaluer et prioriser les risques."
    },
    {
      name: "OGO Security",
      logo: "./pictures/partners/ogo-security-logo.webp",
      url: "https://www.ogosecurity.com/",
      blurb:
        "Protégez et accélérez vos sites, applications web et API grâce à .OGO."
    },
    {
      name: "Rapid7",
      logo: "./pictures/partners/rapid7-logo.webp",
      url: "https://www.rapid7.com/",
      blurb:
        "Unifiez exposition aux menaces, détection et réponse au sein d'une plateforme pilotée par l'IA."
    },
    { placeholder: true }
  ];

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
                <ScrambleText
                  as="span"
                  text={"/ PARTENARIATS"}
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

      {/* Grille (conteneur large centré et indépendant du header) */}
      <section className="relative z-10 mt-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-none">
          <PartnersGrid items={partners} />
        </div>
      </section>
    </div>
  );
}
