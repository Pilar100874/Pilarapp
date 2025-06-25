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
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Universal user interaction detection to unlock audio
  useEffect(() => {
    let interactionDetected = false;

    const handleUserInteraction = (event: Event) => {
      if (interactionDetected) return;
      
      console.log('User interaction detected for audio unlock:', event.type);
      interactionDetected = true;
      setAudioUnlocked(true);
      
      // Try to unlock audio context immediately on any interaction
      if (audioRef.current) {
        const audio = audioRef.current;
        
        // Create a promise to unlock audio
        const unlockAudio = async () => {
          try {
            // Try to play and immediately pause to unlock audio context
            const originalVolume = audio.volume;
            audio.muted = true;
            audio.volume = 0;
            
            await audio.play();
            audio.pause();
            audio.currentTime = 0;
            
            // Restore original settings
            audio.muted = false;
            audio.volume = originalVolume;
            
            console.log('Audio context unlocked successfully');
          } catch (error) {
            console.warn('Audio unlock attempt failed:', error);
          }
        };
        
        unlockAudio();
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
    };

    // Listen for various interaction events
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('touchend', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction, { passive: true });
    document.addEventListener('mousemove', handleUserInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // Create audio instance
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.preload = 'auto';
    audioRef.current.crossOrigin = 'anonymous';

    // Universal audio setup for better compatibility
    audioRef.current.setAttribute('playsinline', 'true');
    audioRef.current.setAttribute('webkit-playsinline', 'true');

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
      // Try to reload on error
      setTimeout(() => {
        if (audio.readyState === 0) {
          audio.load();
        }
      }, 1000);
    };

    const handleStalled = () => {
      console.warn('Audio stalled, attempting to reload...');
      if (audio.readyState < 3) {
        audio.load();
      }
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    const handleLoadedData = () => {
      console.log('Audio data loaded');
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);

    // Start loading
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = async () => {
    if (!audioRef.current || !isLoaded) {
      console.warn('Audio not ready for playback');
      return;
    }

    // Check if audio context is unlocked
    if (!audioUnlocked) {
      console.warn('Audio context not yet unlocked - waiting for user interaction');
      return;
    }
    
    try {
      const audio = audioRef.current;
      
      // Reset audio position if it's ended
      if (audio.ended) {
        audio.currentTime = 0;
      }

      // Ensure audio is properly configured
      audio.muted = false;
      audio.volume = 0.7;

      await audio.play();
      console.log('Audio play successful');
    } catch (error) {
      console.error('Audio play failed:', error);
      
      // Enhanced retry logic
      try {
        console.log('Attempting audio recovery...');
        const audio = audioRef.current;
        
        // Try the mute/unmute trick
        audio.muted = true;
        await audio.play();
        
        setTimeout(() => {
          audio.muted = false;
          audio.volume = 0.7;
          console.log('Audio recovery successful');
        }, 100);
        
      } catch (recoveryError) {
        console.error('Audio recovery failed:', recoveryError);
        
        // Final fallback: reload and retry
        try {
          audioRef.current.load();
          setTimeout(async () => {
            try {
              if (audioRef.current && audioUnlocked) {
                await audioRef.current.play();
                console.log('Audio final retry successful');
              }
            } catch (finalError) {
              console.error('Audio final retry failed:', finalError);
            }
          }, 2000);
        } catch (reloadError) {
          console.error('Audio reload failed:', reloadError);
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