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
import { useEffect, useState, useCallback, useRef } from 'react';

export const Scene = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);
  const scrollingRef = useRef(false);
  const frameRef = useRef<number>();

  const handleResize = useCallback(() => {
    setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      scrollingRef.current = false;
      velocityRef.current = 0;
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaY = touch.clientY - lastTouchRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      if (!scrollingRef.current && Math.abs(deltaY) > 10) {
        scrollingRef.current = true;
      }
      
      if (scrollingRef.current) {
        velocityRef.current = deltaY / deltaTime;
      }
      
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      if (scrollingRef.current && Math.abs(velocityRef.current) > 0.1) {
        const decay = () => {
          velocityRef.current *= 0.95;
          
          if (Math.abs(velocityRef.current) > 0.01) {
            frameRef.current = requestAnimationFrame(decay);
          }
        };
        
        frameRef.current = requestAnimationFrame(decay);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleResize]);

  const damping = orientation === 'portrait' ? 0.85 : 0.65;
  const distance = orientation === 'portrait' ? 0.6 : 0.45;

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
        left: 0,
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
      gl={{ 
        antialias: false,
        powerPreference: 'high-performance'
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