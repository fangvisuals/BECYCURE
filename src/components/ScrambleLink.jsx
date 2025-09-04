import React from "react";
import { Link } from "react-router-dom";

/**
 * ScrambleLink — lien avec effet "Matrix" au survol/focus
 *
 * Nouveautés vs version précédente:
 *  - textClassName: classes appliquées au <span> texte (permet le dégradé)
 *  - iconClassName: classes appliquées à l'icône/logo (ex: scale au hover)
 *
 * Props principales:
 *  - to: string (route)
 *  - label: string (texte du lien)
 *  - icon?: ReactNode (ex: <LogoBecycure />)
 *  - className?: string (classes du Link)
 *  - textClassName?: string (classes du <span> texte interne)
 *  - iconClassName?: string (classes du wrapper icon)
 *  - duration?: number (ms)
 *  - cyclesPerLetter?: number
 *  - shuffleMs?: number (cadence de grésillement)
 *  - chars?: string (alphabet utilisé pour le scramble)
 *  - monoDuringScramble?: boolean (police mono pendant l'effet)
 *  - respectMotion?: boolean (prefers-reduced-motion)
 *  - reserveWidth?: boolean (anti-CLS)
 */
const DEFAULT_CHARS = "!@#$%^&*()_+-={}[]|;:<>,.?/\\~";
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

export function ScrambleLink({
  to,
  label,
  icon = null,
  className = "",
  textClassName = "",
  iconClassName = "",
  duration = 800,
  cyclesPerLetter = 6,
  shuffleMs = 70,
  chars = DEFAULT_CHARS,
  monoDuringScramble = false,
  respectMotion = true,
  reserveWidth = true,
  ...rest
}) {
  const target = String(label ?? "");

  const [text, setText] = React.useState(target);
  const [scrambling, setScrambling] = React.useState(false);

  const rafRef = React.useRef(0);
  const startRef = React.useRef(0);

  // cadenceur + buffer
  const lastShuffleRef = React.useRef(0);
  const scrambleBufRef = React.useRef([]);
  const prevRevealRef = React.useRef(-1);

  const prefersReduced =
    respectMotion &&
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stop = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setScrambling(false);
    setText(target);
    scrambleBufRef.current = [];
    prevRevealRef.current = -1;
  }, [target]);

  const run = React.useCallback(() => {
    if (!target || prefersReduced) return;
    setScrambling(true);
    startRef.current = performance.now();
    lastShuffleRef.current = 0;
    scrambleBufRef.current = new Array(target.length);
    prevRevealRef.current = -1;

    const maxTicks = Math.max(1, target.length * cyclesPerLetter);

    const tick = (now) => {
      const t = clamp((now - startRef.current) / duration, 0, 1);
      const pos = Math.floor(t * maxTicks);
      const revealCount = Math.floor(pos / cyclesPerLetter);

      const shouldShuffle =
        lastShuffleRef.current === 0 || now - lastShuffleRef.current >= shuffleMs;
      if (shouldShuffle) lastShuffleRef.current = now;

      const out = new Array(target.length);

      for (let i = 0; i < target.length; i++) {
        if (i < revealCount) {
          out[i] = target[i];
        } else {
          if (shouldShuffle || !scrambleBufRef.current[i]) {
            const r = Math.floor(Math.random() * chars.length);
            scrambleBufRef.current[i] = chars[r] || target[i];
          }
          out[i] = scrambleBufRef.current[i];
        }
      }

      if (shouldShuffle || revealCount !== prevRevealRef.current) {
        setText(out.join(""));
        prevRevealRef.current = revealCount;
      }

      if (t >= 1) {
        stop();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [target, duration, cyclesPerLetter, shuffleMs, chars, prefersReduced, stop]);

  React.useEffect(() => () => stop(), [stop]);

  const minWidthCh = Math.max(1, target.length);

  return (
    <Link
      to={to}
      className={`${className} ${scrambling && monoDuringScramble ? "font-mono" : ""}`}
      onPointerEnter={run}
      onPointerLeave={stop}
      onFocus={run}
      onBlur={stop}
      {...rest}
    >
      {icon ? <span className={iconClassName}>{icon}</span> : null}
      <span
        className={`${icon ? "ml-2" : ""} ${textClassName}`}
        style={reserveWidth ? { display: "inline-block", minWidth: `${minWidthCh}ch` } : undefined}
        aria-label={target}
      >
        {text}
      </span>
    </Link>
  );
}

/**
 * BrandLink — header fixe avec logo + texte BECYCURE en dégradé, effet scramble au hover.
 */
export default function BrandLink() {
  
   const BASE = import.meta.env.BASE_URL || "/";
   const logoUrl = `${BASE}logo-nav.svg`;

  return (
    <header className="fixed top-0 left-0 p-8 z-20">
      <ScrambleLink
        to="/"
        label="BECYCURE"
        icon={<img className="h-8 w-8" src={logoUrl} alt="BECYCURE" />}
        className="inline-flex items-center select-none group"
        iconClassName="text-green-400 transition-transform duration-500 group-hover:rotate-[360deg]"
        textClassName="font-inter font-bold text-xl bg-gradient-to-t from-green-400 to-green-600 text-transparent bg-clip-text bg-[length:100%_200%] bg-bottom transition-all duration-200 group-hover:bg-top"
        duration={1200}
        cyclesPerLetter={8}
        shuffleMs={70}
        respectMotion={false}
        monoDuringScramble={false}
        reserveWidth={true}
        aria-label="Aller à l’accueil BECYCURE"
      />
    </header>
  );
}
