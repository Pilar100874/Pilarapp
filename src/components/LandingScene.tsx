import { Canvas, useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Suspense, useEffect, useState } from 'react';
import { TextureLoader, VideoTexture } from 'three';
import { dataPhotos as screen3Photos } from '@/components/screen3/dataPhotos';
import { dataPhotos as screen6Photos } from '@/components/screen6/dataPhotos';
import { dataPhotos as screen8Photos } from '@/components/screen8/dataPhotos';

interface LandingSceneProps {
  onStart: () => void;
  isMobile: boolean;
}

const AssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      const imageUrls = [
        ...Object.values(screen3Photos),
        ...Object.values(screen6Photos),
        ...Object.values(screen8Photos).flatMap(photo => [photo.default, photo.alternate]),
        '/logo_branco.png',
        '/seta_B.png',
      ];

      const imagePromises = imageUrls.map(url => 
        new Promise((resolve) => {
          const loader = new TextureLoader();
          loader.load(url, resolve);
        })
      );

      const videoPromise = new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = '/opener.mp4';
        video.load();
        video.onloadeddata = () => {
          new VideoTexture(video);
          resolve(null);
        };
      });

      const modelPromise = new Promise((resolve) => {
        const loader = new TextureLoader();
        loader.load('pillar-ok-transformed.glb', resolve);
      });

      await Promise.all([...imagePromises, videoPromise, modelPromise]);
      setIsLoading(false);
    };

    loadAssets();
  }, []);

  return null;
};

export const LandingScene = ({ onStart, isMobile }: LandingSceneProps) => {
  return (
    <Canvas 
      style={{ width: '100vw', height: '100vh' }}
      camera={{ 
        fov: isMobile ? 75 : 60,
        position: [0, 0, isMobile ? 8 : 5]
      }}
    >
      <color attach="background" args={[new Color('black')]} />
      <Suspense fallback={null}>
        <AssetPreloader />
        <LandingPage onStart={onStart} isMobile={isMobile} />
      </Suspense>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
    </Canvas>
  );
};