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
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const lastTouchRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const isScrollingRef = useRef(false);

  const handleResize = useCallback(() => {
    setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
      lastTouchRef.current = e.touches[0].clientY;
      velocityRef.current = 0;
      isScrollingRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaY = lastTouchRef.current - touch.clientY;
      
      if (!isScrollingRef.current && Math.abs(deltaY) > 5) {
        isScrollingRef.current = true;
      }

      if (isScrollingRef.current && scrollRef.current) {
        const scrollSpeed = deltaY * 2;
        scrollRef.current.scrollTop += scrollSpeed;
        velocityRef.current = scrollSpeed;
      }

      lastTouchRef.current = touch.clientY;
    };

    const handleTouchEnd = () => {
      if (isScrollingRef.current && Math.abs(velocityRef.current) > 1) {
        const decay = () => {
          if (!scrollRef.current) return;

          velocityRef.current *= 0.95;
          scrollRef.current.scrollTop += velocityRef.current;

          if (Math.abs(velocityRef.current) > 0.1) {
            animationFrameRef.current = requestAnimationFrame(decay);
          }
        };

        animationFrameRef.current = requestAnimationFrame(decay);
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

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize]);

  return (
    <div 
      ref={scrollRef}
      style={{ 
        width: '100vw', 
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        touchAction: 'none'
      }}
    >
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={[new Color('black')]} />
        <ScrollControls
          pages={10}
          damping={orientation === 'portrait' ? 0.85 : 0.65}
          distance={orientation === 'portrait' ? 0.6 : 0.45}
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
    </div>
  );
};