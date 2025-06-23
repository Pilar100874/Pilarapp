import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';
import { AudioControls } from '@/components/AudioControls';

function App() {
  const [started, setStarted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const handleMusicStart = () => {
    setMusicStarted(true);
  };

  return (
    <>
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
      
      {/* Audio Controls - only show after music has started */}
      {musicStarted && <AudioControls onMusicStart={handleMusicStart} />}
      
      {started ? (
        <Scene />
      ) : (
        <LandingScene onStart={() => setStarted(true)} onMusicStart={handleMusicStart} />
      )}
    </>
  );
}

export default App;