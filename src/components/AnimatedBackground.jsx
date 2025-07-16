import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles() {
  const ref = useRef();
  const count = 5000;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = THREE.MathUtils.randFloatSpread(30);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial
        transparent
        color="#38bdf8"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function AnimatedBackground() {
  return (
    <Canvas
    style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        
    }}
      className="absolute inset-0 z-0"
      camera={{ position: [0, 0, 10], fov: 75 }}
    >
      <ambientLight intensity={0.3} />
      <Particles />
    </Canvas>
  );
}
