// Three.js Journey-style morphing + seed pour scintillement
// (NE PAS redéclarer 'position' — Three l'injecte déjà)

attribute vec3 aPositionTarget; // target positions
attribute float aSize;          // per-point size (multiplier)
attribute float aSeed;          // graine par particule (0..1)

uniform float uProgress;        // 0..1
uniform float uSize;            // normalized pixel size: (px * dpr) / viewportHeight
uniform vec2 uResolution;       // viewport size in pixels
uniform float uTime;            // secondes (anim sparkle)

varying float vMix;             // pour mix de couleur
varying float vRnd;             // pour sparkle

float easeInOutCubic(float t) {
  return (t < 0.5)
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float t = easeInOutCubic(clamp(uProgress, 0.0, 1.0));
  vMix = t;
  vRnd = aSeed;

  // 'position' est injecté par Three (source)
  vec3 pos = mix(position, aPositionTarget, t);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float perspective = clamp(1.0 / -mv.z, 0.0, 4.0);
  gl_PointSize = aSize * uSize * uResolution.y * perspective;
}
