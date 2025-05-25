import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y}>
        {photoList.map(([name, src], index) => (
          <Photo
            key={name}
            src={src}
            z={index === activeIndex ? -1 : -2 - Math.abs(index - activeIndex) * 0.5}
            onClick={() => handlePhotoClick(index)}
          />
        ))}
      </group>
    </Scroll>
  );
};