import { Scroll } from '@react-three/drei';
import { SCREEN8_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen8 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));

  const rotatePhotos = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front by rotating array
    const itemsToRotate = newOrder.splice(currentPosition);
    newOrder.unshift(...itemsToRotate);
    
    setOrder(newOrder);
  };

  return (
    <Scroll>
      <group position-y={SCREEN8_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          return (
            <Photo
              key={name}
              src={src}
              z={-displayIndex * 0.35}
              index={displayIndex}
              totalPhotos={photoList.length}
              onClick={() => rotatePhotos(originalIndex)}
            />
          );
        })}
      </group>
    </Scroll>
  );
};