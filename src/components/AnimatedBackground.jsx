// components/AnimatedBackground.jsx
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleCloud({ color = "#00ffff" }) {
  const ref = useRef();
  const COUNT = 5000;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) {
      arr[i] = THREE.MathUtils.randFloatSpread(30); // plus grande dispersion
    }
    return arr;
  }, [COUNT]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
      ref.current.rotation.x += delta * 0.003;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function ResponsiveCamera({ children }) {
  const { size, camera } = useThree();

  useEffect(() => {
    const baseFov = 60;
    const baseAspect = 16 / 9;
    const currentAspect = size.width / size.height;

    camera.fov = baseFov * (currentAspect / baseAspect);
    camera.position.z = 15;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return children;
}

export default function AnimatedBackground({ color = "#00ffff" }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
      
    >
      <ResponsiveCamera>
        <color attach="background" args={["#080808"]} />
        <ambientLight intensity={0.4} />
        <ParticleCloud color={color} />
      </ResponsiveCamera>
    </Canvas>
  );
}
