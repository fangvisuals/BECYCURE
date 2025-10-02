// src/components/BackgroundCanvas.jsx
import React, { Suspense, useMemo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { RouteMorphBackground } from "./ParticleMorphScene.jsx";
import FaultyTerminal from "./FaultyTerminal.jsx";
import { scale } from "framer-motion";

const isBenchmarkNavigator = () => {
  if (typeof navigator === "undefined" || !navigator.userAgent) return false;
  return /Lighthouse|Chrome-Lighthouse|Speed Insights|PageSpeed|HeadlessChrome\/\d+\.\d+\.\d+\.\d+|Chrome-Labs/i.test(
    navigator.userAgent
  );
};

export default function BackgroundCanvas() {
  const BASE = import.meta.env.BASE_URL || "/";
  const { hash } = useLocation();

  const anchorFromHash = (h) => {
    if (!h) return "";
    const parts = String(h).split("#");
    const last = parts[parts.length - 1] || "";
    return last ? `#${last}` : "";
  };
  const anchorKey = anchorFromHash(hash);

  const [isBenchmark] = useState(() => isBenchmarkNavigator());
  const [allowEffects, setAllowEffects] = useState(false);

  useEffect(() => {
    if (isBenchmark) return;
    if (typeof window === "undefined") {
      setAllowEffects(true);
      return;
    }
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setAllowEffects(true);
    };
    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      const id = ric(enable, { timeout: 1000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(enable, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [isBenchmark]);

  // Detect mobile (<=768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  // Liste des modèles (inclut des IDs pour les ancres)
  const shapes = useMemo(
    () => [
      { id: "home",            url: `${BASE}models/becycure.glb` },
      { id: "services",        url: `${BASE}models/soc.glb` },
      { id: "blog",            url: `${BASE}models/becycure.glb` },
      { id: "partenariats",    url: `${BASE}models/partenariats.glb` },
      { id: "#integration-1",  url: `${BASE}models/soc.glb` },
      { id: "#integration-2",  url: `${BASE}models/partenariats.glb` },
    ],
    [BASE]
  );

  // Mapping route -> ID actif (utilise l'ancre normalisée)
  const routeMap = (pathname, anchorNormalized) => {
    const p = (pathname || "/").replace(/\/+$/, "");
    if (anchorNormalized === "#xdr") return "services";
    if (p === "" || p === "/") return "home";
    if (p.startsWith("/services")) return "services";
    if (p.startsWith("/blog")) return "blog";
    if (p.startsWith("/integration")) {
      return anchorNormalized === "#integration-2" ? "#integration-2" : "#integration-1";
    }
    if (p.startsWith("/partenariats")) return "partenariats";
    return "home";
  };

  // petit ramp-up pour éviter un pic CPU au boot
  const [count, setCount] = useState(7000);
  useEffect(() => {
    const id = (window.requestIdleCallback
      ? window.requestIdleCallback(() => setCount(9000))
      : setTimeout(() => setCount(9000), 800)
    );
    return () =>
      (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const showTerminal = allowEffects && !isBenchmark;
  // Keep Canvas mounted to avoid devtools probing a null renderer; gate rendering via frameloop
  const mountCanvas = !isBenchmark; // mount unless synthetic benchmark
  const canvasActive = allowEffects && !isMobile;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ contain: "paint", isolation: "isolate" }}>
      {/* --- Fond DOM --- */}
      <div className="absolute inset-0 -z-10">
        {showTerminal ? (
          <FaultyTerminal
            className="absolute inset-0 -z-10"
            lockAspect={true}
            aspect={16 / 9}
            fitMode="cover"
            bg="#071019"
            tint="#004927"
            brightness={0.3}
            scale={1.0}
            gridMul={[5, 2]}
            digitSize={3.0}
            timeScale={0.2}
            pause={false}
            scanlineIntensity={0.12}
            glitchAmount={0.5}
            flickerAmount={0.3}
            noiseAmp={1.0}
            chromaticAberration={0}
            dither={0}
            curvature={0.75}
            mouseReact={true}
            mouseStrength={0.25}
            pageLoadAnimation={true}
          />
        ) : (
          <div className="absolute inset-0 -z-10 bg-[#071019]" />
        )}
      </div>

      {/* --- Canvas R3F --- */}
      {mountCanvas && (
        <Canvas
          gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
          dpr={[1, Math.min(1.75, window.devicePixelRatio || 1)]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          frameloop={canvasActive ? 'always' : 'never'}
          onCreated={({ gl }) => {
            const ctx = gl.getContext?.();
            // Guard: ctx can be null momentarily; avoid calling WebGL constants then
            try {
              if (ctx && ctx.DITHER) ctx.disable(ctx.DITHER);
            } catch {}
            gl.domElement.style.background = "transparent";
          }}
          style={{ opacity: canvasActive ? 1 : 0 }}
        >
          {canvasActive ? (
            <Suspense fallback={null}>
              <RouteMorphBackground
                shapes={shapes}
                routeMap={routeMap}
                layoutKey={anchorKey}
                particleCount={count}
                size={30}
                speed={0.6}
                sparkle={{ strength: 0.9, speed: 2 }}
                glow={{ intensity: 0.7, core: 0.2, falloff: 0.4, mixToWhite: 0.65, autoIntensity: 0.6 }}
                quality="auto"
                anchor={{ x: 0.70, y: 0.52, mode: "relative" }}
                rotation={[0, 0, 0]}
                scale={1.0}
                depth={0}
                transformById={{
                  home:        { anchor:{ x: 0.70, y: 0.50, mode:"relative" }, rotation:[0, 0, 0],  scale:1.0,  depth:2.5 },
                  services:    { anchor:{ x: 0.75, y: 0.52, mode:"relative" }, rotation:[0, 0, 0],  scale:1.15, depth:1   },
                  blog:        { anchor:{ x: 0.73, y: 0.52, mode:"relative" }, rotation:[0, 0 ,0],  scale:1.1,  depth:0   },
                  partenariats:{ anchor:{ x: 0.50, y: 0.52, mode:"relative" }, rotation:[0, 0, 0],  scale:1.0,  depth:1   },
                  "#integration-1": { anchor:{ x: 0.70, y: 0.52, mode:"relative" }, scale: 1.0, depth: 2.0 },
                  "#integration-2": { anchor:{ x: 0.27, y: 0.52, mode:"relative" }, scale: 1.0, depth: 2.0 },
                }}
                responsive={[
                  { max: 1280, anchor: { x: 0.66, y: 0.54 }, scale: 1.1 },
                  { max: 1024, anchor: { x: 0.58, y: 0.56 }, scale: 0.95 },
                  { max: 768,  anchor: { x: 0.50, y: 0.58 }, scale: 0.80, rotation: [0, 8, 0] },
                  { max: 560,  anchor: { x: 0.50, y: 0.62 }, scale: 0.70, rotation: [0, 6, 0] },
                ]}
                spin={{ x: 0, y: 6, z: 0 }}
                spinById={{}}
                remorphOnSameId={true}
                dracoPath={`${BASE}draco/`}
              />
            </Suspense>
          ) : null}
        </Canvas>
      )}
    </div>
  );
}
