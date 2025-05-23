import { Box, Environment, OrbitControls, Plane, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { Opener } from '@/components/opener';
import { Screen2 } from '@/components/screen2';
import { Screen4 } from '@/components/screen4';

export const Scene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ScrollControls pages={5}>
        <color attach="background" args={[new Color('black')]} />
        <Opener />
        <Screen2 />
        <group position-y={-16}>
          <Opener />
        </group>
        <Screen4 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};