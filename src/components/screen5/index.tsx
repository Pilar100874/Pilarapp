import { Scroll } from '@react-three/drei';
import { SCREEN5_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen5 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));

  const sendToBack = (clickedIndex: number) => {
    const newOrder = order.filter((i) => i !== clickedIndex);
    newOrder.push(clickedIndex);
    setOrder(newOrder);
  };

  return (
    <Scroll>
      <group position-y={SCREEN5_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          const z = -displayIndex * 0.35;
          return (
            <Photo
              key={name}
              src={src}
              z={z}
              onClick={() => sendToBack(originalIndex)}
            />
          );
        })}
      </group>
    </Scroll>
  );
};