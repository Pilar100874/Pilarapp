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
import { useEffect, useState, useCallback } from 'react';

export const Scene = () => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  const [touchStartY, setTouchStartY] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleResize = useCallback(() => {
    const newAspectRatio = window.innerWidth / window.innerHeight;
    setAspectRatio(newAspectRatio);
    setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  // Touch handling for smooth scrolling
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    
    // Adjust sensitivity based on orientation
    const sensitivity = orientation === 'portrait' ? 0.002 : 0.001;
    const newPosition = scrollPosition + (deltaY * sensitivity);
    
    // Clamp scroll position between 0 and 1
    setScrollPosition(Math.max(0, Math.min(1, newPosition)));
    setTouchStartY(touchY);
  }, [touchStartY, scrollPosition, orientation]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [handleTouchStart, handleTouchMove]);

  // Adjust damping and distance based on orientation
  const damping = orientation === 'portrait' ? 0.5 : 0.35;
  const distance = orientation === 'portrait' ? 0.35 : 0.25;

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls 
        pages={10} 
        damping={damping} 
        distance={distance}
        enabled={true}
        infinite={false}
        eps={0.00001}
        horizontal={false}
      >
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