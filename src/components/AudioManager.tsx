import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isLoaded: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Detect user interaction for iOS
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // Create single audio instance
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.preload = 'auto';

    // iOS-specific audio setup
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      audioRef.current.setAttribute('playsinline', 'true');
      audioRef.current.setAttribute('webkit-playsinline', 'true');
    }

    const audio = audioRef.current;

    const handleCanPlayThrough = () => {
      console.log('Audio loaded successfully');
      setIsLoaded(true);
    };
    
    const handlePlay = () => {
      console.log('Audio started playing');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
    };

    const handleStalled = () => {
      console.warn('Audio stalled, attempting to reload...');
      if (audio.readyState < 3) {
        audio.load();
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);

    // Start loading
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = async () => {
    if (!audioRef.current || !isLoaded) {
      console.warn('Audio not ready for playback');
      return;
    }

    // Check if user has interacted (required for iOS)
    if (!userInteracted && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      console.warn('iOS requires user interaction before audio playback');
      return;
    }
    
    try {
      // Reset audio position if it's ended
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }

      await audioRef.current.play();
      console.log('Audio play successful');
    } catch (error) {
      console.error('Audio play failed:', error);
      
      // Enhanced retry logic for iOS
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        try {
          // Try to unlock audio context on iOS
          audioRef.current.muted = true;
          await audioRef.current.play();
          audioRef.current.muted = false;
          audioRef.current.volume = 0.7;
          console.log('iOS audio unlocked and playing');
        } catch (iosError) {
          console.error('iOS audio unlock failed:', iosError);
          
          // Final fallback: reload and retry
          try {
            audioRef.current.load();
            setTimeout(async () => {
              try {
                await audioRef.current?.play();
              } catch (finalError) {
                console.error('Final audio retry failed:', finalError);
              }
            }, 1000);
          } catch (reloadError) {
            console.error('Audio reload failed:', reloadError);
          }
        }
      }
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.pause();
      console.log('Audio pause successful');
    } catch (error) {
      console.error('Audio pause failed:', error);
    }
  };

  const toggle = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const value: AudioContextType = {
    isPlaying,
    isLoaded,
    play,
    pause,
    toggle,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};