import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../../../utils/colors";

interface Props {
  scrollProgress: number;
}

export default function ForgeStreams({ scrollProgress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 5000;

  const visible = scrollProgress > 0.22 && scrollProgress < 0.48;

  const { positions, randomness, scales, streamIds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const streamIds = new Float32Array(count);

    const streams = 5;
    const perStream = Math.floor(count / streams);

    for (let s = 0; s < streams; s++) {
      const baseY = (s - 2) * 1.5;
      const baseZ = -55 + s * 2;
      for (let i = 0; i < perStream; i++) {
        const idx = s * perStream + i;
        const i3 = idx * 3;
        if (idx >= count) break;

        const t = (i / perStream) * 12 - 6;
        positions[i3] = t;
        positions[i3 + 1] =
          baseY + Math.sin(t * 0.8 + s) * 0.5 + (Math.random() - 0.5) * 0.3;
        positions[i3 + 2] =
          baseZ + Math.cos(t * 0.5 + s) * 0.8 + (Math.random() - 0.5) * 0.3;

        randomness[i3] = (Math.random() - 0.5) * 0.4;
        randomness[i3 + 1] = (Math.random() - 0.5) * 0.4;
        randomness[i3 + 2] = (Math.random() - 0.5) * 0.4;

        scales[idx] = 0.3 + Math.random() * 0.5;
        streamIds[idx] = s;
      }
    }
    return { positions, randomness, scales, streamIds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: COLORS.forge.clone() },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!visible || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group position={[0, 0, -60]}>
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
            attribute vec3 aRandomness;
            attribute float aScale;
            varying float vAlpha;
            void main() {
              vec3 pos = position;
              pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.2;
              pos += aRandomness * sin(uTime * 0.4 + pos.x) * 0.3;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = max(1.0, 2.0 * aScale * (200.0 / -mvPosition.z));
              float dist = length(mvPosition.xyz);
              vAlpha = smoothstep(50.0, 3.0, dist) * (0.1 + 0.25 * aScale);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
              float d = length(gl_PointCoord - vec2(0.5));
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
              vec3 col = mix(uColor, vec3(1.0, 0.6, 0.2), smoothstep(0.2, 0.0, d));
              gl_FragColor = vec4(col, alpha);
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
