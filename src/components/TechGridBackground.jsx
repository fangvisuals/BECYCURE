import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import vert from "../shaders/bg/vertex.glsl";
import frag from "../shaders/bg/fragment.glsl";

export default function TechGridBackground({
  intensity = 0.9,
  opacity = 0.35,
  gridScale = 12.0,
  linePx = 2.0,
  speed = 0.05,
  breathe = 0.00,
  color = "rgba(6, 192, 0, 1)",
  accent = "rgba(0, 202, 51, 1)",
  majorEvery = 3.0,
  depth = -50,
}) {
  const { viewport, size } = useThree();
  const matRef = useRef();

  // world-space size of the fullscreen plane
  const [vw, vh] = useMemo(() => [viewport.width, viewport.height], [viewport.width, viewport.height]);

  const uniforms = useMemo(
    () => ({
      uTime:        { value: 0 },
      uResolution:  { value: new THREE.Vector2(size.width, size.height) }, // pixels
      uOpacity:     { value: opacity },
      uIntensity:   { value: intensity },
      uGridScale:   { value: gridScale },
      uLinePx:      { value: linePx },
      uSpeed:       { value: speed },
      uBreathe:     { value: breathe },
      uMajorEvery:  { value: majorEvery },
      uColor:       { value: new THREE.Color(color) },
      uAccent:      { value: new THREE.Color(accent) },
    }),
    [size.width, size.height, opacity, intensity, gridScale, linePx, speed, breathe, majorEvery, color, accent]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value = t;
    const breatheFactor = 1.0 + Math.sin(t * 0.8) * u.uBreathe.value;
    u.uIntensity.value = intensity * breatheFactor; // keep your base intensity
  });

  // keep resolution in sync with canvas pixel size (DPR aware)
  useEffect(() => {
    matRef.current?.uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height]);

  return (
    <mesh
      frustumCulled={false}
      renderOrder={-100}
      position={[0, 0, 0]}
      // Force the plane to remount when viewport size changes
      key={`tg-${Math.round(vw * 100)}x${Math.round(vh * 100)}`}
    >
      <planeGeometry args={[vw, vh, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}
