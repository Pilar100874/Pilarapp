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

interface VideoPlaneProps {
  texturePath: string;
  isMobile: boolean;
}

export const VideoPlane = ({ texturePath, isMobile }: VideoPlaneProps) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  const ref = useRef<Group>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const initialY = isMobile ? -12 : -15;
  const targetY = 0;

  const scale = windowSize.map(size => size * (isMobile ? 0.5 : 0.7));

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false,
  });

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 1.5;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    if (progress >= 0.8 && !videoStarted) {
      setVideoStarted(true);
      (videoTexture.source.data as HTMLVideoElement).play();
    }

    ref.current.rotation.y = scroll.offset * (isMobile ? 1.8 : 2.5);
  });

  return (
    <Suspense fallback={null}>
      <group ref={ref} position-y={initialY}>
        <Plane
          scale={scale}
          material-side={DoubleSide}
          material-map={videoTexture}
        />
        <OpenerText py={0.5} isMobile={isMobile} />
      </group>
    </Suspense>
  );
};