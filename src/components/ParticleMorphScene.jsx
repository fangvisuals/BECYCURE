import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

import vertexShader from "../shaders/particles/vertex.glsl";
import fragmentShader from "../shaders/particles/fragment.glsl";

/* ----------------- helpers ----------------- */
async function loadGLTF(url, dracoPath) {
  const loader = new GLTFLoader();
  if (dracoPath) {
    const draco = new DRACOLoader();
    draco.setDecoderPath(dracoPath);
    loader.setDRACOLoader(draco);
  }
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function centreAndFit(geometry, targetRadius = 1.0) {
  geometry.computeBoundingSphere();
  const bs = geometry.boundingSphere;
  if (!bs) return geometry;
  const scale = targetRadius / (bs.radius || 1.0);
  const m = new THREE.Matrix4()
    .makeTranslation(-bs.center.x, -bs.center.y, -bs.center.z)
    .multiply(new THREE.Matrix4().makeScale(scale, scale, scale));
  geometry.applyMatrix4(m);
  geometry.computeBoundingSphere();
  return geometry;
}

function buildMergedGeometryFromScene(scene) {
  const geoms = [];
  scene.updateMatrixWorld(true);
  scene.traverse((obj) => {
    if (obj.isMesh && obj.geometry) {
      const g = obj.geometry.clone();
      g.applyMatrix4(obj.matrixWorld);
      geoms.push(g);
    }
  });
  if (geoms.length === 0) return null;
  const merged = BufferGeometryUtils.mergeGeometries(geoms, false);
  geoms.forEach((g) => g.dispose());
  return merged;
}

function samplePointsFromGeometry(geometry, count) {
  const tempMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(tempMesh).build();
  const positions = new Float32Array(count * 3);
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    positions[i * 3 + 0] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  }
  tempMesh.geometry.dispose();
  tempMesh.material.dispose();
  return positions;
}

function createRandomSphere(count, radius = 0.8) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2.0 * Math.PI * u;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * Math.cbrt(Math.random());
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    arr[i * 3 + 0] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

function jitterArray(array, amp) {
  for (let i = 0; i < array.length; i += 3) {
    array[i + 0] += (Math.random() * 2 - 1) * amp;
    array[i + 1] += (Math.random() * 2 - 1) * amp;
    array[i + 2] += (Math.random() * 2 - 1) * amp;
  }
}

/* --------- target positions per model --------- */
function useParticleTargets({ shapes, particleCount, dracoPath, fitRadius }) {
  const [targets, setTargets] = React.useState(null); // Map id -> Float32Array

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      const entries = await Promise.all(
        shapes.map(async (s) => {
          const gltf = await loadGLTF(s.url, dracoPath);
          const merged = buildMergedGeometryFromScene(gltf.scene);
          if (!merged) return [s.id, createRandomSphere(particleCount, fitRadius * 0.8)];
          centreAndFit(merged, fitRadius);
          const pts = samplePointsFromGeometry(merged, particleCount);
          merged.dispose();
          return [s.id, pts];
        })
      );
      if (!cancelled) setTargets(new Map(entries));
    }
    run().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(shapes), particleCount, dracoPath, fitRadius]);

  return targets;
}

/* ----------------- world transform helpers ----------------- */
function degToRad(d) {
  return (d * Math.PI) / 180;
}

function computeWorldFromAnchor(camera, viewport, anchor, depth) {
  const { width, height } = viewport;
  const xRel = anchor.mode === "px" ? anchor.x / width : anchor.x;
  const yRel = anchor.mode === "px" ? anchor.y / height : anchor.y;

  const zCam = camera.position.z;
  const dist = zCam - depth;
  const fovRad = (camera.fov * Math.PI) / 180;
  const visibleHeight = 2.0 * Math.tan(fovRad / 2.0) * dist;
  const visibleWidth = visibleHeight * camera.aspect;

  const worldX = (xRel - 0.5) * visibleWidth;
  const worldY = (0.5 - yRel) * visibleHeight;
  return new THREE.Vector3(worldX, worldY, depth);
}

function pickResponsive(width, rules = []) {
  return (
    rules
      .filter((r) => (r.min == null || width >= r.min) && (r.max == null || width <= r.max))
      .pop() || null
  );
}

/* ----------------- auto quality ----------------- */
function computeAutoQuality(baseCount, baseSize, width, dpr) {
  // facteur largeur
  let f = 1.0;
  if (width <= 560) f *= 0.55;
  else if (width <= 768) f *= 0.65;
  else if (width <= 1024) f *= 0.75;
  else if (width <= 1280) f *= 0.85;
  else f *= 1.0;

  // facteur DPR (écrans très denses -> on réduit)
  if (dpr >= 2.5) f *= 0.75;
  else if (dpr >= 2.0) f *= 0.85;

  const count = Math.max(2000, Math.round(baseCount * f));
  // Conserver la luminosité perçue: points un peu plus gros si moins de particules
  const size = baseSize * Math.sqrt(baseCount / count);
  return { count, size };
}

/* ----------------- particles renderer (shaders) ----------------- */
function Particles({
  targets,
  activeId,
  particleCount,
  size,
  speed,
  colorA = "#60a5fa",
  colorB = "#a78bfa",
  morphKey,
  remorphOnSameId = true,
  remorphNoise = 0.02,
  glow,
  sparkle, // { strength, speed }
}) {
  const geometryRef = React.useRef();
  const materialRef = React.useRef();
  const progressRef = React.useRef(1);
  const { size: viewport } = useThree();

  // init attributes
  React.useLayoutEffect(() => {
    const geo = geometryRef.current;
    if (!geo) return;

    const from = createRandomSphere(particleCount, 0.8);
    const to = new Float32Array(from);

    const sizes = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = 1.0 + Math.random() * 0.6; // léger spread visuel
      seeds[i] = Math.random();
    }

    geo.setAttribute("position", new THREE.BufferAttribute(from, 3));
    geo.setAttribute("aPositionTarget", new THREE.BufferAttribute(to, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setDrawRange(0, particleCount);

    return () => {
      geo.deleteAttribute("position");
      geo.deleteAttribute("aPositionTarget");
      geo.deleteAttribute("aSize");
      geo.deleteAttribute("aSeed");
    };
  }, [particleCount]);

  const prevIdRef = React.useRef(activeId);
  const prevKeyRef = React.useRef(morphKey);

  // morph when activeId or page key changes
  React.useEffect(() => {
    if (!geometryRef.current || !targets) return;
    const geo = geometryRef.current;
    const aPos = geo.getAttribute("position");
    const aTarget = geo.getAttribute("aPositionTarget");

    // current state = mix(position, aPositionTarget, progress)
    const p = progressRef.current;
    for (let i = 0; i < aPos.count; i++) {
      const ix = i * 3;
      aPos.array[ix + 0] = aPos.array[ix + 0] * (1 - p) + aTarget.array[ix + 0] * p;
      aPos.array[ix + 1] = aPos.array[ix + 1] * (1 - p) + aTarget.array[ix + 1] * p;
      aPos.array[ix + 2] = aPos.array[ix + 2] * (1 - p) + aTarget.array[ix + 2] * p;
    }
    aPos.needsUpdate = true;

    // new target from active model
    const target = targets.get(activeId);
    if (target) {
      aTarget.array.set(target);
      aTarget.needsUpdate = true;
    }

    // remorph subtil si même id mais nav différente
    if (remorphOnSameId && prevIdRef.current === activeId && prevKeyRef.current !== morphKey) {
      jitterArray(aPos.array, remorphNoise);
      aPos.needsUpdate = true;
    }

    progressRef.current = 0;
    if (materialRef.current) materialRef.current.uniforms.uProgress.value = 0;

    prevIdRef.current = activeId;
    prevKeyRef.current = morphKey;
  }, [activeId, targets, morphKey, remorphOnSameId, remorphNoise]);

  // animate progress + time
  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    const p = progressRef.current;
    if (p < 1) {
      const np = Math.min(1, p + delta * speed);
      progressRef.current = np;
      u.uProgress.value = np;
    }
    u.uTime.value += delta;
  });

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const uniforms = React.useMemo(
    () => ({
      uProgress:   { value: 1 },
      uTime:       { value: 0 },
      // shader: gl_PointSize = aSize * uSize * uResolution.y * ...
      uSize:       { value: (size * dpr) / viewport.height },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uColorA:     { value: new THREE.Color(colorA) },
      uColorB:     { value: new THREE.Color(colorB) },
      // glow
      uIntensity:  { value: glow?.intensity ?? 2.0 },
      uCore:       { value: glow?.core ?? 0.16 },
      uFalloff:    { value: glow?.falloff ?? 0.38 },
      uMixToWhite: { value: glow?.mixToWhite ?? 0.55 },
      // sparkle
      uSparkleStrength: { value: sparkle?.strength ?? 0.15 },
      uSparkleSpeed:    { value: sparkle?.speed ?? 1.2 },
    }),
    [
      size, dpr, viewport.width, viewport.height,
      colorA, colorB, glow?.intensity, glow?.core, glow?.falloff, glow?.mixToWhite,
      sparkle?.strength, sparkle?.speed,
    ]
  );

  // keep uniforms in sync on resize / size change
  React.useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uResolution.value.set(viewport.width, viewport.height);
    u.uSize.value = (size * dpr) / viewport.height;
  }, [viewport.width, viewport.height, size, dpr]);

  return (
    <points frustumCulled={false} renderOrder={-1}>
      <bufferGeometry attach="geometry" ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        toneMapped={false}
      />
    </points>
  );
}

/* ----------------- public API with placement/orientation ----------------- */
export function ParticleMorphBackground({
  shapes,
  activeId,
  particleCount = 12000,  // base
  size = 5.0,            // base (px perçus)
  speed = 0.5,
  dracoPath = "/draco/",
  fitRadius = 1.2,
  colorA = "#B3FFBD",     // ≈ rgba(179,255,189,1)
  colorB = "#50D6B9",     // ≈ rgba(80,214,185,1)

  // placement/orientation
  anchor = { x: 0.72, y: 0.5, mode: "relative" },
  depth = 2,
  rotation = [0, 0, 0],
  scale = 1.0,
  transformById,
  responsive = [],

  // remorph behavior
  morphKey,                 // passed by RouteMorphBackground
  remorphOnSameId = true,
  remorphNoise = 0.02,

  // glow & sparkle
  glow,
  sparkle, // { strength, speed }

  // auto-rotation (degrés par seconde)
  spin = { x: 0, y: 6, z: 0 },          // défaut: tourne doucement sur Y
  spinById,                             // ex: { services: { y: 10 }, blog: { y: -8 } }

  // qualité : "auto" | false (désactive)
  quality = "auto",
}) {
  const targets = useParticleTargets({ shapes, particleCount, dracoPath, fitRadius });
  const groupRef = React.useRef();
  const { camera, size: viewport } = useThree();

  // auto quality → calcule count/size effectifs
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const { effectiveCount, effectiveSize } = React.useMemo(() => {
    if (quality === "auto") {
      const q = computeAutoQuality(particleCount, size, viewport.width, dpr);
      return { effectiveCount: q.count, effectiveSize: q.size };
    }
    return { effectiveCount: particleCount, effectiveSize: size };
  }, [quality, particleCount, size, viewport.width, dpr]);

  const effective = React.useMemo(() => {
    const base = { anchor, depth, rotation, scale };
    const rule = pickResponsive(viewport.width, responsive) || {};
    const perId = (activeId && transformById && transformById[activeId]) || {};
    const mergeAnchor = (a, b) => ({ ...(a || {}), ...(b || {}) });
    return {
      ...base, ...rule, ...perId,
      anchor: mergeAnchor(base.anchor, mergeAnchor(rule.anchor, perId.anchor)),
    };
  }, [anchor, depth, rotation, scale, responsive, transformById, activeId, viewport.width]);

  React.useLayoutEffect(() => {
    if (!groupRef.current) return;
    const pos = computeWorldFromAnchor(camera, viewport, effective.anchor, effective.depth ?? 0);
    groupRef.current.position.copy(pos);
    const rx = degToRad(effective.rotation?.[0] || 0);
    const ry = degToRad(effective.rotation?.[1] || 0);
    const rz = degToRad(effective.rotation?.[2] || 0);
    groupRef.current.rotation.set(rx, ry, rz);
    groupRef.current.scale.setScalar(effective.scale ?? 1);
  }, [camera, viewport.width, viewport.height, effective]);

   // spin effectif = base + override par forme
  const spinEffective = React.useMemo(() => {
    const base = spin || {};
    const perId = (activeId && spinById && spinById[activeId]) || {};
    return {
      x: perId.x ?? base.x ?? 0,
      y: perId.y ?? base.y ?? 0,
      z: perId.z ?? base.z ?? 0,
    };
  }, [spin, spinById, activeId]);

  // rotation continue, indépendante du framerate
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (spinEffective.x) g.rotation.x += THREE.MathUtils.degToRad(spinEffective.x) * delta;
    if (spinEffective.y) g.rotation.y += THREE.MathUtils.degToRad(spinEffective.y) * delta;
    if (spinEffective.z) g.rotation.z += THREE.MathUtils.degToRad(spinEffective.z) * delta;
  });

  return (
    <group ref={groupRef}>
      <Particles
        targets={targets}
        activeId={activeId ?? shapes[0]?.id}
        particleCount={effectiveCount}
        size={effectiveSize}
        speed={speed}
        colorA={colorA}
        colorB={colorB}
        morphKey={morphKey}
        remorphOnSameId={remorphOnSameId}
        remorphNoise={remorphNoise}
        glow={glow}
        sparkle={sparkle}
      />
    </group>
  );
}

export function RouteMorphBackground({ shapes, routeMap, ...rest }) {
  const { pathname, hash } = useLocation();
  const activeId = React.useMemo(() => {
    if (typeof routeMap === "function") return routeMap(pathname, hash);
    if (routeMap && typeof routeMap === "object") {
      const key = hash ? `${pathname}${hash}` : pathname;
      return routeMap[key] ?? routeMap[pathname] ?? routeMap["*"] ?? shapes[0]?.id;
    }
    return shapes[0]?.id;
  }, [pathname, hash, routeMap, shapes]);

  const morphKey = `${pathname}|${hash || ""}`;
  return <ParticleMorphBackground shapes={shapes} activeId={activeId} morphKey={morphKey} {...rest} />;
}

export default ParticleMorphBackground;
