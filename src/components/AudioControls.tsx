import { useCallback } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface AudioControlsProps {
  onMusicStart: () => void;
}

export const AudioControls = ({ onMusicStart }: AudioControlsProps) => {
  const { isPlaying, isLoaded, play, pause, toggle } = useAudio('/musica.mp3');

  const handlePlay = useCallback(async () => {
    await play();
    onMusicStart();
  }, [play, onMusicStart]);

  const handleToggle = useCallback(() => {
    if (!isPlaying) {
      handlePlay();
    } else {
      pause();
    }
  }, [isPlaying, handlePlay, pause]);

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