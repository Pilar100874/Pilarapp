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
import { Screen9 } from '@/components/screen9';
import { Screen10 } from '@/components/screen10';
import { useEffect, useState } from 'react';

export const Scene = () => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust damping and distance based on aspect ratio
  const damping = aspectRatio < 1 ? 0.5 : 0.35; // More damping on mobile
  const distance = aspectRatio < 1 ? 0.35 : 0.25; // More distance on mobile

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls pages={10} damping={damping} distance={distance}>
        <Opener />
        <Screen2 />
        <Screen3 />
        <Screen4 />
        <Screen6 />
        <Screen8 />
        <Screen7 />
        <Screen9 />
        <Screen10 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};