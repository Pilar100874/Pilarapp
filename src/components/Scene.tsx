import { Box, Environment, OrbitControls, Plane, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { Opener } from '@/components/opener';
import { Screen2 } from '@/components/screen2';
import { Screen3 } from '@/components/screen3';
import { Screen4 } from '@/components/screen4';
import { Screen5 } from '@/components/screen5';

export const Scene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ScrollControls pages={7}>
        <color attach="background" args={[new Color('black')]} />
        <Opener />
        <Screen2 />
        <Screen3 />
        <Screen4 />
        <Screen5 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};