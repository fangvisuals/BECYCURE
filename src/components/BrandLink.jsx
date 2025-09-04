import React from "react";
import { Link } from "react-router-dom";
import ScrambleLink from "../components/ScrambleLink.jsx"

export default function BrandLink() {
  const BASE = import.meta.env.BASE_URL || "/";
  const logoUrl = `${BASE}logo-nav.svg`;        

  return (
    <header className="fixed top-0 left-0 p-8 z-20">
      <ScrambleLink
        to="/"
        as="span"
        text={"BECYCURE"}
        trigger="hover"
        duration={800}
        cyclesPerLetter={2}
        shuffleMs={30}
        respectMotion={false}
        >
        {/* Logo */}
        <img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          className="h-10 w-10 select-none pointer-events-none"
          decoding="async"
          loading="eager"
        />

        {/* Texte (ton dégradé vert existant) */}
          <span className="font-inter font-bold text-xl bg-gradient-to-t from-green-400 to-green-600 inline-block text-transparent bg-clip-text bg-[length:100%_200%] bg-bottom transition-all duration-200 group-hover:bg-top">
            BECYCURE
          </span>
        </ScrambleLink>
    </header>
  );
}
