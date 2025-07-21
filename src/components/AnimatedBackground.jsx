import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";



function ParticleCloud({ color = "#00ffff" }) {
  const ref = useRef();
  const COUNT = 3000;
  // Génère des positions aléatoires pour les sphères
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push([
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20)
      ]);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group ref={ref}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.01, 10, 10]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function ResponsiveCamera({ children }) {
  const { size, camera } = useThree();
  React.useEffect(() => {
    const baseFov = 75;
    const baseAspect = 16 / 9;
    const currentAspect = size.width / size.height;
    camera.fov = baseFov * (currentAspect / baseAspect);
    camera.position.z = 10;
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return children;
}

function AnimatedBackground({ color = "#00ffff" }) {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      camera={{ position: [0, 0, 10], fov: 75 }}
    >
      <ResponsiveCamera>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={1} />
        <ParticleCloud color={color} />
      </ResponsiveCamera>
    </Canvas>
  );
}
export default AnimatedBackground;
