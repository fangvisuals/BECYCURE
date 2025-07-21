
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export default function ParticleCloud({ count = 3000, debug = false, color = '#00ffff' }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      array[i] = THREE.MathUtils.randFloatSpread(debug ? 20 : 40);
    }
    return array;
  }, [count, debug]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <Points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={debug ? '#ff0000' : color}
        size={debug ? 0.5 : 0.1}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}
