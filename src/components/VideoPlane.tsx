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
  const ref = useRef<Mesh>(null);
  const initialY = 0; // Changed from -10 to 0

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: true,
  });

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const targetY = 2; // Changed from 0 to 2 to position at top
    
    // Animate from bottom to top
    if (elapsed < 1) {
      ref.current.position.y = initialY + (targetY - initialY) * elapsed;
    }

    ref.current.rotation.y = scroll.offset * 2.5;
  });

  return (
    <Suspense fallback={null}>
      <group ref={ref} position-y={initialY}>
        <Plane
          scale={windowSize}
          material-side={DoubleSide}
          material-map={videoTexture}
        />
        <OpenerText py={0.5} />
      </group>
    </Suspense>
  );
};