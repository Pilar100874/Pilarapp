import { useState, useEffect } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';
import { AudioControls } from '@/components/AudioControls';
import { AudioProvider } from '@/components/AudioManager';

function App() {
  const [started, setStarted] = useState(false);
  const [appError, setAppError] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  // Error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('App error:', error);
      setAppError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Don't set error state for promise rejections, just log them
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (appError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h2>Pilar Comercial e Serviços</h2>
          <p>Carregando aplicação...</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

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