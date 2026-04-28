import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../../../utils/colors";

interface Props {
  scrollProgress: number;
}

export default function ConnectBroadcast({ scrollProgress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 4000;

  const visible = scrollProgress > 0.68;

  const { positions, velocities, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Start near center
      positions[i3] = (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;

      // Radial velocity direction
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      const speed = 0.5 + Math.random() * 1.5;
      velocities[i3] = dir.x * speed;
      velocities[i3 + 1] = dir.y * speed;
      velocities[i3 + 2] = dir.z * speed;

      scales[i] = 0.3 + Math.random() * 0.6;
    }
    return { positions, velocities, scales };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: COLORS.connect.clone() },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!visible || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    const localProgress = Math.max(0, (scrollProgress - 0.68) / 0.32);
    materialRef.current.uniforms.uProgress.value = localProgress;
  });

  return (
    <group position={[0, 0, -130]}>
      <points visible={visible}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aVelocity"
            count={count}
            array={velocities}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aScale"
            count={count}
            array={scales}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={`
            uniform float uTime;
            uniform float uProgress;
            uniform vec3 uColor;
            attribute vec3 aVelocity;
            attribute float aScale;
            varying float vAlpha;
            varying vec3 vColor;
            void main() {
              float spread = uProgress * 8.0;
              vec3 pos = position + aVelocity * spread;
              pos += sin(uTime * 0.2 + pos.x) * 0.1;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = max(1.0, 1.8 * aScale * (200.0 / -mvPosition.z));
              float dist = length(mvPosition.xyz);
              vAlpha = smoothstep(60.0, 3.0, dist) * (0.06 + 0.2 * aScale) * (1.0 - uProgress * 0.3);
              vColor = uColor;
            }
          `}
          fragmentShader={`
            varying float vAlpha;
            varying vec3 vColor;
            void main() {
              float d = length(gl_PointCoord - vec2(0.5));
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
              gl_FragColor = vec4(vColor, alpha);
            }
          `}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
