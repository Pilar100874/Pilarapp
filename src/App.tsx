import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';

function App() {
  const [started, setStarted] = useState(false);

  return started ? <Scene /> : <LandingScene onStart={() => setStarted(true)} />;
}

export default App;