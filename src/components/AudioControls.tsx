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

  // Windows-style speaker icon with sound waves
  const SpeakerWithSound = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      {/* Speaker cone */}
      <path d="M3 9v6h4l5 5V4L7 9H3z"/>
      {/* Sound waves */}
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
      <path d="M19 12c0-3.07-1.63-5.64-4-6.32v2.13c1.5.56 2.5 2.03 2.5 4.19s-1 3.63-2.5 4.19v2.13c2.37-.68 4-3.25 4-6.32z"/>
    </svg>
  );

  // Windows-style muted speaker icon with X
  const SpeakerMuted = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      {/* Speaker cone */}
      <path d="M3 9v6h4l5 5V4L7 9H3z"/>
      {/* X mark */}
      <path d="M16.5 12l2.5-2.5 1.5 1.5-2.5 2.5 2.5 2.5-1.5 1.5-2.5-2.5-2.5 2.5-1.5-1.5 2.5-2.5-2.5-2.5 1.5-1.5 2.5 2.5z"/>
    </svg>
  );

  // Loading icon
  const LoadingIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
      </circle>
    </svg>
  );

  const getAudioIcon = () => {
    if (!isLoaded) return <LoadingIcon />;
    
    if (isPlaying) {
      return <SpeakerWithSound />;
    } else {
      return <SpeakerMuted />;
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
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        // Add subtle shadow for better visibility
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9)) brightness(1.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))';
        }
      }}
      title={isPlaying ? 'Silenciar áudio' : 'Ativar áudio'}
      aria-label={isPlaying ? 'Silenciar áudio' : 'Ativar áudio'}
    >
      {getAudioIcon()}
    </button>
  );
};