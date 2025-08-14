import React from "react";
import { Link } from "react-router-dom";

export default function BrandLink() {
  return (
    <header className="fixed top-0 left-0 p-8 z-20" role="banner">
      <Link
        to="/"
        aria-label="Aller à l’accueil BECYCURE"
        className="flex items-center text-green-400 text-xl font-mono transition-colors hover:text-green-300"
      >
        <span className="mr-2 text-white"> /</span>
        <span className="font-inter font-bold bg-gradient-to-t from-green-400 to-green-600 inline-block text-transparent bg-clip-text bg-[length:100%_200%] bg-bottom transition-all duration-200 hover:bg-top">
          BECYCURE
        </span>
      </Link>
    </header>
  );
}
