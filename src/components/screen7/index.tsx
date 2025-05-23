import { Scroll } from "@react-three/drei";
import { VideoPlane } from "@/components/screen7/VideoPlane";

export const Screen7 = () => {
  return (
    <Scroll>
      <VideoPlane texturePath="opener.mp4" />
    </Scroll>
  );
};