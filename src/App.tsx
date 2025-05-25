import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';
import { TransitionVideo } from '@/components/TransitionVideo';

function App() {
  const [started, setStarted] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return transitionComplete ? (
    <Scene />
  ) : started ? (
    <TransitionVideo onTransitionComplete={() => setTransitionComplete(true)} />
  ) : (
    <LandingScene onStart={handleStart} />
  );
}

export default App;