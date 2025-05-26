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
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);
  const scrollRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const isScrollingRef = useRef(false);
  const rafRef = useRef<number>();

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

  const updateScroll = useCallback(() => {
    if (!isScrollingRef.current) return;

    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    // Apply velocity with decay
    if (Math.abs(velocityRef.current) > 0.0001) {
      scrollRef.current = Math.max(0, Math.min(1, scrollRef.current + velocityRef.current * deltaTime));
      velocityRef.current *= 0.95; // Decay factor
    } else {
      isScrollingRef.current = false;
      velocityRef.current = 0;
    }

    rafRef.current = requestAnimationFrame(updateScroll);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
    isScrollingRef.current = false;
    velocityRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const deltaY = lastTouchY.current - touchY;
    
    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    // Calculate velocity based on touch movement
    if (deltaTime > 0) {
      velocityRef.current = (deltaY / window.innerHeight) * (orientation === 'portrait' ? 2 : 1) / deltaTime;
    }

    // Update scroll position
    const sensitivity = orientation === 'portrait' ? 0.002 : 0.001;
    scrollRef.current = Math.max(0, Math.min(1, scrollRef.current + deltaY * sensitivity));
    
    lastTouchY.current = touchY;
    isScrollingRef.current = true;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateScroll);
    }
  }, [orientation, updateScroll]);

  const handleTouchEnd = useCallback(() => {
    isScrollingRef.current = true;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Adjust damping and distance based on orientation
  const damping = orientation === 'portrait' ? 0.85 : 0.65;
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