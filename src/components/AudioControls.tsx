import { useCallback, useRef, useState, useEffect } from 'react';

export const AudioControls = () => {
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

    // Create audio element
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.preload = 'auto';

    const audio = audioRef.current;

    // Event listeners
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

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Start loading audio
    audio.load();

    // Auto-start music after a short delay (helps with mobile autoplay policies)
    const autoStartTimer = setTimeout(() => {
      if (audio && isLoaded) {
        audio.play().catch(error => {
          console.warn('Auto-play failed, user interaction required:', error);
        });
      }
    }, 1000);

    return () => {
      clearTimeout(autoStartTimer);
      window.removeEventListener('resize', checkMobile);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!audioRef.current) {
      console.warn('Audio element not available');
      return;
    }

    try {
      if (isPlaying) {
        console.log('Pausing audio...');
        audioRef.current.pause();
      } else {
        console.log('Playing audio...');
        // For mobile, we need to ensure the audio is ready
        if (audioRef.current.readyState < 2) {
          await new Promise((resolve) => {
            const onCanPlay = () => {
              audioRef.current?.removeEventListener('canplay', onCanPlay);
              resolve(void 0);
            };
            audioRef.current?.addEventListener('canplay', onCanPlay);
          });
        }
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Audio toggle failed:', error);
      // Try to reload and play again on mobile
      if (isMobile && !isPlaying) {
        try {
          audioRef.current.load();
          setTimeout(async () => {
            try {
              await audioRef.current?.play();
            } catch (retryError) {
              console.error('Retry failed:', retryError);
            }
          }, 500);
        } catch (reloadError) {
          console.error('Reload failed:', reloadError);
        }
      }
    }
  }, [isPlaying, isMobile]);

  // Enhanced touch handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleToggle(e as any);
  }, [handleToggle]);

  return (
    <button
      onClick={handleToggle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        top: '25px',
        left: '25px',
        zIndex: 1000,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        backgroundColor: isPlaying ? 'rgba(0, 150, 0, 0.8)' : 'rgba(150, 0, 0, 0.8)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '16px' : '18px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
      }}
      title={isPlaying ? 'Pausar música' : 'Tocar música'}
      aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
    >
      {isLoaded ? (isPlaying ? '⏸️' : '▶️') : '⏳'}
    </button>
  );
};