import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CTAButton from "./CTAButton.jsx";

export default function SpotlightCard({
  title,
  tagline,
  description,
  ctaLabel = "En savoir plus",
  ctaLabelLines,
  ctaTo,
  ctaHref,
  onCtaClick,
  icon = null,
  className = "",
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
  };

  const spotlightStyle = {
    background: `radial-gradient(260px 260px at ${pos.x}px ${pos.y}px, rgba(64,255,170,0.10), rgba(64,255,170,0.05) 55%, rgba(64,255,170,0.0) 92%)`,
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={[
        "group relative overflow-hidden rounded-2xl h-full",
        "ring-1 ring-green-400/15 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md",
        "duration-300",
        className,
      ].join(" ")}
    >
      {/* Spotlight overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={spotlightStyle} />
      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 md:p-7 flex flex-col h-full">
        {icon && (
          <div className="mb-3 sm:mb-4 text-green-300">
            {icon}
          </div>
        )}
        {title && <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>}
        {tagline && (
          <p className="mt-1 text-base sm:text-lg font-medium text-green-300/90">{tagline}</p>
        )}
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-gray-300/90 flex-1">{description}</p>
        )}

        {/* CTA */}
        {(() => {
          const showCTA = Boolean(ctaLabel ?? (ctaTo || ctaHref || onCtaClick));
          if (!showCTA) return null;

          let content = ctaLabel;
          if (Array.isArray(ctaLabelLines) && ctaLabelLines.length) {
            content = (
              <span className="leading-tight text-left">
                {ctaLabelLines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                    {idx < ctaLabelLines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </span>
            );
          }

          return (
            <div className="mt-5 self-center">
              <CTAButton
                label={content || "En savoir plus"}
                to={ctaTo}
                href={ctaHref}
                onClick={onCtaClick}
                newTab={Boolean(ctaHref)}
               variant="card"/>
            </div>
          );
        })()}
      </div>
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
    </div>
  );
}



