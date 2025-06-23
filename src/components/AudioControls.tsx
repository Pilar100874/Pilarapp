import { useCallback, useRef, useState, useEffect } from 'react';

export const AudioControls = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;

    const audio = audioRef.current;

    // Event listeners
    const handleCanPlayThrough = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Preload audio
    audio.load();

    // Check if music is already playing (started from landing page)
    const checkExistingAudio = () => {
      const existingAudios = document.querySelectorAll('audio');
      existingAudios.forEach(existingAudio => {
        if (existingAudio.src.includes('musica.mp3') && !existingAudio.paused) {
          setIsPlaying(true);
          // Replace the existing audio with our controlled one
          existingAudio.pause();
          audio.currentTime = existingAudio.currentTime;
          audio.play();
        }
      });
    };

    // Small delay to check for existing audio
    setTimeout(checkExistingAudio, 100);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleToggle = useCallback(async () => {
    if (!audioRef.current || !isLoaded) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.warn('Audio toggle failed:', error);
    }
  }, [isPlaying, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      style={{
        position: 'fixed',
        top: '25px',
        left: '25px',
        zIndex: 1000, // Same z-index as shopping cart
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      }}
      title={isPlaying ? 'Pausar música' : 'Tocar música'}
    >
      {isPlaying ? '⏸️' : '▶️'}
    </button>
  );
};