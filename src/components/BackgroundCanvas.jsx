// src/components/BackgroundCanvas.jsx
import React, { Suspense, useMemo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RouteMorphBackground } from "./ParticleMorphScene.jsx";

export default function BackgroundCanvas() {
  const BASE = import.meta.env.BASE_URL || "/";

  const shapes = useMemo(
    () => [
      { id: "home",         url: `${BASE}models/becycure.glb` },
      { id: "services",     url: `${BASE}models/soc.glb` },
      { id: "blog",         url: `${BASE}models/blog.glb` },
      { id: "partenariats", url: `${BASE}models/partenariats.glb` },
    ],
    [BASE]
  );

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

  // --- NEW: clé responsive pour resynchroniser la pose pendant le morph au resize
  const getBpKey = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    if (w <= 560)  return "w-560";
    if (w <= 768)  return "w-768";
    if (w <= 1024) return "w-1024";
    if (w <= 1280) return "w-1280";
    return "w-large";
  };
  const [layoutKey, setLayoutKey] = useState(getBpKey);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setLayoutKey(getBpKey()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ contain: "paint", isolation: "isolate" }}>
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        dpr={[1, Math.min(1.75, window.devicePixelRatio || 1)]}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <color attach="background" args={["#0b0d10"]} />
        <Suspense fallback={null}>
          <RouteMorphBackground
            shapes={shapes}
            routeMap={routeMap}

            /* --- responsive live key (nouveau) --- */
            layoutKey={layoutKey}

            /* visuel */
            particleCount={9000}
            size={22}
            speed={0.6}
            colorA="rgba(75, 255, 225, 1)"
            colorB="rgba(53, 255, 104, 1)"
            sparkle={{ strength: 0.9, speed: 2 }}
            glow={{ intensity: 0.7, core: 0.2, falloff: 0.4, mixToWhite: 0.65, autoIntensity: 0.6 }}
            quality="auto"

            /* pose par défaut */
            anchor={{ x: 0.70, y: 0.52, mode: "relative" }}
            rotation={[0, 0, 0]}
            scale={1.0}
            depth={0}

            /* poses cibles par page */
            transformById={{
              home: {
                anchor:   { x: 0.70, y: 0.5, mode: "relative" },
                rotation: [0, 0, 0],
                scale:    1.0,
                depth:    2.5,
              },
              services: {
                anchor:   { x: 0.70, y: 0.52, mode: "relative" },
                rotation: [0, 22, 0],
                scale:    1.15,
                depth:    1,
              },
              blog: {
                anchor:   { x: 0.63, y: 0.58, mode: "relative" },
                rotation: [-5, 35, 0],
                scale:    1.1,
                depth:    0,
              },
              partenariats: {
                anchor:   { x: 0.50, y: 0.52, mode: "relative" },
                rotation: [0, 0, 0],
                scale:    1.0,
                depth:    1,
              },
            }}

            /* responsive (breakpoints) */
            responsive={[
              { max: 1280, anchor: { x: 0.66, y: 0.54 }, scale: 1.1 },
              { max: 1024, anchor: { x: 0.58, y: 0.56 }, scale: 0.95 },
              { max: 768,  anchor: { x: 0.50, y: 0.58 }, scale: 0.80, rotation: [0, 8, 0] },
              { max: 560,  anchor: { x: 0.50, y: 0.62 }, scale: 0.70, rotation: [0, 6, 0] },
            ]}

            /* spin continu */
            spin={{ x: 0, y: 8, z: 0 }}
            spinById={{
              services: { y: -6 },
              blog:     { y: -6 },
            }}

            remorphOnSameId={false}       // évite un “remorph” inutile au resize
            dracoPath={`${BASE}draco/`}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
