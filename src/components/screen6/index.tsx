import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';
import { useAudio } from '@/components/AudioManager';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const [isAnimationPaused, setIsAnimationPaused] = useState(true); // Start paused (showing play button)
  const playTexture = useTexture('/play.png');
  const { isMobilePortrait, isTabletPortrait } = useResponsiveText();
  const { isPlaying, toggle } = useAudio();

  const rotatePhotos = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front by rotating array
    const itemsToRotate = newOrder.splice(currentPosition);
    newOrder.unshift(...itemsToRotate);
    
    setOrder(newOrder);
  };

  const handlePlayPauseClick = async () => {
    console.log('Screen6 play/pause clicked, current music state:', isPlaying);
    
    // Toggle music and sync animation state
    await toggle();
    setIsAnimationPaused(!isPlaying); // Will be opposite after toggle
  };

  // Use mobile portrait layout for both mobile portrait AND tablet portrait
  const useMobileLayout = isMobilePortrait || isTabletPortrait;

  // Button position - move up 2cm (0.2 units) in mobile layout
  const buttonY = useMobileLayout ? 0.2 : 0; // Moved up by 2cm in mobile layout

  return (
    <Scroll>
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {/* Play/Pause Button - controls both music and animation */}
        <mesh
          position={[-2, buttonY, 2]}
          scale={[0.45, 0.45, 1]}
          rotation={[0, 0, isPlaying ? Math.PI : 0]} // Play icon when paused, pause icon when playing
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
              isPaused={!isPlaying} // Animation follows music state
            />
          );
        })}
      </group>
    </Scroll>
  );
};