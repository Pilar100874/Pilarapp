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
import { useEffect, useState } from 'react';

export const Scene = () => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleResize = () => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      setAspectRatio(newAspectRatio);
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Adjust damping and distance based on orientation and aspect ratio
  const damping = orientation === 'portrait' ? 0.5 : 0.35;
  const distance = orientation === 'portrait' ? 0.35 : 0.25;

  return (
    <Canvas style={{ width: '100vw', height: '100vh', touchAction: 'none' }}>
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls pages={10} damping={damping} distance={distance} enabled>
        <Opener />
        <Screen2 />
        <Screen3 />
        <Screen4 />
        <Screen6 />
        <Screen8 />
        <Screen7 />
        <Screen10 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};