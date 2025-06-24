import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';
import { AudioControls } from '@/components/AudioControls';
import { AudioProvider } from '@/components/AudioManager';

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <AudioProvider>
      <a 
        href="https://www.pilar.com.br"
        style={{
          position: 'fixed',
          top: '25px',
          right: '25px',
          zIndex: 1000,
          width: '50px',
          height: '50px',
        }}
      >
        <img 
          src="/loja.png" 
          alt="Loja Pilar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </a>
      
      {/* Audio Controls - show when experience starts */}
      {started && <AudioControls />}
      
      {started ? (
        <Scene />
      ) : (
        <LandingScene onStart={handleStart} />
      )}
    </AudioProvider>
  );
}

export default App;