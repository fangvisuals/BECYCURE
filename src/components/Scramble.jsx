import React from "react";
import { Link } from "react-router-dom";

const DEFAULT_CHARS = "!@#$%^&*()_+-={}[]|;:<>,.?/\\~";
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

export default function Scramble({
  text,
  label,
  to,
  href,
  as: Tag = "span",
  icon = null,
  className = "",

  trigger,
  duration = 800,
  cyclesPerLetter = 6,
  shuffleMs = 70,
  chars = DEFAULT_CHARS,
  respectMotion = true,
  monoDuringScramble = false,
  reserveWidth = true,
  delay = 0,
  alsoOnHover = false,
  initialBlank = false,

  newTab = true,

  ...rest
}) {
  const targetRaw = text ?? label ?? "";
  const target = React.useMemo(() => String(targetRaw), [targetRaw]);

  const isInternal = Boolean(to);
  const isExternal = !isInternal && Boolean(href);
  const Elem = isInternal ? Link : isExternal ? "a" : Tag;

  const triggerFinal = trigger ?? (isInternal || isExternal ? "hover" : "view");

  const [display, setDisplay] = React.useState(initialBlank ? "" : target);
  const [scrambling, setScrambling] = React.useState(false);
  const [hasRun, setHasRun] = React.useState(false);

  const delayRef = React.useRef(0);
  const intervalRef = React.useRef(0);
  const failSafeRef = React.useRef(0);
  const rootRef = React.useRef(null);
  const bufferRef = React.useRef([]);
  const lastShuffleRef = React.useRef(0);

  const prefersReduced =
    respectMotion &&
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cancelTimers = React.useCallback(() => {
    if (delayRef.current) {
      window.clearTimeout(delayRef.current);
      delayRef.current = 0;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
    if (failSafeRef.current) {
      window.clearTimeout(failSafeRef.current);
      failSafeRef.current = 0;
    }
  }, []);

  const stopScramble = React.useCallback(() => {
    cancelTimers();
    bufferRef.current = [];
    setScrambling(false);
    setDisplay(target);
  }, [cancelTimers, target]);

  const runScramble = React.useCallback(() => {
    if (!target || prefersReduced) {
      stopScramble();
      return;
    }

    cancelTimers();

    const charsArray = target.split("");
    bufferRef.current = new Array(charsArray.length).fill(" ");

    const produceOutput = (revealCount, shuffle) => {
      const buffer = bufferRef.current;
      const output = new Array(charsArray.length);
      for (let i = 0; i < charsArray.length; i++) {
        if (i < revealCount) {
          buffer[i] = charsArray[i];
        } else if (shuffle || !buffer[i] || buffer[i] === " ") {
          const randomIndex = Math.floor(Math.random() * chars.length);
          buffer[i] = chars[randomIndex] || charsArray[i];
        }
        output[i] = buffer[i];
      }
      return output.join("");
    };

    const intervalDelay = Math.max(16, shuffleMs || 0);
    const totalDuration = duration > 0 ? duration : intervalDelay;
    const totalCycles = Math.max(1, Math.floor((cyclesPerLetter || 1) * charsArray.length));

    setScrambling(true);
    setDisplay(produceOutput(0, true));

    const startTime = performance.now();
    lastShuffleRef.current = startTime;
    let iteration = 0;

    const tick = () => {
      iteration += 1;
      const now = performance.now();
      const timeProgress = totalDuration > 0 ? clamp((now - startTime) / totalDuration, 0, 1) : 1;
      const cycleProgress = clamp(iteration / totalCycles, 0, 1);
      const progress = Math.max(timeProgress, cycleProgress);
      const revealCount = Math.floor(progress * charsArray.length);
      const shouldShuffle = shuffleMs <= 0 || now - lastShuffleRef.current >= shuffleMs;

      if (shouldShuffle) {
        lastShuffleRef.current = now;
      }

      setDisplay(produceOutput(revealCount, shouldShuffle));

      if (progress >= 1) {
        stopScramble();
      }
    };

    intervalRef.current = window.setInterval(tick, intervalDelay);
    failSafeRef.current = window.setTimeout(stopScramble, totalDuration + 500);
  }, [target, prefersReduced, cyclesPerLetter, duration, shuffleMs, chars, cancelTimers, stopScramble]);

  const scheduleRun = React.useCallback(() => {
    if (!target || prefersReduced) {
      setDisplay(target);
      return;
    }

    if (delay > 0) {
      delayRef.current = window.setTimeout(() => {
        delayRef.current = 0;
        setHasRun(true);
        runScramble();
      }, delay);
    } else {
      setHasRun(true);
      runScramble();
    }
  }, [delay, runScramble, target, prefersReduced]);

  React.useEffect(() => stopScramble, [stopScramble]);

  React.useEffect(() => {
    if (!scrambling) {
      if (!initialBlank || hasRun) setDisplay(target);
      else setDisplay("");
    }
  }, [target, scrambling, initialBlank, hasRun]);

  React.useEffect(() => {
    if (triggerFinal === "mount") scheduleRun();
  }, [triggerFinal, scheduleRun]);

  React.useEffect(() => {
    if (triggerFinal !== "view" || prefersReduced) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          scheduleRun();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerFinal, scheduleRun, prefersReduced]);


  const hoverEnabled = triggerFinal === "hover" || alsoOnHover === true;
  const onEnter = hoverEnabled ? scheduleRun : undefined;
  const onLeave = hoverEnabled ? stopScramble : undefined;

  const minWidthCh = React.useMemo(() => Math.max(1, target.length), [target]);

  const extAttrs = isExternal
    ? {
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : null;

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

export function ScrambleText(props) {
  const { label, text, as = "span", ...rest } = props;
  return <Scramble as={as} text={text ?? label} {...rest} />;
}

export function ScrambleLink(props) {
  const { to, label, text, ...rest } = props;
  return <Scramble to={to} text={text ?? label} {...rest} />;
}

export function ExternalScrambleLink(props) {
  const { href, label, text, ...rest } = props;
  return <Scramble href={href} text={text ?? label} {...rest} />;
}
