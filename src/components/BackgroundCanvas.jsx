import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { RouteMorphBackground } from "./ParticleMorphScene.jsx";

export default function BackgroundCanvas() {
  const BASE = import.meta.env.BASE_URL || "/";

  const shapes = useMemo(
    () => [
      { id: "home",     url: `${BASE}models/becycure.glb` },
      { id: "services", url: `${BASE}models/soc.glb` },
      { id: "blog",     url: `${BASE}models/blog.glb` },
      { id: "partenariats",     url: `${BASE}models/partenariats.glb` },

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

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ contain: "paint", isolation: "isolate" }}>
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        dpr={[1, Math.min(1.75, window.devicePixelRatio || 1)]}  // DPI clamp → perfs stables
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <color attach="background" args={["#0b0d10"]} />
        <Suspense fallback={null}>
          <RouteMorphBackground
            shapes={shapes}
            routeMap={routeMap}
            particleCount={20000}
            size={10}                         // 18–26 marche bien à 9k
            speed={0.4}
            colorA="rgba(179, 255, 189, 1)"   // vert A
            colorB="rgba(80, 214, 185, 1)"    // vert B
            glow={{ intensity: 0.5, core: 0.14, falloff: 0.40, mixToWhite: 0.65 }}
            spin={{ x: 0, y: 8, z: 0 }}         // tourne doucement vers la droite (axe Y)

            /* overrides éventuels par page/forme */
            spinById={{
              services: { y: 12 },   // un poil plus rapide sur "services"
              blog:     { y: -6 },   // rotation inverse sur "blog"
            }}

            sparkle={{ strength: 8, speed: 0.5 }}   // active le scintillement
            quality="auto"
            anchor={{ x: 0.72, y: 0.52, mode: "relative" }}
            dracoPath={`${BASE}draco/`}


            responsive={[
              { max: 1280, anchor: { x: 0.66, y: 0.54 }, scale: 1.1 },
              { max: 1024, anchor: { x: 0.58, y: 0.56 }, scale: 0.95 },
              { max: 768,  anchor: { x: 0.50, y: 0.58 }, scale: 0.80, rotation: [0, 8, 0] },
              { max: 560,  anchor: { x: 0.50, y: 0.62 }, scale: 0.70, rotation: [0, 6, 0] },
            ]}

          />
        </Suspense>
      </Canvas>
    </div>
  );
}
