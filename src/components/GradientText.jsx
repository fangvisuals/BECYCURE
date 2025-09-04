// src/components/GradientText.jsx
import React from "react";

/**
 * GradientText — texte avec dégradé animé (compatible avec Scramble).
 *
 * Utilisation (texte seul) :
 *   <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={6}>
 *     <ScrambleText text="HUMAINE" trigger="mount" />
 *   </GradientText>
 *
 * Utilisation (avec cadre animé) :
 *   <GradientText showBorder className="text-5xl font-bold">
 *     BECYCURE
 *   </GradientText>
 *
 * Props :
 *  - children: contenu (ex: <ScrambleText .../> ou du texte)
 *  - className: classes utilitaires (tailwind)
 *  - colors: tableau de couleurs du dégradé
 *  - animationSpeed: durée (s) d’un cycle de l’animation du dégradé
 *  - showBorder: si true, ajoute un “cadre” animé autour (optionnel)
 *  - as: tag à utiliser pour le conteneur quand showBorder=false (défaut: "span")
 */
export default function GradientText({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 8,
  showBorder = false,
  as: Tag = "span",
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animationDuration: `${animationSpeed}s`,
  };

  if (showBorder) {
    // Variante avec cadre animé (le texte reste en clip, aucun conflit avec Scramble)
    return (
      <span className={`relative inline-flex items-center justify-center ${className}`}>
        {/* Bande de bordure animée */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-[1.25rem] animate-gradient pointer-events-none"
          style={gradientStyle}
        />
        {/* Masque intérieur pour créer la bordure */}
        <span
          aria-hidden
          className="absolute inset-[1px] rounded-[1.15rem] bg-black"
          style={{ zIndex: 0 }}
        />
        {/* Le texte avec clip */}
        <span
          className="relative z-[1] inline-block text-transparent bg-clip-text animate-gradient"
          style={gradientStyle}
        >
          {children}
        </span>
      </span>
    );
  }

  // Variante simple : dégradé animé uniquement sur le texte
  return (
    <Tag
      className={`inline-block text-transparent bg-clip-text animate-gradient ${className}`}
      style={gradientStyle}
    >
      {children}
    </Tag>
  );
}
