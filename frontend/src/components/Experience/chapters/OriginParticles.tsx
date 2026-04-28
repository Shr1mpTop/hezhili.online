import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../../../utils/colors";

interface Props {
  scrollProgress: number;
}

export default function OriginParticles({ scrollProgress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 4000;

  const visible = scrollProgress < 0.2;

  const { positions, randomness, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      randomness[i3] = (Math.random() - 0.5) * 2;
      randomness[i3 + 1] = (Math.random() - 0.5) * 2;
      randomness[i3 + 2] = (Math.random() - 0.5) * 2;

      scales[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions, randomness, scales };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 1.8 },
      uColor: { value: COLORS.origin.clone() },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!visible || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uProgress.value =
      scrollProgress / 0.2;
  });

  return (
    <group>
      <points visible={visible}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aRandomness"
            count={count}
            array={randomness}
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
            uniform float uSize;
            attribute vec3 aRandomness;
            attribute float aScale;
            varying float vAlpha;
            void main() {
              vec3 pos = position;
              float converge = uTime * 0.05;
              pos += aRandomness * sin(uTime * 0.2 + pos.x * 0.3) * (1.0 - converge * 0.3);
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = max(1.0, uSize * aScale * (200.0 / -mvPosition.z));
              float dist = length(mvPosition.xyz);
              vAlpha = smoothstep(60.0, 3.0, dist) * (0.08 + 0.25 * aScale);
            }
          `}
          fragmentShader={`
            varying float vAlpha;
            void main() {
              float d = length(gl_PointCoord - vec2(0.5));
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
              gl_FragColor = vec4(0.85, 0.88, 0.95, alpha);
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
