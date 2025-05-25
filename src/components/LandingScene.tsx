import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import { LandingPage } from './LandingPage';

export const LandingScene = ({ onStart }: { onStart: () => void }) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={[new Color('black')]} />
      <LandingPage onStart={onStart} />
      <ambientLight />
      <directionalLight />
    </Canvas>
  );
};