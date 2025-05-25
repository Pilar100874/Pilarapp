import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = () => {
    setCurrentIndex((prev) => (prev + 1) % photoList.length);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {photoList.map(([name, src], i) => {
          // calcula diferença em relação à imagem atual
          const relativeIndex = (i - currentIndex + photoList.length) % photoList.length;
          const z = -relativeIndex * 0.35;
          return (
            <Photo
              key={name}
              src={src}
              z={z}
              onClick={i === currentIndex ? handleClick : undefined}
            />
          );
        })}
      </group>
    </Scroll>
  );
};