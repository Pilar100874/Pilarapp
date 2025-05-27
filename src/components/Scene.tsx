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
    
    // Handle touch events
    let touchStartY = 0;
    let lastTouchY = 0;
    let scrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      scrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - lastTouchY;
      
      // Only prevent default if we determine this is a scroll gesture
      if (!scrolling && Math.abs(currentY - touchStartY) > 10) {
        scrolling = true;
      }
      
      if (scrolling) {
        e.preventDefault();
      }
      
      lastTouchY = currentY;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleResize]);

  // Adjust damping and distance based on orientation
  const damping = orientation === 'portrait' ? 0.75 : 0.55;
  const distance = orientation === 'portrait' ? 0.5 : 0.35;

  return (
    <Canvas 
      style={{ 
        width: '100vw', 
        height: '100vh',
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
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