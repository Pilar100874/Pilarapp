import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Suspense, useEffect, useState } from 'react';
import { TextureLoader, VideoTexture } from 'three';
import { dataPhotos as screen3Photos } from '@/components/screen3/dataPhotos';
import { dataPhotos as screen6Photos } from '@/components/screen6/dataPhotos';
import { dataPhotos as screen8Photos } from '@/components/screen8/dataPhotos';

const AssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Load all images
        const imageUrls = [
          ...Object.values(screen3Photos),
          ...Object.values(screen6Photos),
          ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
          '/logo_branco.png',
          '/seta_B.png',
        ];

        // Create promises for all image loads with proper error handling
        const imagePromises = imageUrls.map(url => 
          new Promise((resolve, reject) => {
            const loader = new TextureLoader();
            loader.load(
              url,
              (texture) => resolve(texture),
              undefined,
              (error) => {
                console.warn(`Failed to load texture: ${url}`, error);
                resolve(null); // Resolve with null instead of rejecting to prevent blocking
              }
            );
          })
        );

        // Load video with error handling
        const videoPromise = new Promise((resolve) => {
          const video = document.createElement('video');
          video.src = '/opener.mp4';
          video.load();
          
          const onLoadedData = () => {
            try {
              new VideoTexture(video);
              resolve(null);
            } catch (error) {
              console.warn('Failed to create video texture:', error);
              resolve(null);
            }
          };
          
          const onError = () => {
            console.warn('Failed to load video:', video.src);
            resolve(null);
          };
          
          video.onloadeddata = onLoadedData;
          video.onerror = onError;
        });

        // Preload audio with error handling
        const audioPromise = new Promise((resolve) => {
          const audio = new Audio('/musica.mp3');
          
          const onCanPlayThrough = () => resolve(null);
          const onError = () => {
            console.warn('Failed to load audio:', audio.src);
            resolve(null);
          };
          
          audio.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
          audio.addEventListener('error', onError, { once: true });
          audio.load();
        });

        // Wait for all assets to load (or fail gracefully)
        await Promise.all([...imagePromises, videoPromise, audioPromise]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error during asset preloading:', error);
        setIsLoading(false); // Continue even if preloading fails
      }
    };

    loadAssets();
  }, []);

  return null;
};

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={null}>
        <AssetPreloader />
        <LandingPage onStart={onStart} />
      </Suspense>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};