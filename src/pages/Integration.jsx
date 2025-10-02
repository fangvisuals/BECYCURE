// src/pages/Integration.jsx

import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import GradientText from "../components/GradientText.jsx";
import { ScrambleText } from "../components/Scramble.jsx";
import Panel from "../components/Panel.jsx";
import SpotlightCard from "../components/SpotlightCard.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";
import SEO from "@/seo/SEO.jsx";

export default function Integration() {
  const navigate = useNavigate();
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const currentHashRef = useRef("");
  const BASE = import.meta.env.BASE_URL || "/";
  const experienceIcon = `${BASE}pictures/icons/experience.svg`;
  const expertiseIcon = `${BASE}pictures/icons/expertise.svg`;
  const delaiIcon = `${BASE}pictures/icons/delai.svg`;

  // Scroll vers la bonne section si l'URL contient une ancre
  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReduced ? 'auto' : 'smooth';

    const scrollToTop = (behavior = scrollBehavior) => {
      const mainEl = document.getElementById('app-main') || document.querySelector('main');
      const doScroll = () => {
        if (mainEl) {
          try { mainEl.scrollTo({ top: 0, behavior }); } catch {}
          mainEl.scrollTop = 0; // hard fallback
        }
        try { window.scrollTo({ top: 0, behavior }); } catch {}
      };
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          doScroll();
          setTimeout(doScroll, 50);
        });
      });
    };

    const scrollToEl = (el, behavior = scrollBehavior) => {
      if (!el) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior, block: 'start', inline: 'nearest' });
        });
      });
    };

    const hash = window.location.hash || '';
    if (hash.includes('#integration-2')) {
      scrollToEl(secondRef.current);
    } else if (hash.includes('#integration-1')) {
      scrollToTop('auto');
    }

    const onHash = () => {
      const h = window.location.hash || '';
      if (h.includes('#integration-2')) {
        scrollToEl(secondRef.current);
      } else if (h.includes('#integration-1')) {
        scrollToTop();
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="w-full min-h-screen text-white/80 py-10 px-4 sm:px-6 md:px-10 lg:px-24">
      <SEO
        title="Intégration — SOC, VOC, Bastion | BECYCURE"
        description="Intégration de solutions de cybersécurité: SIEM/SOAR, Bastion/PAM et VOC. Déploiement, cas d’usage, bonnes pratiques et performance opérationnelle."
        canonicalPath="/integration"
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
      <BackButton to={"/"} strokeClass="stroke-green-300" className="mb-4" />
      <h1 className="title text-[9.5vw] sm:text-6xl lg:text-7xl leading-[1.05] mb-8">
        <span className="block">
          <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
            <GradientText colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]} animationSpeed={3}>
              <ScrambleText
                as="span"
                text="/ INT&Eacute;GRATION"
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

      <div className="flex flex-col gap-10">
        {/* Section 1 (inchang&eacute;e) */}
        <section id="integration-1" ref={firstRef} className="w-full flex justify-start items-start h-[80vh] sm:h-[78vh] md:h-[72vh] lg:h-[68vh]">
          <Panel border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-xl md:max-w-2xl self-start">
            <div className="flex items-center gap-5 sm:gap-6 md:gap-8">
              <img
                src={experienceIcon}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 self-center"
                loading="lazy"
                decoding="async"
              />
              <p className="text-lg leading-relaxed text-gray-200">
                Avec plus de 25 ans d'exp&eacute;rience, <span className="font-bold font-inter">BECYCURE</span> d&eacute;ploie et int&egrave;gre des
                solutions de cybers&eacute;curit&eacute; innovantes en s'appuyant sur des <Link to="/partenariats" className="link">partenariats
                technologiques strat&eacute;giques</Link>.
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

        {/* Section 2 (structure Services: 3 cartes) */}
        <section id="integration-2" ref={secondRef} className="w-full flex justify-end items-start h-[80vh] sm:h-[78vh] md:h-[72vh] lg:h-[68vh]">
          <Panel border="ring-1 ring-green-500/20" padding="p-6 sm:p-8" className="w-full max-w-5xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight mb-4 sm:mb-6">
              D&eacute;couvrez nos int&eacute;grations cl&eacute;s
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <SpotlightCard
                title="SOC & SIEM"
                tagline="Collecte, corr&eacute;lation, alerting"
                description="Int&eacute;gration SIEM/SOAR, cas d'usage, tableaux de bord et MCO pour une d&eacute;tection efficace."
                ctaLabel="Lancer mon SOC"
                ctaTo="/contact"
              />
              <SpotlightCard
                title="Bastion & PAM"
                tagline="Contr&ocirc;le des acc&egrave;s privil&eacute;gi&eacute;s"
                description="D&eacute;ploiement du bastion, enregistrement des sessions, MFA et RBAC pour s&eacute;curiser les acc&egrave;s."
                ctaLabel="S&eacute;curiser les acc&egrave;s"
                ctaTo="/contact"
              />
              <SpotlightCard
                title="VOC & durcissement"
                tagline="Exposition, rem&eacute;diation, hygi&egrave;ne"
                description="Qualification des vuln&eacute;rabilit&eacute;s, rem&eacute;diations et durcissement syst&eacute;matique pour r&eacute;duire les risques."
                ctaLabel="Am&eacute;liorer mon hygi&egrave;ne"
                ctaTo="/contact"
              />
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
