// src/components/BackgroundCanvas.jsx
import React, { Suspense, useMemo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RouteMorphBackground } from "./ParticleMorphScene.jsx";
import FaultyTerminal from "./FaultyTerminal.jsx";

export default function BackgroundCanvas() {
  const BASE = import.meta.env.BASE_URL || "/";

  // ——— Detect mobile (<=768px) ———
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  // NOMS DE FICHIERS RÉELS
  const shapes = useMemo(
    () => [
      { id: "home",         url: `${BASE}models/becycure.glb` },
      { id: "services",     url: `${BASE}models/soc.glb` },
      { id: "blog",         url: `${BASE}models/becycure.glb` },
      { id: "partenariats", url: `${BASE}models/partenariats.glb` },
    ],
    [BASE]
  );

  // HashRouter: pathname est la partie après "#/"
  const routeMap = (pathname, hash) => {
    const p = (pathname || "/").replace(/\/+$/, "");
    if (hash === "#xdr") return "services";
    if (p === "" || p === "/") return "home";
    if (p.startsWith("/services")) return "services";
    if (p.startsWith("/blog")) return "blog";
    if (p.startsWith("/integration")) return "home";
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

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "paint", isolation: "isolate" }}
    >
      {/* --- Fond DOM derrière (toujours visible, y compris mobile) --- */}
      <div className="absolute inset-0 -z-10">
        {/* --- Fond DOM derrière le Canvas R3F --- */}
        <FaultyTerminal
          className="absolute inset-0 -z-10"

        /* —— Ratio & fitting —— */
          lockAspect={true}        // verrouille le ratio du rendu
          aspect={16 / 9}          // ratio cible si lockAspect = true
          fitMode="cover"          // "cover" | "contain" | "stretch"

        /* —— Couleurs —— */
          bg="#071019"             // couleur de fond (zones « noires »)
          tint="#0ea15e"           // teinte des digits/effects
          brightness={0.5}         // gain global (multiplie le rendu)

        /* —— Look & animation —— */
          scale={2.0}              // échelle du motif global
          gridMul={[5, 2]}         // densité de la grille (x, y)
          digitSize={3.0}          // taille des « digits »
          timeScale={0.35}         // vitesse d’animation
          pause={false}            // fige le temps si true
          scanlineIntensity={0.12} // scanlines CRT
          glitchAmount={0.5}       // intensité du « glitch » horizontal
          flickerAmount={0.3}      // micro-flicker d’intensité
          noiseAmp={1.0}           // bruit du motif (FBM)
          chromaticAberration={0}  // aberration chromatique (0 = off)
          dither={0}               // dithering (0…1)
          curvature={0.15}         // courbure CRT (0 = plat)

        /* —— Interaction souris —— */
          mouseReact={true}
          mouseStrength={0.25}

        /* —— Page load anim —— */
          pageLoadAnimation={true}

        /* —— Perf (souvent inutile à override) —— */
          // dpr={Math.min(window.devicePixelRatio || 1, 2)} // géré en interne
        />


      </div>

      {/* --- Canvas R3F (désactivé sur mobile) --- */}
      {!isMobile && (
        <Canvas
          gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
          dpr={[1, Math.min(1.75, window.devicePixelRatio || 1)]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          onCreated={({ gl }) => {
            const ctx = gl.getContext?.();
            if (ctx && ctx.DITHER) ctx.disable(ctx.DITHER);
            gl.domElement.style.background = "transparent";
          }}
        >
          <Suspense fallback={null}>
            <RouteMorphBackground
              shapes={shapes}
              routeMap={routeMap}

              /* visuel et perfs */
              particleCount={count}
              size={30}
              speed={0.6}
              sparkle={{ strength: 0.9, speed: 2 }}
              glow={{ intensity: 0.7, core: 0.2, falloff: 0.4, mixToWhite: 0.65, autoIntensity: 0.6 }}
              quality="auto"

              /* pose par défaut */
              anchor={{ x: 0.70, y: 0.52, mode: "relative" }}
              rotation={[0, 0, 0]}
              scale={1.0}
              depth={0}

              /* poses par page */
              transformById={{
                home:        { anchor:{ x: 0.70, y: 0.50, mode:"relative" }, rotation:[0, 0, 0],  scale:1.0,  depth:2.5 },
                services:    { anchor:{ x: 0.75, y: 0.52, mode:"relative" }, rotation:[0, 0, 0],  scale:1.15, depth:1   },
                blog:        { anchor:{ x: 0.73, y: 0.52, mode:"relative" }, rotation:[0, 0 ,0],  scale:1.1,  depth:0   },
                partenariats:{ anchor:{ x: 0.73, y: 0.52, mode:"relative" }, rotation:[0, 0, 0],  scale:1.0,  depth:1   },
              }}

              /* responsive */
              responsive={[
                { max: 1280, anchor: { x: 0.66, y: 0.54 }, scale: 1.1 },
                { max: 1024, anchor: { x: 0.58, y: 0.56 }, scale: 0.95 },
                { max: 768,  anchor: { x: 0.50, y: 0.58 }, scale: 0.80, rotation: [0, 8, 0] },
                { max: 560,  anchor: { x: 0.50, y: 0.62 }, scale: 0.70, rotation: [0, 6, 0] },
              ]}

              /* rotation continue */
              spin={{ x: 0, y: 6, z: 0 }}

              /* rotation continue par page */
              spinById={{}}

              /* autoriser un morph même si l’ID ne change pas (routes partageant un id) */
              remorphOnSameId={true}

              dracoPath={`${BASE}draco/`}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
