import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';

function App() {
  const [started, setStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleStart = () => {
    setTransitioning(true);
    setTimeout(() => {
      setStarted(true);
    }, 1000);
  };

  return transitioning ? <Scene /> : <LandingScene onStart={handleStart} />;
}

export default App;