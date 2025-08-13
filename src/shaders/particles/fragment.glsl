precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;

// 🔥 paramètres d'éclat
uniform float uIntensity;   // >1.0 = plus lumineux
uniform float uCore;        // rayon du cœur très lumineux (0..1)
uniform float uFalloff;     // largeur de la bordure douce (0..1)
uniform float uMixToWhite;  // tire vers le blanc au centre (0..1)

// ✨ scintillement
uniform float uTime;
uniform float uSparkleStrength; // 0..1 (0.0 = off)
uniform float uSparkleSpeed;    // Hz (0.0 = off)

varying float vMix;
varying float vRnd;

void main() {
  // masque circulaire
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0; // 0 centre → ~1 bords

  // alpha radial
  float inner = 1.0 - uFalloff;
  float alpha = 1.0 - smoothstep(inner, 1.0, d);

  // cœur lumineux
  float core = 1.0 - smoothstep(0.0, uCore, d);

  // couleur mixée selon le morph
  vec3 color = mix(uColorA, uColorB, clamp(vMix, 0.0, 1.0));
  color = mix(color, vec3(1.0), core * uMixToWhite);

  // ✨ sparkle (flicker subtil par particule)
  float sparkle = 0.5 + 0.5 * sin(uTime * uSparkleSpeed + vRnd * 6.2831853);
  float sparkleFactor = mix(1.0 - uSparkleStrength, 1.0 + uSparkleStrength, sparkle);

  vec3 outColor = color * (uIntensity);
  alpha *= sparkleFactor;

  if (alpha <= 0.001) discard;
  gl_FragColor = vec4(outColor, alpha);
}
