import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photoList.length);
  };

  const [name, src] = photoList[currentIndex];

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        <Photo
          key={name}
          src={src}
          z={0}
          onClick={handleNext}
        />
      </group>
    </Scroll>
  );
};