import { Canvas, useLoader } from '@react-three/fiber';
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
      // Load all images
      const imageUrls = [
        ...Object.values(screen3Photos),
        ...Object.values(screen6Photos),
        ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
        '/logo_branco.png',
        '/seta_B.png',
      ];

      // Create promises for all image loads
      const imagePromises = imageUrls.map(url => 
        new Promise((resolve) => {
          const loader = new TextureLoader();
          loader.load(url, resolve);
        })
      );

      // Load video
      const videoPromise = new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = '/opener.mp4';
        video.load();
        video.onloadeddata = () => {
          new VideoTexture(video);
          resolve(null);
        };
      });

      // Preload audio
      const audioPromise = new Promise((resolve) => {
        const audio = new Audio('/musica.mp3');
        audio.addEventListener('canplaythrough', () => resolve(null), { once: true });
        audio.load();
      });

      // Wait for all assets to load
      await Promise.all([...imagePromises, videoPromise, audioPromise]);
      setIsLoading(false);
    };

    loadAssets();
  }, []);

  return null;
};

interface LandingSceneProps {
  onStart: () => void;
  onMusicStart: () => void;
}

export const LandingScene = ({ onStart, onMusicStart }: LandingSceneProps) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={null}>
        <AssetPreloader />
        <LandingPage onStart={onStart} onMusicStart={onMusicStart} />
      </Suspense>
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};