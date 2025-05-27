import {
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { DoubleSide, Mesh } from "three";
import { OpenerText } from "@/components/screen7/openerText";
import { Plane } from "@react-three/drei";

type VideoPlane = {
  texturePath: string;
};

export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  // Reduce the size by 30%
  const scale = windowSize.map(size => size * 0.7);

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: true,
  });

  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = scroll.offset * 2.5;
  });

  // Move up by 2cm (20 units)
  const baseY = -58.5 + 2;
  const textY = -58 + 2;

  return (
    <Suspense fallback={null}>
      <Plane
        ref={ref}
        scale={[scale[0], scale[1], 1]}
        material-side={DoubleSide}
        material-map={videoTexture}
        position-y={baseY}
      />
      <OpenerText py={textY} />
    </Suspense>
  );
};