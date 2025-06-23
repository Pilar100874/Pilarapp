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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Create single audio instance with mobile-friendly settings
    try {
      audioRef.current = new Audio('/musica.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
      audioRef.current.preload = isMobile ? 'none' : 'metadata'; // Don't preload on mobile
      audioRef.current.muted = false;

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
        setIsLoaded(true); // Set as loaded even on error to prevent infinite loading
      };

      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Only start loading on desktop or when user interacts
      if (!isMobile) {
        audio.load();
      } else {
        // On mobile, mark as loaded immediately to show controls
        setTimeout(() => setIsLoaded(true), 500);
      }

      return () => {
        window.removeEventListener('resize', checkMobile);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = '';
      };
    } catch (error) {
      console.error('Audio initialization failed:', error);
      setIsLoaded(true); // Set as loaded to show controls
    }
  }, []);

  const play = async () => {
    if (!audioRef.current) return;
    
    try {
      // On mobile, load the audio when user first tries to play
      if (isMobile && audioRef.current.readyState === 0) {
        audioRef.current.load();
        // Wait a bit for loading
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await audioRef.current.play();
      console.log('Audio play successful');
    } catch (error) {
      console.error('Audio play failed:', error);
      
      // Retry logic for mobile
      try {
        audioRef.current.load();
        setTimeout(async () => {
          try {
            await audioRef.current?.play();
          } catch (retryError) {
            console.error('Audio retry failed:', retryError);
          }
        }, 1000);
      } catch (reloadError) {
        console.error('Audio reload failed:', reloadError);
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