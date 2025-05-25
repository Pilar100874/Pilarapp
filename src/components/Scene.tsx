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
import { useRef } from 'react';

export const Scene = () => {
  const openerRef = useRef();

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ScrollControls pages={9}>
        <color attach="background" args={[new Color('black')]} />
        <Opener />
        <Screen2 />
        <Screen3 />
        <Screen4 />
        <Screen6 />
        <Screen7 />
        <Screen8 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};