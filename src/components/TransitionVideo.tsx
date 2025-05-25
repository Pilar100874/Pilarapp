import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { Plane, useAspect, useVideoTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import { Mesh } from 'three';

type TransitionVideoProps = {
  onTransitionComplete: () => void;
};

const VideoPlane = ({ onTransitionComplete }: TransitionVideoProps) => {
  const windowSize = useAspect(1920, 1080);
  const videoTexture = useVideoTexture('opener.mp4', { autoplay: true });
  const ref = useRef<Mesh>(null);
  const animationStarted = useRef(false);

  useFrame(() => {
    if (!ref.current) return;

    if (!animationStarted.current) {
      animationStarted.current = true;
      ref.current.position.y = 0;
    }

    if (ref.current.position.y < 10) {
      ref.current.position.y += 0.1;
    } else {
      onTransitionComplete();
    }
  });

  return (
    <Plane
      ref={ref}
      scale={windowSize}
      material-map={videoTexture}
    />
  );
};

export const TransitionVideo = ({ onTransitionComplete }: TransitionVideoProps) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={null}>
        <VideoPlane onTransitionComplete={onTransitionComplete} />
      </Suspense>
    </Canvas>
  );
};