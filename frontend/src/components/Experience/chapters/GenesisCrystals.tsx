import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../../../utils/colors";

interface Props {
  scrollProgress: number;
}

export default function GenesisCrystals({ scrollProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 2500;

  const visible = scrollProgress > 0.1 && scrollProgress < 0.35;

  const { positions, randomness, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Crystal-like distribution - along edges of polyhedra
      const face = Math.floor(Math.random() * 6);
      const u = (Math.random() - 0.5) * 6;
      const v = (Math.random() - 0.5) * 6;
      const r = 2 + Math.random() * 4;

      switch (face) {
        case 0:
          positions[i3] = r;
          positions[i3 + 1] = u;
          positions[i3 + 2] = v;
          break;
        case 1:
          positions[i3] = -r;
          positions[i3 + 1] = u;
          positions[i3 + 2] = v;
          break;
        case 2:
          positions[i3] = u;
          positions[i3 + 1] = r;
          positions[i3 + 2] = v;
          break;
        case 3:
          positions[i3] = u;
          positions[i3 + 1] = -r;
          positions[i3 + 2] = v;
          break;
        case 4:
          positions[i3] = u;
          positions[i3 + 1] = v;
          positions[i3 + 2] = r;
          break;
        default:
          positions[i3] = u;
          positions[i3 + 1] = v;
          positions[i3 + 2] = -r;
      }

      randomness[i3] = (Math.random() - 0.5) * 1.5;
      randomness[i3 + 1] = (Math.random() - 0.5) * 1.5;
      randomness[i3 + 2] = (Math.random() - 0.5) * 1.5;

      scales[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions, randomness, scales };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: COLORS.genesis.clone() },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.1;

    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group position={[0, 2, -30]} ref={groupRef}>
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
            varying float vAlpha;
            attribute vec3 aRandomness;
            attribute float aScale;
            void main() {
              vec3 pos = position + aRandomness * sin(uTime * 0.15 + position.y * 0.2) * 0.3;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              gl_PointSize = max(1.0, 1.8 * aScale * (180.0 / -mvPosition.z));
              float dist = length(mvPosition.xyz);
              vAlpha = smoothstep(50.0, 3.0, dist) * (0.06 + 0.2 * aScale);
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

      {/* Wireframe crystals */}
      {visible && (
        <>
          <mesh rotation={[0.3, 0.5, 0.2]}>
            <icosahedronGeometry args={[3, 1]} />
            <meshBasicMaterial
              color="#5b8fb9"
              wireframe
              transparent
              opacity={0.08}
            />
          </mesh>
          <mesh rotation={[-0.2, -0.3, 0.1]} position={[2, 1, -1]}>
            <octahedronGeometry args={[2, 0]} />
            <meshBasicMaterial
              color="#7ab0d4"
              wireframe
              transparent
              opacity={0.06}
            />
          </mesh>
          <mesh rotation={[0.1, 0.8, -0.3]} position={[-1.5, -0.5, 1]}>
            <dodecahedronGeometry args={[1.8, 0]} />
            <meshBasicMaterial
              color="#4a7fa8"
              wireframe
              transparent
              opacity={0.05}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
