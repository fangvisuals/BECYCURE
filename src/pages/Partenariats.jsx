import React, { useLayoutEffect, useRef, useState } from "react";
import BackButton from "@/components/BackButton.jsx";
import GradientText from "@/components/GradientText.jsx";
import { ScrambleText } from "@/components/Scramble.jsx";
import PartnersGrid from "@/components/PartnersGrid.jsx";
import SEO from "@/seo/SEO.jsx";

export default function Partenariats() {
  const sectionRef = useRef(null);
  const gridOuterRef = useRef(null);
  const [availableHeight, setAvailableHeight] = useState(null);
  const [scale, setScale] = useState(1);

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
        "Unifiez sécurité et observabilité grâce à l'IA pour faire face à toutes les situations."
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

  useLayoutEffect(() => {
    const recalc = () => {
      if (!sectionRef.current || !gridOuterRef.current) return;
      const top = sectionRef.current.getBoundingClientRect().top;
      const avail = Math.max(0, window.innerHeight - top);
      // Réserve une petite marge verticale pour éviter le scroll inutile
      const RESERVED_VH = 0.02; // 2% de la hauteur d'écran
      const RESERVED_MIN = 8;   // au moins 8px
      const reserved = Math.max(RESERVED_MIN, Math.round(window.innerHeight * RESERVED_VH));
      const usable = Math.max(0, avail - reserved);

      const el = gridOuterRef.current;
      const prev = el.style.transform;
      el.style.transform = "none";
      const naturalHeight = el.getBoundingClientRect().height;
      el.style.transform = prev;

      const comfort = 0.97; // petite marge sous la grille
      const baseScale = naturalHeight > 0 ? Math.min(1, usable / naturalHeight) : 1;
      const nextScale = Math.min(1, baseScale * comfort);
      setAvailableHeight(usable);
      setScale(isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    recalc();
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", onResize);

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => recalc())
      : null;
    if (ro && gridOuterRef.current) ro.observe(gridOuterRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("load", onResize);
      if (ro && gridOuterRef.current) ro.unobserve(gridOuterRef.current);
    };
  }, []);

  return (
    <div className="min-h-full text-white/80 relative overflow-x-hidden">
      <SEO
        title="Partenariats — Éditeurs et technologies | BECYCURE"
        description="Nos partenaires technologiques (SIEM, SOAR, EDR, bastion, gestion des vulnérabilités, cloud). Des solutions éprouvées intégrées par BECYCURE."
        canonicalPath="/partenariats"
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
      {/* En-tête */}
      <div className="relative z-10 px-4 py-2 md:px-10 pt-4 md:pt-6 mx-auto">
        <BackButton className="mb-2" />
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

      {/* Grille */}
      <section
        ref={sectionRef}
        className="relative z-10 mt-6 px-4 sm:px-6 lg:px-8 overflow-visible"
        style={availableHeight != null ? { height: availableHeight } : undefined}
      >
        <div className="relative mx-auto max-w-none h-full">
          <div
            ref={gridOuterRef}
            style={{ position: 'absolute', left: '50%', top: 0, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
          >
            <PartnersGrid items={partners} />
          </div>
        </div>
      </section>
    </div>
  );
}
