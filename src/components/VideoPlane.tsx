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
  const initialY = -10; // Starting position below the screen
  const targetY = 0; // Final position at the top

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: true,
  });

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 1.5; // Animation duration in seconds
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    // Animate only the video's position from bottom to top
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    // Maintain the rotation based on scroll
    ref.current.rotation.y = scroll.offset * 2.5;
  });

  return (
    <Suspense fallback={null}>
      <group>
        <Plane
          ref={ref}
          scale={windowSize}
          material-side={DoubleSide}
          material-map={videoTexture}
          position-y={initialY}
        />
        <OpenerText py={0.5} />
      </group>
    </Suspense>
  );
};