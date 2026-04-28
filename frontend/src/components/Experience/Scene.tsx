import CameraPath from "./CameraPath";
import PostProcessing from "./PostProcessing";
import OriginParticles from "./chapters/OriginParticles";
import GenesisCrystals from "./chapters/GenesisCrystals";
import ForgeStreams from "./chapters/ForgeStreams";
import CreationsClusters from "./chapters/CreationsClusters";
import JourneyTrails from "./chapters/JourneyTrails";
import ConnectBroadcast from "./chapters/ConnectBroadcast";

interface Props {
  scrollProgress: number;
}

export default function Scene({ scrollProgress }: Props) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <CameraPath scrollProgress={scrollProgress} />

      <OriginParticles scrollProgress={scrollProgress} />
      <GenesisCrystals scrollProgress={scrollProgress} />
      <ForgeStreams scrollProgress={scrollProgress} />
      <CreationsClusters scrollProgress={scrollProgress} />
      <JourneyTrails scrollProgress={scrollProgress} />
      <ConnectBroadcast scrollProgress={scrollProgress} />

      <PostProcessing />
    </>
  );
}
