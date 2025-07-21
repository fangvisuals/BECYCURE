import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Network({ count = 100 }) {
  const pointsRef = useRef();

  // Positions initiales des points
  const points = useMemo(() => {
    return new Array(count).fill().map(() =>
      new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20)
      )
    );
  }, [count]);

  // Géométrie des lignes entre points proches
  const [linePositions, setLinePositions] = React.useState(null);

  useEffect(() => {
    const positions = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 5) {
          positions.push(points[i].x, points[i].y, points[i].z);
          positions.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }
    setLinePositions(new Float32Array(positions));
  }, [points]);

  // Stocke la bufferAttribute en ref pour update plus simple
  const positionsAttributeRef = useRef();

  useFrame(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    if (!geometry) return;

    const positionAttr = geometry.attributes.position;
    if (!positionAttr) return;

    // Animation oscillatoire des points
    points.forEach((point, i) => {
      point.x += Math.sin(Date.now() * 0.001 + i) * 0.001;
      point.y += Math.cos(Date.now() * 0.001 + i) * 0.001;
      point.z += Math.sin(Date.now() * 0.001 + i * 1.1) * 0.001;
      
      positionAttr.setXYZ(i, point.x, point.y, point.z);
    });
    positionAttr.needsUpdate = true;
  });

  return (
    <>
      {/* Points */}
      <points ref={pointsRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
            ref={positionsAttributeRef}
          />
        </bufferGeometry>
        <pointsMaterial attach="material" color="#00ffff" size={0.1} />
      </points>

      {/* Lignes */}
      {linePositions && (
        <lineSegments>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#00ffff" transparent opacity={0.2} />
        </lineSegments>
      )}
    </>
  );
}

export default Network;
