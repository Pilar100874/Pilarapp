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
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  const handleResize = useCallback(() => {
    setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Prevent default touch behavior
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    document.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('touchmove', preventDefaultTouch);
      document.removeEventListener('touchstart', preventDefaultTouch);
    };
  }, [handleResize]);

  // Adjust damping and distance based on orientation
  const damping = orientation === 'portrait' ? 0.85 : 0.65;
  const distance = orientation === 'portrait' ? 0.35 : 0.25;

  return (
    <Canvas 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onTouchMove={(e) => e.preventDefault()}
    >
      <color attach="background" args={[new Color('black')]} />
      <ScrollControls 
        pages={10} 
        damping={damping} 
        distance={distance}
        enabled={true}
        infinite={false}
        eps={0.001}
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