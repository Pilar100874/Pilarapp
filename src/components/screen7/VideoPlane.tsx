import {
  Plane,
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { DoubleSide, Mesh } from "three";
import { OpenerText } from "@/components/screen7/openerText";

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

  return (
    <Suspense fallback={null}>
      <Plane
        ref={ref}
        scale={scale}
        material-side={DoubleSide}
        material-map={videoTexture}
        position-y={-34}
      />
      <OpenerText py={-33.5} />
    </Suspense>
  );
};