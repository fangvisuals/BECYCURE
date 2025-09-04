import React from "react";
import { Link } from "react-router-dom";

// Alphabet par défaut pour le grésillement
const DEFAULT_CHARS = "!@#$%^&*()_+-={}[]|;:<>,.?/\\~";
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/**
 * Scramble — composant unifié (texte ou lien interne/externe) avec effet "Matrix".
 *
 * Utilisation :
 *  - Texte : <Scramble text="HUMAINE" as="span" trigger="view" />
 *  - Lien interne : <Scramble to="/services" text="/SERVICES" />
 *  - Lien externe : <Scramble href="https://…" text="/LINKEDIN" newTab />
 *
 * Props principales :
 *  - text / label : contenu cible (string). "label" est alias de "text".
 *  - to / href : route interne (react-router) ou URL externe. Si aucun, rend <Tag>.
 *  - as : tag HTML/React pour le mode texte (défaut : "span"). Ignoré si to/href.
 *  - icon : ReactNode optionnel, affiché avant le texte.
 *  - className : classes appliquées à l'élément conteneur (Link/<a>/<span>).
 *
 * Effet (contrôles) :
 *  - trigger : "hover" | "mount" | "view" (défaut : hover pour liens, view pour texte)
 *  - duration : ms du déroulé global (défaut 800)
 *  - cyclesPerLetter : nb de cycles par lettre avant figeage (défaut 6)
 *  - shuffleMs : cadence de grésillement (défaut 70ms)
 *  - chars : alphabet aléatoire (défaut DEFAULT_CHARS)
 *  - respectMotion : respecte prefers-reduced-motion (défaut true)
 *  - monoDuringScramble : applique font-mono pendant l'effet (défaut false)
 *  - reserveWidth : réserve la largeur (anti-CLS) via min-width: Nch (défaut true)
 *  - newTab : pour href seulement, ouvre dans un nouvel onglet (défaut true)
 */
export default function Scramble({
  // contenu & rendu
  text,
  label,
  to,
  href,
  as: Tag = "span",
  icon = null,
  className = "",

  // effet
  trigger, // par défaut dépend du type (voir plus bas)
  duration = 800,
  cyclesPerLetter = 6,
  shuffleMs = 70,
  chars = DEFAULT_CHARS,
  respectMotion = true,
  monoDuringScramble = false,
  reserveWidth = true,

  // externes
  newTab = true,

  // reste
  ...rest
}) {
  const targetRaw = text ?? label ?? "";
  const target = React.useMemo(() => String(targetRaw), [targetRaw]);

  // Élément à rendre : Link / <a> / Tag
  const isInternal = Boolean(to);
  const isExternal = !isInternal && Boolean(href);
  const Elem = isInternal ? Link : isExternal ? "a" : Tag;

  // Déterminer le trigger par défaut si non fourni : hover pour liens, view pour texte
  const triggerFinal = trigger ?? (isInternal || isExternal ? "hover" : "view");

  const [display, setDisplay] = React.useState(target);
  const [scrambling, setScrambling] = React.useState(false);

  const rafRef = React.useRef(0);
  const startRef = React.useRef(0);
  const rootRef = React.useRef(null);

  // cadenceur + buffer + suivi des lettres révélées
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
    setDisplay(target);
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
        setDisplay(out.join(""));
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

  // Cleanup on unmount
  React.useEffect(() => () => stop(), [stop]);

  // trigger: mount
  React.useEffect(() => {
    if (triggerFinal === "mount") run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFinal, run]);

  // trigger: view (IntersectionObserver)
  React.useEffect(() => {
    if (triggerFinal !== "view" || prefersReduced) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerFinal, run, prefersReduced]);

  const onEnter = triggerFinal === "hover" ? run : undefined;
  const onLeave = triggerFinal === "hover" ? stop : undefined;

  const minWidthCh = React.useMemo(() => Math.max(1, target.length), [target]);

  // Attributs spécifiques aux liens externes
  const extAttrs = isExternal
    ? {
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : null;

  // NB: on place le texte dans un <span> pour pouvoir contrôler min-width
  // tout en laissant les classes (ex: gradient-text) sur le conteneur.
  return (
    <Elem
      ref={rootRef}
      to={isInternal ? to : undefined}
      href={isExternal ? href : undefined}
      className={`${className} ${scrambling && monoDuringScramble ? "font-mono" : ""}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={target}
      role={!isInternal && !isExternal ? "text" : undefined}
      {...extAttrs}
      {...rest}
    >
      {icon}
      <span
        className={icon ? "ml-1" : undefined}
        style={
          reserveWidth
            ? { display: "inline-block", minWidth: `${minWidthCh}ch` }
            : undefined
        }
      >
        {display}
      </span>
    </Elem>
  );
}

// ————————————————————————————————————————————
// Exports de commodité (API compatible avec tes anciens composants)
// ————————————————————————————————————————————

export function ScrambleText(props) {
  // Texte pur : forcer <span>, pas de to/href
  const { label, text, as = "span", ...rest } = props;
  return <Scramble as={as} text={text ?? label} {...rest} />;
}

export function ScrambleLink(props) {
  // Lien interne (react-router)
  const { to, label, text, ...rest } = props;
  return <Scramble to={to} text={text ?? label} {...rest} />;
}

export function ExternalScrambleLink(props) {
  // Lien externe (<a>)
  const { href, label, text, ...rest } = props;
  return <Scramble href={href} text={text ?? label} {...rest} />;
}
