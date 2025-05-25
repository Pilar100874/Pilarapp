import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

type PhotoData = {
  name: string;
  src: string;
};

export const Screen3 = () => {
  const [photos, setPhotos] = useState<PhotoData[]>(
    Object.entries(dataPhotos).map(([name, src]) => ({ name, src }))
  );

  const moveToBack = (clickedIndex: number) => {
    const updated = [...photos];
    const [clicked] = updated.splice(clickedIndex, 1);
    updated.push(clicked);
    setPhotos(updated);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {photos.map((photo, index) => (
          <Photo
            key={photo.name}
            src={photo.src}
            z={-index * 0.35}
            onClick={() => moveToBack(index)}
          />
        ))}
      </group>
    </Scroll>
  );
};