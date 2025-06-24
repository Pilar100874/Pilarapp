import { useCallback, useState, useEffect } from 'react';
import { useAudio } from '@/components/AudioManager';

export const AudioControls = () => {
  const { isPlaying, isLoaded, toggle } = useAudio();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Audio control clicked, current state:', { isPlaying, isLoaded });
    await toggle();
  }, [toggle, isPlaying, isLoaded]);

  // Enhanced touch handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleToggle(e as any);
  }, [handleToggle]);

  // Windows-style speaker icons
  const getSpeakerIcon = () => {
    if (!isLoaded) return '⏳';
    
    if (isPlaying) {
      // Speaker with sound waves (playing)
      return '🔊';
    } else {
      // Muted speaker
      return '🔇';
    }
  };

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
        borderRadius: '8px', // Less rounded for Windows style
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: isPlaying 
          ? 'rgba(0, 120, 215, 0.9)' // Windows blue when playing
          : 'rgba(60, 60, 60, 0.9)', // Dark gray when muted
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '18px' : '20px',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isPlaying 
          ? '0 2px 8px rgba(0, 120, 215, 0.3)' 
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = isPlaying 
            ? 'rgba(0, 120, 215, 1)' 
            : 'rgba(80, 80, 80, 0.9)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = isPlaying 
            ? 'rgba(0, 120, 215, 0.9)' 
            : 'rgba(60, 60, 60, 0.9)';
        }
      }}
      title={isPlaying ? 'Silenciar áudio' : 'Ativar áudio'}
      aria-label={isPlaying ? 'Silenciar áudio' : 'Ativar áudio'}
    >
      {getSpeakerIcon()}
    </button>
  );
};