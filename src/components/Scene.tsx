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
import { useEffect, useState, Suspense } from 'react';

// Loading fallback component
const LoadingFallback = () => (
  <mesh>
    <planeGeometry args={[2, 1]} />
    <meshBasicMaterial color="white" transparent opacity={0.1} />
  </mesh>
);

export const Scene = () => {
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [canvasError, setCanvasError] = useState(false);

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

  const handleCanvasError = (error: any) => {
    console.error('Scene Canvas error:', error);
    setCanvasError(true);
  };

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

  if (canvasError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h2>Pilar Comercial e Serviços</h2>
          <p>Experiência em carregamento...</p>
          <p>Toque para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas 
      style={{ width: '100vw', height: '100vh' }}
      onError={handleCanvasError}
      dpr={[1, 2]} // Limit pixel ratio for better mobile performance
      performance={{ min: 0.5 }} // Allow lower performance on mobile
      gl={{ 
        antialias: false, // Disable antialiasing for better mobile performance
        alpha: false,
        powerPreference: "default" // Use default power preference
      }}
    >
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
    </Canvas>
  );
};