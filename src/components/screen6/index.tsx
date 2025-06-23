import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState, useRef, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const [isAnimationPaused, setIsAnimationPaused] = useState(true); // Start paused (showing play button)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTexture = useTexture('/play.png');
  const { isMobilePortrait } = useResponsiveText();

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.preload = 'auto';

    const audio = audioRef.current;

    const handlePlay = () => setIsMusicPlaying(true);
    const handlePause = () => setIsMusicPlaying(false);
    const handleEnded = () => setIsMusicPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const rotatePhotos = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front by rotating array
    const itemsToRotate = newOrder.splice(currentPosition);
    newOrder.unshift(...itemsToRotate);
    
    setOrder(newOrder);
  };

  const handlePlayPauseClick = async () => {
    if (!audioRef.current) return;

    try {
      if (isMusicPlaying) {
        // Pause music and animation
        audioRef.current.pause();
        setIsAnimationPaused(true);
        console.log('Music and animation paused');
      } else {
        // Play music and start animation
        await audioRef.current.play();
        setIsAnimationPaused(false);
        console.log('Music and animation started');
      }
    } catch (error) {
      console.error('Audio control failed:', error);
      
      // Fallback: try to reload and play again
      try {
        audioRef.current.load();
        setTimeout(async () => {
          try {
            await audioRef.current?.play();
            setIsAnimationPaused(false);
          } catch (retryError) {
            console.error('Audio retry failed:', retryError);
          }
        }, 500);
      } catch (reloadError) {
        console.error('Audio reload failed:', reloadError);
      }
    }
  };

  // Button position - move up 2cm (0.2 units) in mobile portrait
  const buttonY = isMobilePortrait ? 0.2 : 0; // Moved up by 2cm in mobile portrait

  return (
    <Scroll>
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {/* Play/Pause Button - controls both music and animation */}
        <mesh
          position={[-2, buttonY, 2]}
          scale={[0.45, 0.45, 1]}
          rotation={[0, 0, isMusicPlaying ? Math.PI : 0]} // Play icon when paused, pause icon when playing
          onClick={handlePlayPauseClick}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={playTexture} 
            transparent 
            opacity={1} 
            depthTest={false}
            alphaTest={0.1}
          />
        </mesh>

        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          return (
            <Photo
              key={name}
              src={src}
              z={-displayIndex * 0.35}
              index={displayIndex}
              totalPhotos={photoList.length}
              onClick={() => rotatePhotos(originalIndex)}
              isPaused={isAnimationPaused}
            />
          );
        })}
      </group>
    </Scroll>
  );
};