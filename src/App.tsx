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

  const handleStart = async () => {
    // First set started to true to ensure the interaction is registered
    setStarted(true);
    
    // For Android Chrome, we need to request fullscreen after a short delay
    // This ensures the user interaction is properly registered
    setTimeout(async () => {
      await requestFullscreen();
    }, 100);
  };

  // Re-request fullscreen when visibility changes (e.g., when switching apps)
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