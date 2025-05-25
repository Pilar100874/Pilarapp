import {
  Plane,
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { DoubleSide, Mesh } from "three";
import { OpenerText } from "@/components/opener/openerText";

type VideoPlane = {
  texturePath: string;
};

export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  const ref = useRef<Mesh>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const initialY = -20; // Start from further down
  const targetY = 0; // End at the top

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false, // Don't start playing immediately
  });

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 2; // Animation duration in seconds
    const progress = Math.min(elapsed / duration, 1);
    
    // Custom easing function for smooth motion
    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };
    
    const easedProgress = easeOutExpo(progress);
    
    // Animate position from bottom to top
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    // Start video when animation is 80% complete
    if (progress >= 0.8 && !videoStarted) {
      setVideoStarted(true);
      (videoTexture.source.data as HTMLVideoElement).play();
    }

    // Add slight rotation based on scroll
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