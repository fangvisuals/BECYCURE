uniform float uSize;

void main() {
    // Position du point dans l'espace caméra
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Calcul de la taille des points avec prise en compte de la distance (perspective)
    gl_PointSize = uSize * (300.0 / -mvPosition.z);

        // Position finale
    gl_Position = projectionMatrix * mvPosition;
}