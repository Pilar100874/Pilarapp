import {
  Plane,
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { DoubleSide, Mesh, Group } from "three";
import { OpenerText } from "@/components/opener/openerText";

type VideoPlane = {
  texturePath: string;
};

export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  const ref = useRef<Group>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const initialY = -15; // Start position further down
  const targetY = 0; // Final position at top

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false, // Don't start playing immediately
  });

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 1.5; // Animation duration in seconds
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    // Animate position from bottom to top
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    // Start video when animation is almost complete
    if (progress >= 0.8 && !videoStarted) {
      setVideoStarted(true);
      (videoTexture.source.data as HTMLVideoElement).play();
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