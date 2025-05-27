import { useState, useEffect } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';

function App() {
  const [started, setStarted] = useState(false);

  const requestFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
  };

  const handleStart = () => {
    // For mobile Chrome, we need to handle the interaction first
    setStarted(true);
    // Then request fullscreen after a short delay to ensure the interaction is processed
    setTimeout(() => {
      requestFullscreen();
    }, 100);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && started) {
        requestFullscreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [started]);

  return started ? <Scene /> : <LandingScene onStart={handleStart} />;
}

export default App;