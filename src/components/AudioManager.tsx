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
  const [isIOS, setIsIOS] = useState(false);
  const [orientationChanged, setOrientationChanged] = useState(false);

  // Detect iOS
  useEffect(() => {
    const iosDetected = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(iosDetected);
    console.log('Audio Manager - iOS detected:', iosDetected);
  }, []);

  // iOS orientation change detection
  useEffect(() => {
    if (!isIOS) return;

    let orientationTimeout: number;

    const handleOrientationChange = () => {
      console.log('Audio Manager - iOS orientation change detected');
      setOrientationChanged(true);
      setUserInteracted(true);
      
      // Clear any existing timeout
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }
      
      // Try to unlock audio after orientation change
      orientationTimeout = setTimeout(() => {
        if (audioRef.current) {
          const audio = audioRef.current;
          
          // Try to unlock audio context after orientation change
          audio.muted = true;
          audio.play().then(() => {
            audio.pause();
            audio.muted = false;
            audio.volume = 0.7;
            console.log('iOS audio unlocked after orientation change');
          }).catch(error => {
            console.warn('iOS audio unlock failed after orientation:', error);
          });
        }
      }, 300);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }
    };
  }, [isIOS]);

  // Enhanced user interaction detection
  useEffect(() => {
    let interactionDetected = false;

    const handleUserInteraction = (event: Event) => {
      if (interactionDetected) return;
      
      console.log('Audio Manager - User interaction detected:', event.type);
      interactionDetected = true;
      setUserInteracted(true);
      
      // For iOS, try to unlock audio context immediately
      if (isIOS && audioRef.current) {
        const audio = audioRef.current;
        
        // Try to play and immediately pause to unlock audio context
        audio.muted = true;
        audio.play().then(() => {
          audio.pause();
          audio.muted = false;
          audio.volume = 0.7;
          console.log('iOS audio context unlocked');
        }).catch(error => {
          console.warn('iOS audio unlock failed:', error);
        });
      }
      
      // Remove listeners
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('touchend', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [isIOS]);

  // iOS scroll detection for audio unlock
  useEffect(() => {
    if (!isIOS) return;

    let scrollTimeout: number;
    let lastScrollTime = 0;

    const handleScroll = () => {
      const now = Date.now();
      lastScrollTime = now;
      
      if (!userInteracted) {
        setUserInteracted(true);
        
        // Try to unlock audio on scroll
        if (audioRef.current) {
          const audio = audioRef.current;
          audio.muted = true;
          audio.play().then(() => {
            audio.pause();
            audio.muted = false;
            audio.volume = 0.7;
            console.log('iOS audio unlocked on scroll');
          }).catch(error => {
            console.warn('iOS audio unlock on scroll failed:', error);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isIOS, userInteracted]);

  useEffect(() => {
    // Create audio instance
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.preload = 'auto';
    audioRef.current.crossOrigin = 'anonymous';

    // iOS-specific audio setup
    if (isIOS) {
      audioRef.current.setAttribute('playsinline', 'true');
      audioRef.current.setAttribute('webkit-playsinline', 'true');
      audioRef.current.muted = false; // Don't mute by default on iOS
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
  }, [isIOS]);

  const play = async () => {
    if (!audioRef.current || !isLoaded) {
      console.warn('Audio not ready for playback');
      return;
    }

    // For iOS, check if user has interacted or orientation changed
    if (isIOS && !userInteracted && !orientationChanged) {
      console.warn('iOS requires user interaction before audio playback');
      return;
    }
    
    try {
      const audio = audioRef.current;
      
      // Reset audio position if it's ended
      if (audio.ended) {
        audio.currentTime = 0;
      }

      // For iOS, ensure audio is properly configured
      if (isIOS) {
        audio.muted = false;
        audio.volume = 0.7;
      }

      await audio.play();
      console.log('Audio play successful');
    } catch (error) {
      console.error('Audio play failed:', error);
      
      // Enhanced retry logic for iOS
      if (isIOS) {
        try {
          console.log('Attempting iOS audio recovery...');
          const audio = audioRef.current;
          
          // Try the mute/unmute trick for iOS
          audio.muted = true;
          await audio.play();
          
          setTimeout(() => {
            audio.muted = false;
            audio.volume = 0.7;
            console.log('iOS audio recovery successful');
          }, 100);
          
        } catch (iosError) {
          console.error('iOS audio recovery failed:', iosError);
          
          // Final fallback: reload and retry
          try {
            audioRef.current.load();
            setTimeout(async () => {
              try {
                if (audioRef.current && (userInteracted || orientationChanged)) {
                  await audioRef.current.play();
                  console.log('iOS audio final retry successful');
                }
              } catch (finalError) {
                console.error('iOS audio final retry failed:', finalError);
              }
            }, 2000);
          } catch (reloadError) {
            console.error('iOS audio reload failed:', reloadError);
          }
        }
      } else {
        // Non-iOS retry logic
        try {
          audioRef.current.load();
          setTimeout(async () => {
            try {
              await audioRef.current?.play();
            } catch (retryError) {
              console.error('Audio retry failed:', retryError);
            }
          }, 500);
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