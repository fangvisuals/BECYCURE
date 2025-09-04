// src/components/Panel.jsx
import React from "react";

/**
 * Panel — conteneur “glass” (fond noir translucide + blur + arrondis)
 *
 * Par défaut :
 *  - Fond sombre translucide + flou système
 *  - Arrondis et liseré subtil
 *  - Padding responsive : p-4 (mobile) → sm:p-6 → md:p-8
 *
 * Props:
 *  - as:         tag HTML (ex: "section", "div"). Défaut "section"
 *  - className:  classes utilitaires additionnelles
 *  - padding:    classes d’espacement (défaut "p-4 sm:p-6 md:p-8")
 *  - rounded:    rayon des coins (défaut "rounded-xl sm:rounded-2xl")
 *  - blur:       intensité du flou (défaut "backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-sm")
 *  - bg:         couleur de fond (défaut "bg-black/25")
 *  - border:     liseré subtil (défaut "ring-1 ring-white/10")
 *  - shadow:     ombre douce (défaut "shadow-[0_0_40px_-12px_rgba(0,0,0,0.6)]")
 *  - hover:      ajoute un léger effet au survol (défaut false)
 *  - divide:     insère un séparateur horizontal entre enfants (défaut false)
 *
 * Conseil : gérez la largeur et les marges au niveau du parent (container/page),
 * ex. <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8"> <Panel>…</Panel> </div>
 */
export default function Panel({
  as: Tag = "section",
  className = "",
  children,
  padding = "p-4 sm:p-6 md:p-8",
  rounded = "rounded-xl sm:rounded-2xl",
  blur = "backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-sm",
  bg = "bg-black/25",
  border = "ring-1 ring-white/10",
  shadow = "shadow-[0_0_40px_-12px_rgba(0,0,0,0.6)]",
  hover = false,
  divide = false,
  ...rest
}) {
  return (
    <Tag
      className={[
        "pointer-events-auto transition-shadow",
        rounded,
        blur,
        bg,
        border,
        shadow,
        padding,
        hover ? "hover:ring-white/20 hover:shadow-[0_0_80px_-16px_rgba(0,0,0,0.72)]" : "",
        divide ? "divide-y divide-white/10" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
