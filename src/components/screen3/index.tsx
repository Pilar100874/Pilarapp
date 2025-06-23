import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { SwipeHandler } from './SwipeHandler';
import { useState, useCallback } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [activeIndex, setActiveIndex] = useState(Math.floor(photoList.length / 2));
  const arrowTexture = useTexture('/seta_B.png');
  const { isMobilePortrait } = useResponsiveText();

  const handlePhotoClick = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1));
  }, [photoList.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0));
  }, [photoList.length]);

  // Button positioning based on orientation
  const buttonY = isMobilePortrait ? -3.0 : 0;
  const buttonScale = isMobilePortrait ? 0.4 : 0.5;
  const buttonSpacing = isMobilePortrait ? 2.5 : 5;

  return (
    <SwipeHandler onSwipeLeft={handleNext} onSwipeRight={handlePrevious}>
      <Scroll>
        <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
          {/* Previous Button */}
          <mesh
            position={[-buttonSpacing, buttonY, 0]}
            scale={[buttonScale, buttonScale, 1]}
            rotation={[0, 0, Math.PI / 2]}
            onClick={handlePrevious}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
          </mesh>

          {/* Next Button */}
          <mesh
            position={[buttonSpacing, buttonY, 0]}
            scale={[buttonScale, buttonScale, 1]}
            rotation={[0, 0, -Math.PI / 2]}
            onClick={handleNext}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
          </mesh>

          {photoList.map(([name, src], index) => (
            <Photo
              key={name}
              src={src}
              index={index}
              isActive={index === activeIndex}
              totalPhotos={photoList.length}
              activeIndex={activeIndex}
              onClick={() => handlePhotoClick(index)}
            />
          ))}
        </group>
      </Scroll>
    </SwipeHandler>
  );
};