// MorphingParticles.jsx
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import vertexShader from "../shaders/particles/vertex.glsl";
import fragmentShader from "../shaders/particles/fragment.glsl";

export default function MorphingParticles() {
  const { size } = useThree();
  const pointsRef = useRef();

  // Géométrie de la sphère principale
  const geometry = new THREE.SphereGeometry(2, 128, 128);
  geometry.setIndex(null);

  // Uniforms partagés
  const sharedUniforms = {
    uSize: { value: 0.2 },
    uResolution: {
      value: new THREE.Vector2(size.width * size.pixelRatio, size.height * size.pixelRatio),
    },
  };

  // Matériau principal
  const mainMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: sharedUniforms,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });

  // Matériau fond (clone du shader, avec taille plus petite)
  const backgroundMaterial = mainMaterial.clone();
  backgroundMaterial.uniforms = {
    ...sharedUniforms,
    uSize: { value: 0.5 } // taille plus fine pour le décor
  };

  // Géométrie du décor
  const backgroundParticleCount = 1000;
  const backgroundPositions = useMemo(() => {
    const pos = new Float32Array(backgroundParticleCount * 3);
    for (let i = 0; i < backgroundParticleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  const backgroundGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(backgroundPositions, 3));
    return geo;
  }, [backgroundPositions]);

  return (
    <>
      {/* Sphère principale */}
      <points ref={pointsRef} geometry={geometry} material={mainMaterial} position={[3, 0, 0]} />

      {/* Décor de fond */}
      <points geometry={backgroundGeometry} material={backgroundMaterial} />
    </>
  );
}
