precision highp float;

varying vec2 vUv;

uniform vec2  uResolution;   // pixels
uniform float uTime;
uniform float uOpacity;
uniform float uIntensity;
uniform float uGridScale;    // densité (cellules par unité UV)
uniform float uLinePx;       // épaisseur en pixels
uniform float uSpeed;        // vitesse drift
uniform float uBreathe;      // amplitude respiration (gérée côté JS)
uniform float uMajorEvery;   // lignes majeures périodiques

uniform vec3  uColor;        // lignes normales
uniform vec3  uAccent;       // lignes majeures

// convertit épaisseur en pixels -> en UV (dépend de la résolution la plus petite)
float pxToUv(float px) {
  float minDim = min(uResolution.x, uResolution.y);
  return px / minDim;
}

void main() {
  // UV de travail, drift doux en diagonale
  vec2 uv = vUv;

  // Drift animé : déplacement lent et subtil
  uv += vec2(1.0, 0.7) * uTime * uSpeed;

  // Échelle des cellules
  vec2 g = uv * uGridScale;

  // distance aux lignes (centre des cellules)
  vec2 frac = abs(fract(g) - 0.5);
  float distToLine = min(frac.x, frac.y);

  // anti-alias basé sur fwidth (taille d'un pixel en UV)
  float aa = fwidth(distToLine) * 1.25;

  // épaisseur cible convertie en UV
  float lw = pxToUv(uLinePx);

  // lignes fines
  float baseLine = 1.0 - smoothstep(lw, lw + aa, distToLine);

  // lignes majeures (tous les uMajorEvery)
  // on détecte quand on est proche d'une ligne entière
  vec2 cell = floor(g + 0.5);
  vec2 majorMask = step(0.5, 1.0 - abs(fract((cell) / uMajorEvery) - 0.5) * 2.0);
  float isMajor = max(majorMask.x, majorMask.y);

  // mix couleurs
  vec3 lineColor = mix(uColor, uAccent, isMajor);

  // intensité globale + léger adoucissement vers les bords
  float vignette = smoothstep(0.0, 0.9, 1.0 - length(vUv - 0.5) * 1.2);
  float alpha = baseLine * uIntensity * vignette * uOpacity;

  gl_FragColor = vec4(lineColor, alpha);

  #ifdef OES_standard_derivatives
    // rien, fwidth déjà ok
  #endif

  // tonemapping / colorspace si nécessaire (optionnel)
  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}
