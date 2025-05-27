import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';
import { useTexture } from '@react-three/drei';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [activeIndex, setActiveIndex] = useState(Math.floor(photoList.length / 2));
  const arrowTexture = useTexture('/seta_B.png');

  const handlePhotoClick = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0));
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
        {/* Previous Button */}
        <mesh
          position={[-4, 0, 0]}
          scale={[0.5, 0.5, 1]}
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
          position={[4, 0, 0]}
          scale={[0.5, 0.5, 1]}
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
  );
};