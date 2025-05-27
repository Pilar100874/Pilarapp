import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <a 
        href="https://www.pilar.com.br"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
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
      {started ? <Scene /> : <LandingScene onStart={() => setStarted(true)} />}
    </>
  );
}

export default App;