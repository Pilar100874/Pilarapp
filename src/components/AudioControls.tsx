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

  // White speaker icons only
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
        border: 'none', // Remove border
        backgroundColor: 'transparent', // Transparent background
        color: 'white', // White icons
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '24px' : '28px', // Larger icons since no background
        transition: 'all 0.2s ease',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        // Add text shadow for better visibility
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
        filter: 'brightness(1)', // Default brightness
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.filter = 'brightness(1.2)'; // Slightly brighter on hover
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'brightness(1)';
        }
      }}
      title={isPlaying ? 'Silenciar áudio' : 'Ativar áudio'}
      aria-label={isPlaying ? 'Silenciar áudio' : 'Ativar áudio'}
    >
      {getSpeakerIcon()}
    </button>
  );
};