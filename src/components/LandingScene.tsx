import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';
import { Loader, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';

// List of all assets to preload
const assetsToPreload = [
  '/logo_branco.png',
  '/opener.mp4',
  '/seta_B.png',
  '/pillar-ok-transformed.glb',
  '/k-01.png', '/k-02.png', '/k-03.png', '/k-04.png', '/k-05.png', '/k-06.png',
  '/k-01b.png', '/k-02b.png', '/k-03b.png', '/k-04b.png', '/k-05b.png', '/k-06b.png',
  '/sp.png', '/rs.png', '/es.png', '/to.png', '/ba.png', '/pr.png', '/go.png'
];

function PreloadAssets({ onComplete }: { onComplete: () => void }) {
  const { progress, loaded } = useProgress();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (loaded === assetsToPreload.length && !isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [loaded, isComplete, onComplete]);

  return null;
}

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <color attach="background" args={[new Color('black')]} />
        <Suspense fallback={null}>
          <PreloadAssets onComplete={() => setAssetsLoaded(true)} />
          {assetsLoaded && <LandingPage onStart={onStart} />}
        </Suspense>
        <ambientLight />
        <directionalLight />
      </Canvas>
      <Loader 
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`} 
        containerStyles={{ background: 'black' }}
        innerStyles={{ background: 'white' }}
        barStyles={{ background: 'white' }}
        dataStyles={{ color: 'white' }}
      />
    </>
  );
};