import React from "react";

function PartnerCard({ name, logo, url, blurb, placeholder = false }) {
  if (placeholder) {
    return (
      <div
        className="relative aspect-square rounded-2xl bg-white/5 ring-1 ring-white/10
                   flex items-center justify-center p-6 md:p-8"
        aria-label="Nouveau partenaire à venir"
      >
        <div className="text-center text-sm md:text-base text-white/60 font-inter">
          Nouveau partenaire à venir
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-2xl
                 ring-1 ring-green-300/20 backdrop-blur-[3px]
                 p-6 md:p-8 transition-transform duration-300 hover:scale-[1.08]
                 focus:outline-none focus-visible:ring-3 focus-visible:ring-sky-300"

    >
      <img
        src={logo}
        alt={name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 m-auto max-w-[80%] max-h-[80%] object-contain
                   transition-opacity duration-300 group-hover:opacity-10"
      />

      <div
        className="absolute inset-0
                   flex flex-col items-center justify-center text-center text-white
                   px-4 sm:px-6 opacity-0 group-hover:opacity-95
                   transition-opacity duration-300 "
      >
        <h3 className="text-base sm:text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm sm:text-sm leading-relaxed text-white/90 max-w-[90%] mx-auto mb-2">
          {blurb}
        </p>
      </div>
    </a>
  );
}

export default function PartnersGrid({ items }) {
  return (
    <div
      className="
        mx-auto w-full
        max-w-[min(92vw,1400px)]
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        gap-4 sm:gap-6
      "
    >
      {items.map((p, i) => (
        <PartnerCard key={i} {...p} />
      ))}
    </div>
  );
}
