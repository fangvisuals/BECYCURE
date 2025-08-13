// src/shaders/particles/fragment.glsl
precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;

uniform float uIntensity;     // boost global (utilisé avec additive)
uniform float uMixToWhite;    // tire vers le blanc au centre (0..1)

uniform float uTime;          // pour le scintillement
uniform float uSparkleStrength; // 0..1
uniform float uSparkleSpeed;    // Hz

varying float vMix;           // gardé pour compat, non utilisé ici
varying float vRnd;           // seed par particule (0..1)

void main() {
  // ---- masque de point & halo 1/d (style demandé) ----
  vec2 uv = gl_PointCoord;                 // 0..1
  float d = length(uv - 0.5);              // distance au centre
  // évite la division par 0, mêmes constantes que l’exemple
  float alpha = 0.05 / max(d, 0.001) - 0.1;
  if (alpha <= 0.0) discard;               // coupe proprement le bord

  // ---- couleur: A/B coexistent en permanence (par particule) ----
  vec3 color = mix(uColorA, uColorB, vRnd);

  // option “néon” : centre un peu plus blanc (suivant uMixToWhite)
  float center = 1.0 - smoothstep(0.0, 0.20, d); // 0.20 ≈ cœur ~20% du disque
  color = mix(color, vec3(1.0), center * uMixToWhite);

  // ---- scintillement subtil (alpha) ----
  float sparkle = 0.5 + 0.5 * sin(uTime * uSparkleSpeed + vRnd * 6.2831853);
  float sparkleFactor = mix(1.0 - uSparkleStrength, 1.0 + uSparkleStrength, sparkle);

  // ---- sortie (additive + toneMapped=false côté material) ----
  gl_FragColor = vec4(color * uIntensity, clamp(alpha, 0.0, 1.0) * sparkleFactor);
}
