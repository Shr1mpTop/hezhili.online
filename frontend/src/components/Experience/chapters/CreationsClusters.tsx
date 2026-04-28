import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../../../utils/colors";

interface Props {
  scrollProgress: number;
}

export default function CreationsClusters({ scrollProgress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 4000;

  const visible = scrollProgress > 0.35 && scrollProgress < 0.6;

  const { positions, randomness, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    // 3 main clusters for featured projects + scattered for others
    const clusters = [
      { cx: -4, cy: 0.5, cz: 0, r: 2.5, count: 800 },
      { cx: 0, cy: 0, cz: 0, r: 3, count: 1000 },
      { cx: 4, cy: -0.5, cz: 0, r: 2.5, count: 800 },
    ];

    let offset = 0;
    for (const cluster of clusters) {
      for (let i = 0; i < cluster.count && offset < count; i++) {
        const i3 = offset * 3;
        const r = cluster.r * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = cluster.cx + r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = cluster.cy + r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = cluster.cz + r * Math.cos(phi);

        randomness[i3] = (Math.random() - 0.5) * 2;
        randomness[i3 + 1] = (Math.random() - 0.5) * 2;
        randomness[i3 + 2] = (Math.random() - 0.5) * 2;

        scales[offset] = 0.3 + Math.random() * 0.7;
        offset++;
      }
    }

    // Remaining scattered particles
    while (offset < count) {
      const i3 = offset * 3;
      positions[i3] = (Math.random() - 0.5) * 16;
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;

      randomness[i3] = (Math.random() - 0.5) * 2;
      randomness[i3 + 1] = (Math.random() - 0.5) * 2;
      randomness[i3 + 2] = (Math.random() - 0.5) * 2;

      scales[offset] = 0.1 + Math.random() * 0.3;
      offset++;
    }

    return { positions, randomness, scales };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: COLORS.creations.clone() },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!visible || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group position={[0, 0, -85]}>
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
              pos += aRandomness * sin(uTime * 0.25 + position.x * 0.3) * 0.15;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = max(1.0, 1.8 * aScale * (200.0 / -mvPosition.z));
              float dist = length(mvPosition.xyz);
              vAlpha = smoothstep(50.0, 3.0, dist) * (0.08 + 0.25 * aScale);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
              float d = length(gl_PointCoord - vec2(0.5));
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
              gl_FragColor = vec4(uColor, alpha);
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
