import { useState, useEffect } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';
import { InstallPWA } from '@/components/InstallPWA';

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
    setStarted(true);
    
    setTimeout(async () => {
      await requestFullscreen();
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

  return (
    <>
      <InstallPWA />
      {started ? <Scene /> : <LandingScene onStart={handleStart} />}
    </>
  );
}

export default App;