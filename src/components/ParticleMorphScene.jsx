// src/components/ParticleMorphScene.jsx
import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Shaders (avec vite-plugin-glsl)
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

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function samplePointsRandom(geometry, count) {
  const tempMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(tempMesh).build();
  const out = new Float32Array(count * 3);
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    out[i * 3 + 0] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }
  tempMesh.geometry.dispose();
  tempMesh.material.dispose();
  return out;
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
          const pts = samplePointsRandom(merged, particleCount);
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

/* ----------------- positioning helpers ----------------- */
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

function makeTargetQuatFromEffective(eff) {
  const e = new THREE.Euler(
    degToRad(eff.rotation?.[0] || 0),
    degToRad(eff.rotation?.[1] || 0),
    degToRad(eff.rotation?.[2] || 0)
  );
  const q = new THREE.Quaternion();
  q.setFromEuler(e);
  return q;
}

/* ----------------- particles renderer ----------------- */
function Particles({
  targets,
  activeId,
  particleCount,
  size,
  speed,
  colorA = "#60a5fa",
  colorB = "#a78bfa",
  morphKey,
  onProgress,
  remorphOnSameId = true,
  remorphNoise = 0.02,
  glow,
  sparkle,
}) {
  const geometryRef = React.useRef();
  const materialRef = React.useRef();
  const progressRef = React.useRef(1);
  const { size: viewport } = useThree();

  // aire de référence (premier rendu) pour compenser la luminosité
  const baseAreaRef = React.useRef(null);
  React.useEffect(() => {
    if (baseAreaRef.current == null) {
      baseAreaRef.current = viewport.width * viewport.height;
    }
  }, [viewport.width, viewport.height]);

  // init attributes
  React.useLayoutEffect(() => {
    const geo = geometryRef.current;
    if (!geo) return;

    const from = createRandomSphere(particleCount, 0.8);
    const to = new Float32Array(from);

    const sizes = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = 1.0 + Math.random() * 0.6;
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
    onProgress?.(0);

    prevIdRef.current = activeId;
    prevKeyRef.current = morphKey;
  }, [activeId, targets, morphKey, remorphOnSameId, remorphNoise, onProgress]);

  // animate progress + time
  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    const p = progressRef.current;
    if (p < 1) {
      const np = Math.min(1, p + delta * speed);
      progressRef.current = np;
      u.uProgress.value = np;
      onProgress?.(np);
    }
    u.uTime.value += delta;
  });

  const dpr = Math.min(2, window.devicePixelRatio || 1);

  // compensation de luminosité selon l’aire (gamma = 0.6 par défaut)
  const gamma =
    typeof glow?.autoIntensity === "number"
      ? glow.autoIntensity
      : glow?.autoIntensity
      ? 0.6
      : null;
  const area = viewport.width * viewport.height;
  const refArea = baseAreaRef.current ?? area;
  const ratio = Math.max(0.25, Math.min(4, refArea / area)); // clamp anti-extrêmes
  const intensityEffective = (glow?.intensity ?? 1) * (gamma != null ? Math.pow(ratio, gamma) : 1);


  const uniforms = React.useMemo(
    () => ({
      uProgress:   { value: 1 },
      uTime:       { value: 0 },
      uSize:       { value: (size * dpr) / viewport.height },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uColorA:     { value: new THREE.Color(colorA) },
      uColorB:     { value: new THREE.Color(colorB) },
      // glow (si utilisé par le shader)
      uIntensity:  { value: intensityEffective },
      uMixToWhite: { value: glow?.mixToWhite ?? 0.0 },
      // sparkle (si utilisé par le shader)
      uSparkleStrength: { value: sparkle?.strength ?? 0.0 },
      uSparkleSpeed:    { value: sparkle?.speed ?? 0.0 },
    }),
    [
      size, dpr, viewport.width, viewport.height,
      colorA, colorB, intensityEffective, glow?.mixToWhite, glow?.core, glow?.falloff,
      sparkle?.strength, sparkle?.speed
    ]
  );

  React.useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uResolution.value.set(viewport.width, viewport.height);
    u.uSize.value = (size * dpr) / viewport.height;
  }, [viewport.width, viewport.height, size, dpr]);

  return (
    <points frustumCulled={false} renderOrder={-1}>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
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

/* ----------------- public API with smooth carry-over pose ----------------- */
export function ParticleMorphBackground({
  shapes,
  activeId,
  particleCount = 9000,
  size = 8.0,
  speed = 0.9,
  dracoPath = "/draco/",
  fitRadius = 1.2,

  // rétro-compat : si "color" est fourni, on s'en sert pour A/B
  color,
  colorA = undefined,
  colorB = undefined,

  // placement/orientation "cibles" (par page)
  anchor = { x: 0.72, y: 0.5, mode: "relative" },
  depth = 2.5,
  rotation = [0, 0, 0],
  scale = 1.0,
  transformById,
  responsive = [],

  // remorph
  morphKey,
  remorphOnSameId = true,
  remorphNoise = 0.02,

  // effets optionnels
  glow,
  sparkle,

  // auto-rotation douce (°/s)
  spin = { x: 0, y: 6, z: 0 },
  spinById,
}) {
  const targets = useParticleTargets({ shapes, particleCount, dracoPath, fitRadius });
  const groupRef = React.useRef();
  const { camera, size: viewport } = useThree();

  // couleurs finales
  const finalColorA = colorA || color || "#60a5fa";
  const finalColorB = colorB || colorA || color || "#a78bfa";

  // merge responsive + overrides
  const effective = React.useMemo(() => {
    const base = { anchor, depth, rotation, scale };
    const rule = pickResponsive(viewport.width, responsive) || {};
    const perId = (activeId && transformById && transformById[activeId]) || {};
    const mergeAnchor = (a, b) => ({ ...(a || {}), ...(b || {}) });
    return {
      ...base,
      ...rule,
      ...perId,
      anchor: mergeAnchor(base.anchor, mergeAnchor(rule.anchor, perId.anchor)),
    };
  }, [anchor, depth, rotation, scale, responsive, transformById, activeId, viewport.width]);

  // ----- Refs pour orientation, spin, position et scale (persistantes) -----
  const qOrientRef    = React.useRef(new THREE.Quaternion()); // orientation de base lissée
  const qSpinRef      = React.useRef(new THREE.Quaternion()); // spin accumulé en continu
  const qTmpA         = React.useRef(new THREE.Quaternion());
  const qLerpStartRef = React.useRef(new THREE.Quaternion());
  const qLerpEndRef   = React.useRef(new THREE.Quaternion());
  const lerpActiveRef = React.useRef(false);
  const lerpTRef      = React.useRef(0);
  const lerpDur       = 0.6; // s

  const pBaseRef       = React.useRef(new THREE.Vector3()); // position actuelle appliquée
  const pTargetRef     = React.useRef(new THREE.Vector3()); // position cible "page"
  const pLerpStartRef  = React.useRef(new THREE.Vector3());
  const pLerpEndRef    = React.useRef(new THREE.Vector3());
  const pLerpActiveRef = React.useRef(false);
  const pLerpTRef      = React.useRef(0);
  const pLerpDur       = 0.6; // s

  const scaleBaseRef       = React.useRef(1);
  const scaleTargetRef     = React.useRef(1);
  const scaleLerpStartRef  = React.useRef(1);
  const scaleLerpEndRef    = React.useRef(1);
  const scaleLerpActiveRef = React.useRef(false);
  const scaleLerpTRef      = React.useRef(0);
  const scaleLerpDur       = 0.6; // s

  // position/scale cibles recalculées à chaque render, mais appliquées en douceur après morph
  const initDoneRef = React.useRef(false);
  React.useLayoutEffect(() => {
    if (!groupRef.current) return;

    const targetPos = computeWorldFromAnchor(
      camera,
      viewport,
      effective.anchor,
      effective.depth ?? 0
    );
    pTargetRef.current.copy(targetPos);
    scaleTargetRef.current = effective.scale ?? 1;

    // init une seule fois : on part directement à la pose cible initiale
    if (!initDoneRef.current) {
      pBaseRef.current.copy(pTargetRef.current);
      scaleBaseRef.current = scaleTargetRef.current;

      const q0 = makeTargetQuatFromEffective(effective);
      groupRef.current.quaternion.copy(q0);
      qOrientRef.current.copy(q0);

      groupRef.current.position.copy(pBaseRef.current);
      groupRef.current.scale.setScalar(scaleBaseRef.current);

      initDoneRef.current = true;
    }
  }, [camera, viewport.width, viewport.height, effective.anchor, effective.depth, effective.scale]);

  // spin effectif (merge overrides)
  const spinEffective = React.useMemo(() => {
    const base = spin || {};
    const perId = (activeId && spinById && spinById[activeId]) || {};
    return {
      x: perId.x ?? base.x ?? 0,
      y: perId.y ?? base.y ?? 0,
      z: perId.z ?? base.z ?? 0,
    };
  }, [spin, spinById, activeId]);

  // callback progression du morph : on lance les lerps position/scale/orientation à la fin
  const handleProgress = React.useCallback(
   (p) => {
      // Snapshot au démarrage du morph
      if (p === 0) {
        qLerpStartRef.current.copy(qOrientRef.current);
        qLerpEndRef.current.copy(makeTargetQuatFromEffective(effective));
        pLerpStartRef.current.copy(pBaseRef.current);
        pLerpEndRef.current.copy(pTargetRef.current);
        scaleLerpStartRef.current = scaleBaseRef.current;
        scaleLerpEndRef.current   = scaleTargetRef.current;
      }
      // Suivre la progression du morph avec la même ease que le shader
      const t = easeInOutCubic(Math.min(Math.max(p, 0), 1));
      qOrientRef.current.slerpQuaternions(
        qLerpStartRef.current,
        qLerpEndRef.current,
        t
      );
      pBaseRef.current.lerpVectors(pLerpStartRef.current, pLerpEndRef.current, t);
      scaleBaseRef.current =
        scaleLerpStartRef.current * (1.0 - t) + scaleLerpEndRef.current * t;
   },
   [effective]
 );

  // loop : spin continu + lerps après morph, puis appliquer au groupe
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // spin en continu (ajouté à l'orientation de base)
    const sx = THREE.MathUtils.degToRad(spinEffective.x || 0) * delta;
    const sy = THREE.MathUtils.degToRad(spinEffective.y || 0) * delta;
    const sz = THREE.MathUtils.degToRad(spinEffective.z || 0) * delta;
    if (sx || sy || sz) {
      qTmpA.current.setFromEuler(new THREE.Euler(sx, sy, sz));
      qSpinRef.current.multiply(qTmpA.current);
    }

    // appliquer base (orient * spin), position et scale
    g.quaternion.copy(qOrientRef.current);
    g.quaternion.multiply(qSpinRef.current);
    g.position.copy(pBaseRef.current);
    g.scale.setScalar(scaleBaseRef.current);
  });

  return (
    <group ref={groupRef}>
      <Particles
        targets={targets}
        activeId={activeId ?? shapes[0]?.id}
        particleCount={particleCount}
        size={size}
        speed={speed}
        colorA={finalColorA}
        colorB={finalColorB}
        morphKey={morphKey}
        onProgress={handleProgress}
        remorphOnSameId={remorphOnSameId}
        remorphNoise={remorphNoise}
        glow={glow}
        sparkle={sparkle}
      />
    </group>
  );
}

export function RouteMorphBackground({ shapes, routeMap, layoutKey, ...rest }) {
  const { pathname, hash } = useLocation();
  const activeId = React.useMemo(() => {
    if (typeof routeMap === "function") return routeMap(pathname, hash);
    if (routeMap && typeof routeMap === "object") {
      const key = hash ? `${pathname}${hash}` : pathname;
      return routeMap[key] ?? routeMap[pathname] ?? routeMap["*"] ?? shapes[0]?.id;
    }
    return shapes[0]?.id;
  }, [pathname, hash, routeMap, shapes]);

  // clé de navigation (permet remorph subtil même si id identique)
  const morphKey = `${pathname}|${hash || ""}|${layoutKey || ""}`;

  return <ParticleMorphBackground shapes={shapes} activeId={activeId} morphKey={morphKey} {...rest} />;
}

export default ParticleMorphBackground;
