import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function Particles() {
  const ref = useRef();

  const count = 5000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = THREE.MathUtils.randFloatSpread(30);
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const rotationSpeed = 0.0005;
    ref.current.rotation.x += rotationSpeed;
    ref.current.rotation.y -= rotationSpeed;
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
