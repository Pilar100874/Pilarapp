import { Environment, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { Opener } from '@/components/opener';
import { Screen2 } from '@/components/screen2';
import { Screen3 } from '@/components/screen3';
import { Screen4 } from '@/components/screen4';
import { Screen5 } from '@/components/screen5';
import { Screen6 } from '@/components/screen6';
import { Screen7 } from '@/components/screen7';

export const Scene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls pages={7} damping={0.35} distance={0.25}>
        <Opener />
        <Screen2 />
        <Screen3 />
        <Screen4 />
        <Screen5 />
        <Screen6 />
        <Screen7 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};