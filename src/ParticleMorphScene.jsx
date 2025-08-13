import React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * ParticleMorphScene — morphing de particules entre plusieurs modèles GLB (DRACO)
 *
 * ✅ Vite + React + @react-three/fiber compatible
 * ✅ Pas de plugin GLSL requis (shaders inline)
 * ✅ Détection route/hash optionnelle pour choisir la forme active
 *
 * 🗂 Placez vos modèles dans `public/models/` (ex: /models/logo.glb)
 * 🧩 Placez les décodeurs DRACO dans `public/draco/` (voir notes plus bas)
 *
 * Exemple d'utilisation (route-driven) :
 *
 *   import { RouteMorphBackground } from "@/components/ParticleMorphScene.jsx";
 *
 *   const SHAPES = [
 *     { id: "home", url: "/models/home.glb" },
 *     { id: "services", url: "/models/services.glb" },
 *     { id: "blog", url: "/models/blog.glb" },
 *   ];
 *
 *   export default function Background() {
 *     return (
 *       <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
 *         <color attach="background" args={["#020617"]} />
 *         <RouteMorphBackground
 *           shapes={SHAPES}
 *           routeMap={(pathname, hash) => {
 *             if (hash === "#xdr") return "services"; // ancres possibles
 *             if (pathname.startsWith("/services")) return "services";
 *             if (pathname.startsWith("/blog")) return "blog";
 *             return "home";
 *           }}
 *           particleCount={9000}
 *           size={2.2}
 *           color="#93c5fd"  // Tailwind blue-300
 *           speed={0.9}
 *           dracoPath="/draco/"
 *         />
 *       </Canvas>
 *     );
 *   }
 */

/** Inline shaders (pas besoin de fichiers .glsl) */
const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uTime;

  void main() {
    vec3 p = mix(aFrom, aTo, uProgress);
    // léger bruit d'agitation pour rendre vivant
    float n = fract(sin(dot(p.xy, vec2(12.9898,78.233)))*43758.5453);
    p += 0.005 * vec3(n, n, n);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // taille dépendante de la distance
    gl_PointSize = uSize * uPixelRatio * clamp(1.0 / -mv.z, 0.5, 4.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard; // cercle
    float alpha = smoothstep(0.5, 0.45, d) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/** Helpers */
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
  const scale = targetRadius / (bs.radius || 1);
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
  // Utilise MeshSurfaceSampler pour une distribution uniforme
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
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random()); // rempli le volume
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    arr[i * 3 + 0] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

/**
 * Hook: prépare les cibles (positions) pour chaque modèle.
 */
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

/**
 * Composant interne qui rend les points et effectue le morph
 */
function Particles({ targets, activeId, particleCount, color, size, speed }) {
  const { gl } = useThree();
  const geometryRef = React.useRef();
  const materialRef = React.useRef();
  const progressRef = React.useRef(1);
  const currentIdRef = React.useRef(null);

  // Construire la géométrie (aFrom/aTo)
  React.useEffect(() => {
    const geo = new THREE.BufferGeometry();
    // positions actuelles = aléatoires au 1er rendu
    const from = createRandomSphere(particleCount, 0.8);
    const to = from.slice(0);
    geo.setAttribute("aFrom", new THREE.BufferAttribute(from, 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(to, 3));
    geometryRef.current = geo;
    return () => geo.dispose();
  }, [particleCount]);

  // Lancer un morph quand activeId change
  React.useEffect(() => {
    if (!geometryRef.current || !targets) return;
    const geo = geometryRef.current;
    const aFrom = geo.getAttribute("aFrom");
    const aTo = geo.getAttribute("aTo");

    // Copier l'état courant vers aFrom (état de départ du nouveau morph)
    // État courant = mix(aFrom, aTo, progress)
    const p = progressRef.current;
    for (let i = 0; i < aFrom.count; i++) {
      const ix = i * 3;
      aFrom.array[ix + 0] = aFrom.array[ix + 0] * (1 - p) + aTo.array[ix + 0] * p;
      aFrom.array[ix + 1] = aFrom.array[ix + 1] * (1 - p) + aTo.array[ix + 1] * p;
      aFrom.array[ix + 2] = aFrom.array[ix + 2] * (1 - p) + aTo.array[ix + 2] * p;
    }
    aFrom.needsUpdate = true;

    // Nouvelle cible
    const target = targets.get(activeId);
    if (!target) return;
    aTo.array.set(target);
    aTo.needsUpdate = true;

    // Reset progression
    progressRef.current = 0;
    if (materialRef.current) materialRef.current.uniforms.uProgress.value = 0;
    currentIdRef.current = activeId;
  }, [activeId, targets]);

  // Animation de la progression
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

  const uniforms = React.useMemo(
    () => ({
      uProgress: { value: 1 },
      uSize: { value: size },
      uPixelRatio: { value: Math.min(2, window.devicePixelRatio || 1) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0.95 },
    }),
    [color, size]
  );

  return (
    <points frustumCulled={false} renderOrder={-1}>
      {/* on stocke nos attribs custom dans geometryRef */}
      <bufferGeometry attach="geometry" ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

/**
 * Composant principal à utiliser dans <Canvas />
 */
export function ParticleMorphBackground({
  shapes,            // [{ id, url }]
  activeId,          // id actif
  particleCount = 8000,
  color = "#93c5fd",
  size = 2.0,
  speed = 0.8,      // vitesse (1 ~ 1 seconde)
  dracoPath = "/draco/",
  fitRadius = 1.2,  // "taille" cible à l'écran
}) {
  const targets = useParticleTargets({ shapes, particleCount, dracoPath, fitRadius });

  // Rendu (quand cibles prêtes)
  if (!targets) return null;
  return (
    <group>
      <Particles
        targets={targets}
        activeId={activeId ?? shapes[0]?.id}
        particleCount={particleCount}
        color={color}
        size={size}
        speed={speed}
      />
    </group>
  );
}

/**
 * Variante pilotée par la route (/pathname et #hash)
 *  - routeMap: (pathname, hash) => id
 *  - ou un objet { "/": "home", "/services": "services", "*": "home" }
 */
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

  return <ParticleMorphBackground shapes={shapes} activeId={activeId} {...rest} />;
}

export default ParticleMorphBackground;

/**
 * 🛠️ A FAIRE (une fois) — Fichiers DRACO
 *  - Copiez les fichiers du dossier `node_modules/three/examples/jsm/libs/draco/` vers `public/draco/` :
 *      draco_decoder.wasm, draco_wasm_wrapper.js, draco_decoder.js
 *  - Option CDN possible : dracoPath="https://www.gstatic.com/draco/v1/decoders/" (moins conseillé offline)
 *
 * 🧪 Test rapide :
 *  <Canvas><ParticleMorphBackground shapes={[{id:"a",url:"/models/a.glb"},{id:"b",url:"/models/b.glb"}]} activeId="a"/></Canvas>
 */
