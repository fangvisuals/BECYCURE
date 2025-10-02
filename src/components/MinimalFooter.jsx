import React from "react";
import { Link } from "react-router-dom";

// Very small, subtle fixed footer (transparent, white low opacity)
export default function MinimalFooter() {
  return (
    <footer
      className="fixed bottom-3 right-4 z-20 text-[11px] sm:text-xs text-white/50 hover:text-white/70 transition-colors"
      aria-label="Site footer"
    >
      <div className="flex items-center gap-2 bg-transparent">
        <span className="whitespace-nowrap">© BECYCURE - 2025</span>
        <span className="opacity-40">•</span>
        <Link
          to="/politique-de-confidentialite"
          className="underline-offset-2 hover:underline"
        >
          Politique de confidentialité
        </Link>
        <span className="opacity-40">•</span>
        <Link
          to="/mentions-legales"
          className="underline-offset-2 hover:underline"
        >
          Mentions légales
        </Link>
      </div>
    </footer>
  );
}

