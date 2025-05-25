import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));

  const handlePhotoClick = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front
    newOrder.splice(currentPosition, 1);
    newOrder.unshift(clickedIndex);
    
    setOrder(newOrder);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y}>
        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          return (
            <Photo
              key={name}
              src={src}
              z={-displayIndex * 0.35}
              onClick={() => handlePhotoClick(originalIndex)}
            />
          );
        })}
      </group>
    </Scroll>
  );
};