// src/components/ParticleMorphScene.jsx
import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Shaders (vite-plugin-glsl)
import vertexShader from "@/shaders/particles/vertex.glsl";
import fragmentShader from "@/shaders/particles/fragment.glsl";

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
  let meshCount = 0;

  scene.updateMatrixWorld(true);

  scene.traverse((obj) => {
    if ((obj.isMesh || obj.isSkinnedMesh) && obj.geometry) {
      meshCount++;

      let g = obj.geometry.clone();
      g.applyMatrix4(obj.matrixWorld);

      if (g.index) g = g.toNonIndexed();

      const pos = g.getAttribute("position");
      if (!pos || !pos.array || pos.array.length < 9) {
        g.dispose();
        return;
      }

      const bare = new THREE.BufferGeometry();
      bare.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(pos.array), 3)
      );

      geoms.push(bare);
      g.dispose();
    }
  });

  if (meshCount === 0) {
    console.warn("[ParticleMorph] Aucun Mesh dans le GLB — fallback sphère.");
  }

  if (geoms.length === 0) return null;

  const merged = BufferGeometryUtils.mergeGeometries(geoms, false);
  geoms.forEach((g) => g.dispose());

  const pos = merged.getAttribute("position");
  const tri = Math.floor(pos.count / 3);
  console.log(
    `[ParticleMorph] Merged geometry: ${pos.count} vertices (~${tri} triangles)`
  );

  return merged;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
function useParticleTargets({ shapes, activeId, particleCount, dracoPath, fitRadius }) {
  const [targets, setTargets] = React.useState(null); // Map id -> Float32Array

  React.useEffect(() => {
    let cancelled = false;
    let idleId = null;

    const idle = (cb) => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        return window.requestIdleCallback(cb);
      }
      return setTimeout(cb, 400);
    };
    const cancelIdle = (id) => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        return window.cancelIdleCallback(id);
      }
      clearTimeout(id);
    };

    async function loadOneShape(s) {
      try {
        const gltf = await loadGLTF(s.url, dracoPath);
        const merged = buildMergedGeometryFromScene(gltf.scene);
        let pts;
        if (!merged) {
          pts = createRandomSphere(particleCount, fitRadius * 0.8);
        } else {
          centreAndFit(merged, fitRadius);
          pts = samplePointsRandom(merged, particleCount);
          merged.dispose();
        }
        return [s.id, pts];
      } catch (e) {
        console.warn("GLB load failed:", s.url, e);
        return [s.id, createRandomSphere(particleCount, fitRadius * 0.8)];
      }
    }

    (async () => {
      const entries = new Map();

      // 1) charge d’abord la forme active (ou la 1ère)
      const active = shapes.find((s) => s.id === activeId) || shapes[0];
      if (active) {
        const pair = await loadOneShape(active);
        if (!cancelled) {
          entries.set(pair[0], pair[1]);
          setTargets(new Map(entries));
        }
      }

      // 2) en idle, charge les autres formes
      idleId = idle(async () => {
        for (const s of shapes) {
          if (cancelled) return;
          if (entries.has(s.id)) continue;
          const pair = await loadOneShape(s);
          if (cancelled) return;
          entries.set(pair[0], pair[1]);
          setTargets(new Map(entries));
        }
      });
    })();

    return () => {
      cancelled = true;
      if (idleId != null) cancelIdle(idleId);
    };
  }, [JSON.stringify(shapes), activeId, particleCount, dracoPath, fitRadius]);

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
  colorB = "#ff0000ff",
  colorMix = 0.6, // NEW: mix 0..1 (0=A, 1=B)
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

  const baseAreaRef = React.useRef(null);
  React.useEffect(() => {
    if (baseAreaRef.current == null) {
      baseAreaRef.current = viewport.width * viewport.height;
    }
  }, [viewport.width, viewport.height]);

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

  React.useEffect(() => {
    if (!geometryRef.current || !targets) return;
    const geo = geometryRef.current;
    const aPos = geo.getAttribute("position");
    const aTarget = geo.getAttribute("aPositionTarget");

    const p = progressRef.current;
    for (let i = 0; i < aPos.count; i++) {
      const ix = i * 3;
      aPos.array[ix + 0] = aPos.array[ix + 0] * (1 - p) + aTarget.array[ix + 0] * p;
      aPos.array[ix + 1] = aPos.array[ix + 1] * (1 - p) + aTarget.array[ix + 1] * p;
      aPos.array[ix + 2] = aPos.array[ix + 2] * (1 - p) + aTarget.array[ix + 2] * p;
    }
    aPos.needsUpdate = true;

    const target = targets.get(activeId);
    if (target) {
      aTarget.array.set(target);
      aTarget.needsUpdate = true;
    }

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

  const gamma =
    typeof glow?.autoIntensity === "number"
      ? glow.autoIntensity
      : glow?.autoIntensity
      ? 0.6
      : null;
  const area = viewport.width * viewport.height;
  const refArea = baseAreaRef.current ?? area;
  const ratio = Math.max(0.25, Math.min(4, refArea / area));
  const intensityEffective = (glow?.intensity ?? 1) * (gamma != null ? Math.pow(ratio, gamma) : 1);

  const uniforms = React.useMemo(
    () => ({
      uProgress:   { value: 1 },
      uTime:       { value: 0 },
      uSize:       { value: (size * dpr) / viewport.height },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uColorA:     { value: new THREE.Color(colorA) },
      uColorB:     { value: new THREE.Color(colorB) },
      uColorMix:   { value: colorMix }, // NEW
      // glow
      uIntensity:  { value: intensityEffective },
      uMixToWhite: { value: glow?.mixToWhite ?? 0.0 },
      // sparkle
      uSparkleStrength: { value: sparkle?.strength ?? 0.0 },
      uSparkleSpeed:    { value: sparkle?.speed ?? 0.0 },
    }),
    [
      size, dpr, viewport.width, viewport.height,
      colorA, colorB, colorMix,
      intensityEffective, glow?.mixToWhite,
      sparkle?.strength, sparkle?.speed
    ]
  );

  React.useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uResolution.value.set(viewport.width, viewport.height);
    u.uSize.value = (size * dpr) / viewport.height;
    u.uColorMix.value = colorMix; // keep in sync if prop changes
  }, [viewport.width, viewport.height, size, dpr, colorMix]);

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

  // couleurs
  color,
  colorA = undefined,
  colorB = undefined,
  colorMix = 0.5,     // NEW: 0..1
  colorMixById,       // NEW: { [id]: number }

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
  const targets = useParticleTargets({ shapes, activeId, particleCount, dracoPath, fitRadius });
  const groupRef = React.useRef();
  const { camera, size: viewport } = useThree();

  const finalColorA = colorA || color || "#60a5fa";
  const finalColorB = colorB || colorA || color || "#a78bfa";

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

  // mix des couleurs (global + override par page)
  const finalColorMix = React.useMemo(() => {
    const perId = (activeId && colorMixById && colorMixById[activeId]);
    return typeof perId === "number" ? perId : colorMix;
  }, [activeId, colorMixById, colorMix]);

  // ----- Refs pour orientation, spin, position et scale (persistantes) -----
  const qOrientRef    = React.useRef(new THREE.Quaternion());
  const qSpinRef      = React.useRef(new THREE.Quaternion());
  const qTmpA         = React.useRef(new THREE.Quaternion());
  const qLerpStartRef = React.useRef(new THREE.Quaternion());
  const qLerpEndRef   = React.useRef(new THREE.Quaternion());

  const pBaseRef       = React.useRef(new THREE.Vector3());
  const pTargetRef     = React.useRef(new THREE.Vector3());
  const pLerpStartRef  = React.useRef(new THREE.Vector3());
  const pLerpEndRef    = React.useRef(new THREE.Vector3());

  const scaleBaseRef       = React.useRef(1);
  const scaleTargetRef     = React.useRef(1);
  const scaleLerpStartRef  = React.useRef(1);
  const scaleLerpEndRef    = React.useRef(1);

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

  const spinEffective = React.useMemo(() => {
    const base = spin || {};
    const perId = (activeId && spinById && spinById[activeId]) || {};
    return {
      x: perId.x ?? base.x ?? 0,
      y: perId.y ?? base.y ?? 0,
      z: perId.z ?? base.z ?? 0,
    };
  }, [spin, spinById, activeId]);

  const handleProgress = React.useCallback(
    (p) => {
      if (p === 0) {
        qLerpStartRef.current.copy(qOrientRef.current);
        qLerpEndRef.current.copy(makeTargetQuatFromEffective(effective));
        pLerpStartRef.current.copy(pBaseRef.current);
        pLerpEndRef.current.copy(pTargetRef.current);
        scaleLerpStartRef.current = scaleBaseRef.current;
        scaleLerpEndRef.current   = scaleTargetRef.current;
      }
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

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const sx = THREE.MathUtils.degToRad(spinEffective.x || 0) * delta;
    const sy = THREE.MathUtils.degToRad(spinEffective.y || 0) * delta;
    const sz = THREE.MathUtils.degToRad(spinEffective.z || 0) * delta;
    if (sx || sy || sz) {
      qTmpA.current.setFromEuler(new THREE.Euler(sx, sy, sz));
      qSpinRef.current.multiply(qTmpA.current);
    }

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
        colorMix={finalColorMix}   // NEW
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

  const morphKey = `${pathname}|${hash || ""}|${layoutKey || ""}`;

  return <ParticleMorphBackground shapes={shapes} activeId={activeId} morphKey={morphKey} {...rest} />;
}

export default ParticleMorphBackground;
