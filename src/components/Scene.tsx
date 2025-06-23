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
import { useEffect, useState, useRef } from 'react';

export const Scene = () => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);

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

  // Auto-start music when Scene component mounts
  useEffect(() => {
    if (!musicStarted) {
      // Initialize audio
      audioRef.current = new Audio('/musica.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
      audioRef.current.preload = 'auto';

      const startMusic = async () => {
        if (audioRef.current) {
          try {
            console.log('Auto-starting music in opener...');
            await audioRef.current.play();
            console.log('Music started successfully in opener');
            setMusicStarted(true);
          } catch (error) {
            console.warn('Failed to auto-start music:', error);
            // Try again after a short delay
            setTimeout(async () => {
              try {
                if (audioRef.current) {
                  await audioRef.current.play();
                  console.log('Music started on retry in opener');
                  setMusicStarted(true);
                }
              } catch (retryError) {
                console.error('Music start retry failed in opener:', retryError);
              }
            }, 500);
          }
        }
      };

      // Start music immediately
      startMusic();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [musicStarted]);

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