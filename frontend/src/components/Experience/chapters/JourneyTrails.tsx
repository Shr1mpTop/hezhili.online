import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  scrollProgress: number;
}

export default function JourneyTrails({ scrollProgress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 3500;

  const visible = scrollProgress > 0.52 && scrollProgress < 0.75;

  const { positions, randomness, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const trails = 5;
    const perTrail = Math.floor(count / trails);

    for (let t = 0; t < trails; t++) {
      for (let i = 0; i < perTrail; i++) {
        const idx = t * perTrail + i;
        if (idx >= count) break;
        const i3 = idx * 3;

        const progress = i / perTrail;
        // Trail stretches along Z axis into the distance
        positions[i3] =
          (t - 2) * 1.2 + Math.sin(progress * 4 + t) * 0.8;
        positions[i3 + 1] =
          Math.sin(progress * 3 + t * 2) * 0.5 + (Math.random() - 0.5) * 0.3;
        positions[i3 + 2] = -progress * 20 + (Math.random() - 0.5) * 0.4;

        randomness[i3] = (Math.random() - 0.5) * 0.5;
        randomness[i3 + 1] = (Math.random() - 0.5) * 0.5;
        randomness[i3 + 2] = (Math.random() - 0.5) * 0.5;

        scales[idx] = 0.2 + Math.random() * 0.5;
      }
    }

    return { positions, randomness, scales };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!visible || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group position={[0, 0, -100]}>
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
            varying float vMix;
            void main() {
              vec3 pos = position;
              pos += aRandomness * sin(uTime * 0.2 + position.z * 0.1) * 0.2;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = max(1.0, 1.5 * aScale * (180.0 / -mvPosition.z));
              float dist = length(mvPosition.xyz);
              vAlpha = smoothstep(60.0, 3.0, dist) * (0.08 + 0.25 * aScale);
              vMix = smoothstep(-20.0, 0.0, position.z);
            }
          `}
          fragmentShader={`
            varying float vAlpha;
            varying float vMix;
            void main() {
              float d = length(gl_PointCoord - vec2(0.5));
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
              vec3 warm = vec3(0.91, 0.63, 0.29);
              vec3 cool = vec3(0.36, 0.56, 0.73);
              vec3 col = mix(cool, warm, vMix);
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
