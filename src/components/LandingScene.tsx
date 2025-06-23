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
        // Load all images with error handling
        const imageUrls = [
          ...Object.values(screen3Photos),
          ...Object.values(screen6Photos),
          ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
          '/logo_branco.png',
          '/seta_B.png',
        ];

        // Create promises for all image loads with error handling
        const imagePromises = imageUrls.map(url => 
          new Promise((resolve) => {
            const loader = new TextureLoader();
            loader.load(
              url, 
              resolve, // success
              undefined, // progress
              () => {
                console.warn(`Failed to load image: ${url}`);
                resolve(null); // resolve even on error to prevent hanging
              }
            );
          })
        );

        // Load video with error handling
        const videoPromise = new Promise((resolve) => {
          const video = document.createElement('video');
          video.src = '/opener.mp4';
          video.muted = true; // Important for mobile autoplay
          video.playsInline = true; // Important for iOS
          video.preload = 'metadata';
          
          const handleLoad = () => {
            try {
              new VideoTexture(video);
            } catch (error) {
              console.warn('Video texture creation failed:', error);
            }
            resolve(null);
          };
          
          const handleError = () => {
            console.warn('Video load failed');
            resolve(null);
          };
          
          video.addEventListener('loadedmetadata', handleLoad, { once: true });
          video.addEventListener('error', handleError, { once: true });
          
          // Timeout fallback
          setTimeout(() => {
            resolve(null);
          }, 3000);
          
          video.load();
        });

        // Preload audio with error handling
        const audioPromise = new Promise((resolve) => {
          const audio = new Audio('/musica.mp3');
          audio.preload = 'none'; // Don't preload on mobile to save bandwidth
          
          const handleLoad = () => resolve(null);
          const handleError = () => {
            console.warn('Audio preload failed');
            resolve(null);
          };
          
          // Only try to preload on desktop
          if (window.innerWidth > 768) {
            audio.addEventListener('canplaythrough', handleLoad, { once: true });
            audio.addEventListener('error', handleError, { once: true });
            audio.load();
          } else {
            resolve(null); // Skip audio preload on mobile
          }
          
          // Timeout fallback
          setTimeout(() => {
            resolve(null);
          }, 2000);
        });

        // Wait for all assets to load with timeout
        await Promise.race([
          Promise.all([...imagePromises, videoPromise, audioPromise]),
          new Promise(resolve => setTimeout(resolve, 5000)) // 5 second timeout
        ]);
        
      } catch (error) {
        console.warn('Asset preloading failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return null;
};

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => {
  console.error('Canvas error:', error);
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>Carregando experiência...</h2>
      <p>Por favor, aguarde um momento.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
};

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  const [hasError, setHasError] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      setHasError(true);
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsCanvasReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return <ErrorFallback error={new Error('WebGL not supported')} />;
  }

  if (!isCanvasReady) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Canvas 
        style={{ width: '100vw', height: '100vh' }}
        gl={{ 
          antialias: false, // Disable for better mobile performance
          alpha: false,
          powerPreference: 'high-performance'
        }}
        camera={{ 
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5]
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setHasError(true);
        }}
      >
        <color attach="background" args={[new Color('black')]} />
        <Suspense fallback={null}>
          <AssetPreloader />
          <LandingPage onStart={onStart} />
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
      </Canvas>
      
      {/* PWA Install Button - positioned below shop icon for mobile/tablet */}
      <PWAInstallButton />
    </>
  );
};