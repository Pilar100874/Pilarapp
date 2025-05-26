import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { LandingScene } from '@/components/LandingScene';

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    try {
      // Try to request fullscreen on start
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
    setStarted(true);
  };

  // Request fullscreen immediately on component mount
  useState(() => {
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
        }
      } catch (error) {
        console.warn('Initial fullscreen request failed:', error);
      }
    };
    requestFullscreen();
  }, []);

  return started ? <Scene /> : <LandingScene onStart={handleStart} />;
}

export default App;