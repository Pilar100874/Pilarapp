import { Scroll } from "@react-three/drei";
import { VideoPlane } from "@/components/VideoPlane";

interface OpenerProps {
  isMobile: boolean;
}

export const Opener = ({ isMobile }: OpenerProps) => {
  return (
    <Scroll>
      <VideoPlane texturePath="opener.mp4" isMobile={isMobile} />
    </Scroll>
  );
};