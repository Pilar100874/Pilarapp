import { Environment, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { Opener } from '@/components/opener';
import { Screen2 } from '@/components/screen2';
import { Screen3 } from '@/components/screen3';
import { Screen4 } from '@/components/screen4';
import { Screen6 } from '@/components/screen6';
import { Screen7 } from '@/components/screen7';
import { Screen8 } from '@/components/screen8';
import { Screen10 } from '@/components/screen10';

interface SceneProps {
  isMobile: boolean;
}

export const Scene = ({ isMobile }: SceneProps) => {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ 
        fov: isMobile ? 75 : 60,
        position: [0, 0, isMobile ? 8 : 5]
      }}
    >
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls 
        pages={isMobile ? 12 : 10} 
        damping={0.35} 
        distance={isMobile ? 0.5 : 0.25}
      >
        <Opener isMobile={isMobile} />
        <Screen2 isMobile={isMobile} />
        <Screen3 isMobile={isMobile} />
        <Screen4 isMobile={isMobile} />
        <Screen6 isMobile={isMobile} />
        <Screen8 isMobile={isMobile} />
        <Screen7 isMobile={isMobile} />
        <Screen10 isMobile={isMobile} />
      </ScrollControls>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
    </Canvas>
  );
};