import { Canvas, useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Suspense, useEffect, useState } from 'react';
import { TextureLoader, VideoTexture } from 'three';
import { dataPhotos as screen3Photos } from '@/components/screen3/dataPhotos';
import { dataPhotos as screen6Photos } from '@/components/screen6/dataPhotos';
import { dataPhotos as screen8Photos } from '@/components/screen8/dataPhotos';
import { checkDeviceCompatibility, redirectToFallback } from '@/utils/deviceCompatibility';

const AssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Perform another compatibility check during asset loading
        if (!checkDeviceCompatibility()) {
          redirectToFallback();
          return;
        }

        // Load all images
        const imageUrls = [
          ...Object.values(screen3Photos),
          ...Object.values(screen6Photos),
          ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
          '/logo_branco.png',
          '/seta_B.png',
        ];

        // Create promises for all image loads with error handling
        const imagePromises = imageUrls.map(url => 
          new Promise((resolve, reject) => {
            const loader = new TextureLoader();
            loader.load(
              url, 
              resolve,
              undefined,
              (error) => {
                console.warn(`Failed to load image: ${url}`, error);
                resolve(null); // Don't fail the entire loading process
              }
            );
          })
        );

        // Load video with error handling
        const videoPromise = new Promise((resolve) => {
          try {
            const video = document.createElement('video');
            video.src = '/opener.mp4';
            video.muted = true;
            video.playsInline = true;
            video.load();
            video.onloadeddata = () => {
              try {
                new VideoTexture(video);
                resolve(null);
              } catch (error) {
                console.warn('Video texture creation failed:', error);
                resolve(null);
              }
            };
            video.onerror = () => {
              console.warn('Video loading failed');
              resolve(null);
            };
          } catch (error) {
            console.warn('Video setup failed:', error);
            resolve(null);
          }
        });

        // Preload audio with error handling
        const audioPromise = new Promise((resolve) => {
          try {
            const audio = new Audio('/musica.mp3');
            audio.addEventListener('canplaythrough', () => resolve(null), { once: true });
            audio.addEventListener('error', () => {
              console.warn('Audio loading failed');
              resolve(null);
            }, { once: true });
            audio.load();
          } catch (error) {
            console.warn('Audio setup failed:', error);
            resolve(null);
          }
        });

        // Wait for all assets to load (with timeout)
        const loadingTimeout = setTimeout(() => {
          console.warn('Asset loading timeout - proceeding anyway');
          setIsLoading(false);
        }, 10000); // 10 second timeout

        await Promise.all([...imagePromises, videoPromise, audioPromise]);
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      } catch (error) {
        console.error('Asset loading failed:', error);
        // Check if we should redirect due to loading failures
        if (!checkDeviceCompatibility()) {
          redirectToFallback();
        } else {
          setIsLoading(false); // Continue anyway
        }
      }
    };

    loadAssets();
  }, []);

  return null;
};

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  // Add error boundary for Canvas
  const [canvasError, setCanvasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Canvas error detected:', error);
      if (error.message?.includes('WebGL') || error.message?.includes('canvas')) {
        setCanvasError(true);
        redirectToFallback();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

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
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Redirecionando para a loja...</p>
          <p>Redirecting to store...</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <Canvas style={{ width: '100vw', height: '100vh' }} onCreated={(state) => {
        // Additional WebGL compatibility check
        if (!state.gl) {
          console.error('WebGL context not available');
          redirectToFallback();
        }
      }}>
        <color attach="background" args={[new Color('black')]} />
        <Suspense fallback={null}>
          <AssetPreloader />
          <LandingPage onStart={onStart} />
        </Suspense>
        <ambientLight />
        <directionalLight />
      </Canvas>
    );
  } catch (error) {
    console.error('Canvas creation failed:', error);
    redirectToFallback();
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'black', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Redirecionando para a loja...</p>
          <p>Redirecting to store...</p>
        </div>
      </div>
    );
  }
};