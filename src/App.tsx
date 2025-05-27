import { useState, useEffect } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';

function App() {
  const [started, setStarted] = useState(false);

  const requestFullscreen = async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
  };

  const handleStart = async () => {
    await requestFullscreen(document.documentElement);
    setStarted(true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && started) {
        requestFullscreen(document.documentElement);
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