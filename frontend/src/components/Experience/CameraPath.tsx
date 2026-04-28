import { useFrame, useThree } from "@react-three/fiber";
import { interpolateCamera } from "../../utils/cameraPath";

interface CameraPathProps {
  scrollProgress: number;
}

export default function CameraPath({ scrollProgress }: CameraPathProps) {
  const { camera } = useThree();

  useFrame(() => {
    const { position, quaternion } = interpolateCamera(scrollProgress);
    camera.position.lerp(position, 0.04);
    camera.quaternion.slerp(quaternion, 0.04);
  });

  return null;
}
