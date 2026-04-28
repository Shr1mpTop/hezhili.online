uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform vec3 uColor;

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = position;
  pos += aRandomness * sin(uTime * 0.3 + pos.x * 0.5) * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = uSize * aScale * (300.0 / -mvPosition.z);
  gl_PointSize = max(1.0, size);

  vColor = uColor;
  float dist = length(mvPosition.xyz);
  vAlpha = smoothstep(80.0, 5.0, dist) * (0.3 + 0.7 * aScale);
}
