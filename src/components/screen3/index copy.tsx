import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const [photos, setPhotos] = useState(Object.entries(dataPhotos));

  const moveToBack = (index: number) => {
    const updated = [...photos];
    const [removed] = updated.splice(index, 1);
    updated.push(removed);
    setPhotos(updated);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {photos.map(([name, src], i) => (
          <Photo key={name} index={i} src={src} onClick={() => moveToBack(i)} />
        ))}
      </group>
    </Scroll>
  );
};