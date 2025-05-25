import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [activeIndex, setActiveIndex] = useState(Math.floor(photoList.length / 2));

  const handlePhotoClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} position-x={0}>
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