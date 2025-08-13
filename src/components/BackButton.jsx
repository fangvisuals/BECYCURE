import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * BackButton — style minimaliste (comme l'exemple), compatible Vite + React Router
 *
 * Apparaît idéalement AU‑DESSUS des <h1> de vos pages.
 *
 * Props:
 *  - to?: chemin cible fixe (ex: "/services"). Si absent, navigate(-1), sinon fallback "/".
 *  - title?: titre/tooltip. Défaut: "Go Back".
 *  - size?: taille du SVG en pixels. Défaut: 50.
 *  - strokeClass?: classes tailwind appliquées au trait du SVG (ex: "stroke-blue-300").
 *  - className?: classes utilitaires supplémentaires pour le <button>.
 *  - withNavWrapper?: envelopper dans <nav> (a11y). Défaut: true.
 */
export default function BackButton({
  to,
  title = "Go Back",
  size = 30,
  strokeClass = "stroke-green-300",
  className = "",
  withNavWrapper = true,
}) {
  const navigate = useNavigate();

  const onClick = React.useCallback(
    (e) => {
      e.preventDefault();
      if (to) {
        navigate(to);
        return;
      }
      if (typeof window !== "undefined" && window.history && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    },
    [to, navigate]
  );

  const Button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={
        // Style demandé : curseur, animation scale au hover et active
        "cursor-pointer duration-200 hover:scale-125 active:scale-100 " +
        // Accessibilité : focus visible
        "focus:outline-none" +
        className
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={strokeClass}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M11 6L5 12M5 12L11 18M5 12H19"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  if (!withNavWrapper) return Button;

  return (
    <nav aria-label="Navigation locale" className="mb-2">
      {Button}
    </nav>
  );
}
