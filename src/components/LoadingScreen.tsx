import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color } from 'three';
import { useResponsiveText } from '@/utils/responsive';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingText = ({ progress }: { progress: number }) => {
  const { getFontSize } = useResponsiveText();
  
  const titleFontSize = getFontSize(0.4, 0.35, 0.5, 0.55, 0.7);
  
  return (
    <group>
      {/* Background text (gray) */}
      <Text
        fontSize={titleFontSize}
        letterSpacing={0.005}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        color="rgb(77, 77, 77)"
      >
        PILAR APRESENTA
        <meshBasicMaterial transparent depthTest={false} depthWrite={false} />
      </Text>
      
      {/* Foreground text (white) with clipping mask */}
      <Text
        fontSize={titleFontSize}
        letterSpacing={0.005}
        position-z={0.11}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        color="white"
      >
        PILAR APRESENTA
        <meshBasicMaterial 
          transparent 
          depthTest={false} 
          depthWrite={false}
          clipShadows={true}
        />
        {/* Create clipping plane that moves from left to right */}
        <primitive 
          object={{
            type: 'ClippingPlane',
            normal: { x: -1, y: 0, z: 0 },
            constant: -3 + (progress / 100) * 6 // Moves from left (-3) to right (3)
          }}
        />
      </Text>
    </group>
  );
};

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(Date.now());
  const assetsLoadedRef = useRef(false);

  useEffect(() => {
    const loadAssets = async () => {
      // Simulate asset loading with actual asset preloading
      const assetUrls = [
        '/logo_branco.png',
        '/iniciar.png',
        '/seta_B.png',
        '/opener.mp4',
        '/musica.mp3',
        '/sp.png',
        '/rs.png',
        '/es.png',
        '/to.png',
        '/ba.png',
        '/pr.png',
        '/go.png',
        '/assai.png',
        '/kalunga.png',
        '/latam.png',
        '/leroy.png',
        '/tintasmc.png',
        '/telha.png',
        '/k-01.png',
        '/k-01b.png',
        '/k-02.png',
        '/k-02b.png',
        '/k-03.png',
        '/k-03b.png',
        '/k-04.png',
        '/k-04b.png',
        '/k-05.png',
        '/k-05b.png',
        '/k-06.png',
        '/k-06b.png',
        '/play.png'
      ];

      let loadedCount = 0;
      const totalAssets = assetUrls.length;

      // Load images
      const imagePromises = assetUrls.filter(url => url.endsWith('.png')).map(url => 
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            resolve();
          };
          img.src = url;
        })
      );

      // Load video
      const videoPromise = new Promise<void>((resolve) => {
        const video = document.createElement('video');
        video.onloadeddata = () => {
          loadedCount++;
          resolve();
        };
        video.onerror = () => {
          loadedCount++;
          resolve();
        };
        video.src = '/opener.mp4';
        video.load();
      });

      // Load audio
      const audioPromise = new Promise<void>((resolve) => {
        const audio = new Audio('/musica.mp3');
        audio.addEventListener('canplaythrough', () => {
          loadedCount++;
          resolve();
        }, { once: true });
        audio.addEventListener('error', () => {
          loadedCount++;
          resolve();
        }, { once: true });
        audio.load();
      });

      // Wait for all assets
      await Promise.all([...imagePromises, videoPromise, audioPromise]);
      assetsLoadedRef.current = true;
    };

    loadAssets();

    // Progress animation
    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const minLoadTime = 3000; // Minimum 3 seconds loading time
      const baseProgress = Math.min((elapsed / minLoadTime) * 100, 100);
      
      // If assets are loaded and we've reached 100%, complete the loading
      if (assetsLoadedRef.current && baseProgress >= 100) {
        setProgress(100);
        setTimeout(() => {
          setIsComplete(true);
          // Smoothly transition to landing page without flicker
          onLoadingComplete();
        }, 500); // Wait 0.5 seconds after reaching 100%
        return;
      }

      // Smooth progress animation with some randomness
      setProgress(prev => {
        const target = Math.min(baseProgress, assetsLoadedRef.current ? 95 : 90);
        const increment = (target - prev) * 0.1 + Math.random() * 0.5;
        return Math.min(prev + increment, target);
      });

      if (!isComplete) {
        requestAnimationFrame(animateProgress);
      }
    };

    animateProgress();
  }, [onLoadingComplete, isComplete]);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'black',
        zIndex: 1000,
        opacity: isComplete ? 0 : 1,
        transition: isComplete ? 'opacity 1s ease-out' : 'none',
        pointerEvents: isComplete ? 'none' : 'all'
      }}
    >
      <Canvas style={{ width: '100%', height: '100%' }}>
        <color attach="background" args={[new Color('black')]} />
        <LoadingText progress={progress} />
        <ambientLight />
        <directionalLight />
      </Canvas>
    </div>
  );
};