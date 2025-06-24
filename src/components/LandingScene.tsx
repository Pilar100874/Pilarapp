import { Canvas, useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Suspense, useEffect, useState } from 'react';
import { TextureLoader, VideoTexture } from 'three';
import { dataPhotos as screen3Photos } from '@/components/screen3/dataPhotos';
import { dataPhotos as screen6Photos } from '@/components/screen6/dataPhotos';
import { dataPhotos as screen8Photos } from '@/components/screen8/dataPhotos';

const AssetPreloader = ({ onProgress }: { onProgress: (progress: number) => void }) => {
  useEffect(() => {
    const loadAssets = async () => {
      // Collect all asset URLs
      const imageUrls = [
        ...Object.values(screen3Photos),
        ...Object.values(screen6Photos),
        ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
        '/logo_branco.png',
        '/seta_B.png',
        '/iniciar.png',
        '/loja.png',
        '/play.png',
        '/assai.png',
        '/kalunga.png',
        '/latam.png',
        '/leroy.png',
        '/tintasmc.png',
        '/telha.png',
      ];

      const totalAssets = imageUrls.length + 2; // +2 for video and audio
      let loadedAssets = 0;

      const updateProgress = () => {
        loadedAssets++;
        const progress = (loadedAssets / totalAssets) * 100;
        onProgress(progress);
      };

      // Load all images
      const imagePromises = imageUrls.map(url => 
        new Promise((resolve) => {
          const loader = new TextureLoader();
          loader.load(
            url, 
            () => {
              updateProgress();
              resolve(null);
            },
            undefined,
            () => {
              // Even on error, count as loaded to prevent hanging
              updateProgress();
              resolve(null);
            }
          );
        })
      );

      // Load video
      const videoPromise = new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = '/opener.mp4';
        video.preload = 'metadata';
        
        const onVideoLoad = () => {
          updateProgress();
          resolve(null);
        };
        
        video.addEventListener('loadeddata', onVideoLoad, { once: true });
        video.addEventListener('error', onVideoLoad, { once: true });
        video.load();
      });

      // Load audio
      const audioPromise = new Promise((resolve) => {
        const audio = new Audio('/musica.mp3');
        audio.preload = 'metadata';
        
        const onAudioLoad = () => {
          updateProgress();
          resolve(null);
        };
        
        audio.addEventListener('canplaythrough', onAudioLoad, { once: true });
        audio.addEventListener('error', onAudioLoad, { once: true });
        audio.load();
      });

      // Wait for all assets to load
      await Promise.all([...imagePromises, videoPromise, audioPromise]);
    };

    loadAssets();
  }, [onProgress]);

  return null;
};

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleProgress = (progress: number) => {
    setLoadingProgress(progress);
  };

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={null}>
        <AssetPreloader onProgress={handleProgress} />
        <LandingPage onStart={onStart} loadingProgress={loadingProgress} />
      </Suspense>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};