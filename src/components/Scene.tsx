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
import { Screen11 } from '@/components/screen11';
import { useEffect, useState } from 'react';

export const Scene = () => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleResize = () => {
      const newAspectRatio = window.innerWidth / window.innerHeight;
      setAspectRatio(newAspectRatio);
      setOrientation(newAspectRatio > 1 ? 'landscape' : 'portrait');
    };

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Adjust damping and distance based on aspect ratio and orientation
  const isLandscape = orientation === 'landscape';
  const isMobile = aspectRatio < 1.5; // More conservative mobile detection
  
  // Enhanced scroll controls based on device and orientation
  const damping = isMobile 
    ? (isLandscape ? 0.6 : 0.5) // More damping in mobile landscape
    : 0.35;
    
  const distance = isMobile 
    ? (isLandscape ? 0.4 : 0.35) // More distance in mobile landscape
    : 0.25;

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls pages={11} damping={damping} distance={distance}>
        <Opener />
        <Screen2 />
        <Screen3 />
        <Screen4 />
        <Screen6 />
        <Screen8 />
        <Screen7 />
        <Screen9 />
        <Screen10 />
        <Screen11 />
      </ScrollControls>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};