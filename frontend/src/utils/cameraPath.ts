import * as THREE from "three";

interface CameraKeyframe {
  progress: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

const keyframeData = [
  { progress: 0.0, pos: [0, 0, 5], rot: [0, 0, 0] },
  { progress: 0.12, pos: [0, 1.5, -20], rot: [-0.05, 0, 0] },
  { progress: 0.28, pos: [2, 0.5, -45], rot: [0, 0.1, 0] },
  { progress: 0.45, pos: [-1.5, 1, -70], rot: [0.03, -0.08, 0] },
  { progress: 0.62, pos: [0, -0.5, -95], rot: [0.04, 0, 0] },
  { progress: 0.8, pos: [0, 0, -120], rot: [0, 0, 0] },
  { progress: 1.0, pos: [0, 4, -145], rot: [-0.15, 0, 0] },
];

const keyframes: CameraKeyframe[] = keyframeData.map((kf) => {
  const position = new THREE.Vector3(...kf.pos);
  const euler = new THREE.Euler(...kf.rot);
  const quaternion = new THREE.Quaternion().setFromEuler(euler);
  return { progress: kf.progress, position, quaternion };
});

function findSegment(progress: number): [CameraKeyframe, CameraKeyframe, number] {
  let i = 0;
  for (; i < keyframes.length - 1; i++) {
    if (progress <= keyframes[i + 1].progress) break;
  }
  i = Math.min(i, keyframes.length - 2);
  const a = keyframes[i];
  const b = keyframes[i + 1];
  const t = (progress - a.progress) / (b.progress - a.progress);
  return [a, b, Math.max(0, Math.min(1, t))];
}

export function interpolateCamera(progress: number) {
  const [a, b, t] = findSegment(progress);
  const position = new THREE.Vector3().lerpVectors(a.position, b.position, t);
  const quaternion = new THREE.Quaternion().slerpQuaternions(
    a.quaternion,
    b.quaternion,
    t,
  );
  return { position, quaternion };
}

export const TOTAL_CHAPTERS = 6;

export function getChapterIndex(progress: number): number {
  return Math.min(
    Math.floor(progress * TOTAL_CHAPTERS),
    TOTAL_CHAPTERS - 1,
  );
}
