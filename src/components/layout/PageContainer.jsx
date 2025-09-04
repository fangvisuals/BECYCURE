// src/components/PageContainer.jsx
import React from "react";

/**
 * PageContainer — conteneur principal responsive et configurable par page.
 *
 * Props :
 *  - as:        Tag HTML (default "main")
 *  - variant:   "narrow" | "default" | "wide" | "full"  (largeur max responsive)
 *  - pad:       "none" | "cozy" | "normal" | "roomy"    (padding responsive)
 *  - center:    boolean — centre verticalement le contenu (default false)
 *  - fullHeight:boolean — min-height: 100vh (default false)
 *  - className: string — classes additionnelles
 *
 * Tu peux override complètement via `maxClass` et/ou `padClass` si besoin.
 */
export default function PageContainer({
  as: Tag = "main",
  children,
  className = "",
  variant = "default",
  pad = "normal",
  center = false,
  fullHeight = false,
  maxClass,
  padClass,
  ...rest
}) {
  // Largeurs max responsive (mobile → desktop)
  const maxPresets = {
    narrow:
      // mobile 92vw → sm 640 → md 760 → lg 900
      "max-w-[92vw] sm:max-w-[640px] md:max-w-[760px] lg:max-w-[900px]",
    default:
      // mobile 92vw → sm 720 → md 840 → lg 1024 → xl 1200
      "max-w-[92vw] sm:max-w-[720px] md:max-w-[840px] lg:max-w-[1024px] xl:max-w-[1200px]",
    wide:
      // mobile 92vw → sm 840 → md 1080 → lg 1200 → xl 1400
      "max-w-[92vw] sm:max-w-[840px] md:max-w-[1080px] lg:max-w-[1200px] xl:max-w-[1400px]",
    full:
      // proche plein écran avec petites marges
      "max-w-[96vw] sm:max-w-[96vw] md:max-w-[96vw] lg:max-w-[96vw]",
  };

  // Padding responsive
  const padPresets = {
    none:  "px-0  sm:px-0  md:px-0   py-0",
    cozy:  "px-4  sm:px-5  md:px-6   py-6 sm:py-8",
    normal:"px-4  sm:px-6  md:px-8   py-8 sm:py-10",
    roomy: "px-5  sm:px-7  md:px-10  py-10 sm:py-12",
  };

  const maxClasses = maxClass ?? maxPresets[variant] ?? maxPresets.default;
  const padClasses = padClass ?? padPresets[pad] ?? padPresets.normal;

  // Alignement vertical optionnel
  const vertical = center ? "min-h-screen flex items-center" : "";
  const height   = fullHeight ? "min-h-screen" : "";

  return (
    <Tag
      className={[
        "w-full mx-auto",      // centre horizontalement
        maxClasses,            // largeurs max selon preset
        padClasses,            // padding responsive
        vertical,              // éventuel centrage vertical
        height,                // éventuelle hauteur pleine
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
