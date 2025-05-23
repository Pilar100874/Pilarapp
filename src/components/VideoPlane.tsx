import {
  Plane,
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { DoubleSide, Mesh } from "three";
import { OpenerText } from "@/components/opener/openerText";

type VideoPlane = {
  texturePath: string;
};
export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);

  const videoTexture = useVideoTexture("https://player.vimeo.com/external/367920624.hd.mp4?s=e4e6e6f9f6e2b1f7f3a54a0b3d7c4f7f7f7f7f7&profile_id=174", {
    autoplay: true,
    loop: true,
    muted: true,
    crossOrigin: "anonymous",
  });

  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = scroll.offset * 2.5;
  });

  return (
    <Suspense fallback={null}>
      <Plane
        ref={ref}
        scale={[...windowSize]}
        material-side={DoubleSide}
        material-map={videoTexture}
      />
      <OpenerText py={0.5} />
    </Suspense>
  );
};