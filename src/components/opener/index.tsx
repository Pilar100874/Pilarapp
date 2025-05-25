import { Scroll } from "@react-three/drei";
import { VideoPlane } from "@/components/VideoPlane";

export const Opener = ({ scrollRef }) => {
  return (
    <Scroll>
      <VideoPlane texturePath="opener.mp4" scrollRef={scrollRef} />
    </Scroll>
  );
};