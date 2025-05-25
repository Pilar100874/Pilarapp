import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

type PhotoData = {
  name: string;
  src: string;
  z: number;
};

export const Screen3 = () => {
  const [photos, setPhotos] = useState<PhotoData[]>(
    Object.entries(dataPhotos).map(([name, src], i) => ({
      name,
      src,
      z: -i * 0.35,
    }))
  );

  const moveToBack = (clickedIndex: number) => {
    const updated = [...photos];
    const minZ = Math.min(...updated.map(p => p.z));
    updated[clickedIndex].z = minZ - 0.35;
    setPhotos(updated);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {photos.map((photo, i) => (
          <Photo
            key={photo.name}
            src={photo.src}
            z={photo.z}
            onClick={() => moveToBack(i)}
          />
        ))}
      </group>
    </Scroll>
  );
};