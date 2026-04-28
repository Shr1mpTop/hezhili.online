import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

interface ExperienceCanvasProps {
  scrollProgress: number;
}

export default function ExperienceCanvas({
  scrollProgress,
}: ExperienceCanvasProps) {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 5] }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  );
}
