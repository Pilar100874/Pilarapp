import { Scroll } from '@react-three/drei';
import { SCREEN8_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen8 = () => {
  const photoList = Object.entries(dataPhotos);

  return (
    <Scroll>
      <group position-y={SCREEN8_OFFSET_START_Y}>
        {photoList.map(([name, src], index) => (
          <Photo
            key={name}
            src={src}
            index={index}
            totalPhotos={photoList.length}
          />
        ))}
      </group>
    </Scroll>
  );
};