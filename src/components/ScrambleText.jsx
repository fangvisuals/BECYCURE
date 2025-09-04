import React from "react";

const DEFAULT_CHARS = "!@#$%^&*()_+-={}[]|;:<>,.?/\\~";
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/**
 * ScrambleText — effet “Matrix”
 *
 * Props:
 *  - text: string (obligatoire)
 *  - trigger: "hover" | "mount" | "view" (défaut: "view")
 *  - duration: ms (défaut: 800) → durée du déroulé global (gauche→droite)
 *  - chars: alphabet aléatoire
 *  - cyclesPerLetter: nb de cycles par lettre avant de se figer (défaut: 2)
 *  - shuffleMs: délai entre 2 tirages aléatoires (défaut: 70 ms) ← ralentit le grésillement
 *  - className: classes tailwind
 *  - monoDuringScramble: applique font-mono pendant l’effet (limite la CLS)
 *  - respectMotion: si false, ignore prefers-reduced-motion (défaut: true)
 *  - as: tag HTML/React (défaut: "span")
 */
export default function ScrambleText({
  text,
  trigger = "mount",
  duration = 150,
  chars = DEFAULT_CHARS,
  cyclesPerLetter = 2,
  shuffleMs = 70,                 
  className = "",
  monoDuringScramble = false,
  respectMotion = true,
  reserveWidth = true, 
  as: Tag = "span",
  ...rest
}) {
  const target = React.useMemo(() => String(text ?? ""), [text]);

  const [display, setDisplay] = React.useState(target);
  const [scrambling, setScrambling] = React.useState(false);

  const rafRef = React.useRef(0);
  const startRef = React.useRef(0);
  const elRef = React.useRef(null);

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

      // Ne reshuffle qu'à intervalle régulier
      const shouldShuffle = lastShuffleRef.current === 0 || (now - lastShuffleRef.current) >= shuffleMs;
      if (shouldShuffle) lastShuffleRef.current = now;

      const out = new Array(target.length);

      for (let i = 0; i < target.length; i++) {
        if (i < revealCount) {
          out[i] = target[i]; // lettre figée
        } else {
          if (shouldShuffle || !scrambleBufRef.current[i]) {
            const r = Math.floor(Math.random() * chars.length);
            scrambleBufRef.current[i] = chars[r] || target[i];
          }
          out[i] = scrambleBufRef.current[i];
        }
      }

      // Met à jour l'affichage seulement si nécessaire (moins de re-renders)
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
  }, [target, duration, chars, cyclesPerLetter, shuffleMs, prefersReduced, stop]);

  // trigger: mount
  React.useEffect(() => {
    if (trigger === "mount") run();
    return () => stop();
  }, [trigger, run, stop]);

  // trigger: view
  React.useEffect(() => {
    if (trigger !== "view" || prefersReduced) return;
    const el = elRef.current;
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
  }, [trigger, run, prefersReduced]);

  const onEnter =
    trigger === "hover"
      ? () => { run(); }
      : undefined;
  const onLeave = trigger === "hover" ? stop : undefined;

  // largeur réservée pour éviter micro-CLS
  const minWidthCh = React.useMemo(() => Math.max(1, target.length), [target]);

  return (
    <Tag
      ref={elRef}
      className={`${className} ${scrambling && monoDuringScramble ? "font-mono" : ""}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={target}
      role="text"
      style={
        reserveWidth
          ? { display: "inline-block", minWidth: `${minWidthCh}ch` }
          : undefined
      }
      {...rest}
    >
      {display}
    </Tag>
  );
}
