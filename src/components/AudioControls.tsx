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

  // Windows-style speaker icon component
  const SpeakerIcon = ({ isPlaying: playing, size = 24 }: { isPlaying: boolean; size?: number }) => {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="white"
        style={{ display: 'block' }}
      >
        {/* Speaker base */}
        <path d="M3 9v6h4l5 5V4L7 9H3z" />
        
        {playing ? (
          // Sound waves when playing
          <>
            <path d="M15.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            <path d="M13 5.08v1.95c2.84.48 5 2.94 5 5.97s-2.16 5.49-5 5.97v1.95c3.93-.49 7-3.85 7-7.92s-3.07-7.43-7-7.92z" />
          </>
        ) : (
          // X when muted/paused
          <>
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63z" />
            <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
            <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z" />
            <path d="M12 4L9.91 6.09 12 8.18V4z" />
          </>
        )}
      </svg>
    );
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
      {isLoaded ? (
        <SpeakerIcon isPlaying={isPlaying} size={isMobile ? 20 : 24} />
      ) : (
        '⏳'
      )}
    </button>
  );
};