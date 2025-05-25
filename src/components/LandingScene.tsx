import { Canvas, useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Suspense, useEffect, useState } from 'react';
import { TextureLoader, VideoTexture } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { dataPhotos as screen3Photos } from '@/components/screen3/dataPhotos';
import { dataPhotos as screen6Photos } from '@/components/screen6/dataPhotos';
import { dataPhotos as screen8Photos } from '@/components/screen8/dataPhotos';

const AssetPreloader = ({ onProgress }: { onProgress: (progress: number) => void }) => {
  useEffect(() => {
    const loadAssets = async () => {
      const imageUrls = [
        ...Object.values(screen3Photos),
        ...Object.values(screen6Photos),
        ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
        '/logo_branco.png',
        '/seta_B.png',
      ];

      let loadedCount = 0;
      const totalAssets = imageUrls.length + 2; // +2 for video and 3D model

      const updateProgress = () => {
        loadedCount++;
        onProgress(loadedCount / totalAssets);
      };

      // Load images
      const imagePromises = imageUrls.map(url => 
        new Promise((resolve) => {
          const loader = new TextureLoader();
          loader.load(url, () => {
            updateProgress();
            resolve(null);
          });
        })
      );

      // Load video
      const videoPromise = new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = '/opener.mp4';
        video.load();
        video.onloadeddata = () => {
          new VideoTexture(video);
          updateProgress();
          resolve(null);
        };
      });

      // Load 3D model
      const modelPromise = new Promise((resolve) => {
        const loader = new GLTFLoader();
        loader.load('pillar-ok-transformed.glb', () => {
          updateProgress();
          resolve(null);
        });
      });

      await Promise.all([...imagePromises, videoPromise, modelPromise]);
    };

    loadAssets();
  }, [onProgress]);

  return null;
};

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={null}>
        <AssetPreloader onProgress={setLoadingProgress} />
        <LandingPage onStart={onStart} loadingProgress={loadingProgress} />
      </Suspense>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};