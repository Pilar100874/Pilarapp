import { Canvas, useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Suspense, useEffect, useState } from 'react';
import { TextureLoader, VideoTexture } from 'three';
import { dataPhotos as screen3Photos } from '@/components/screen3/dataPhotos';
import { dataPhotos as screen6Photos } from '@/components/screen6/dataPhotos';
import { dataPhotos as screen8Photos } from '@/components/screen8/dataPhotos';
import { PWAInstallButton } from './PWAInstallButton';

const AssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Load essential images first
        const essentialImages = [
          '/logo_branco.png',
          '/iniciar.png',
          '/seta_B.png',
        ];

        // Create promises for essential image loads
        const essentialPromises = essentialImages.map(url => 
          new Promise((resolve, reject) => {
            const loader = new TextureLoader();
            loader.load(
              url, 
              resolve,
              undefined,
              (error) => {
                console.warn(`Failed to load ${url}:`, error);
                resolve(null); // Don't fail completely
              }
            );
          })
        );

        // Wait for essential assets
        await Promise.all(essentialPromises);
        
        // Load other assets in background (non-blocking)
        const otherImages = [
          ...Object.values(screen3Photos),
          ...Object.values(screen6Photos),
          ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
        ];

        // Load other images without blocking
        otherImages.forEach(url => {
          const loader = new TextureLoader();
          loader.load(url, () => {}, undefined, (error) => {
            console.warn(`Failed to load ${url}:`, error);
          });
        });

        // Preload video (non-blocking)
        try {
          const video = document.createElement('video');
          video.src = '/opener.mp4';
          video.preload = 'metadata';
          video.load();
        } catch (error) {
          console.warn('Video preload failed:', error);
        }

        // Preload audio (non-blocking)
        try {
          const audio = new Audio('/musica.mp3');
          audio.preload = 'metadata';
          audio.load();
        } catch (error) {
          console.warn('Audio preload failed:', error);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Asset loading failed:', error);
        // Don't block the app, just proceed
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return null;
};

// Loading fallback component
const LoadingFallback = () => (
  <mesh>
    <planeGeometry args={[2, 1]} />
    <meshBasicMaterial color="white" transparent opacity={0.1} />
  </mesh>
);

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  const [canvasError, setCanvasError] = useState(false);

  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error);
    setCanvasError(true);
  };

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
          <p>Carregando experiência...</p>
          <button 
            onClick={onStart}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Iniciar
          </button>
        </div>
        <PWAInstallButton />
      </div>
    );
  }

  return (
    <>
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
          <AssetPreloader />
          <LandingPage onStart={onStart} />
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
      </Canvas>
      
      {/* PWA Install Button - positioned below shop icon for mobile/tablet */}
      <PWAInstallButton />
    </>
  );
};