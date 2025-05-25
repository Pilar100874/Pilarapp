import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i)); // order of display by index

  const sendToBack = (clickedIndex: number) => {
    const newOrder = order.filter((i) => i !== clickedIndex);
    newOrder.push(clickedIndex); // move to back
    setOrder(newOrder);
  };

  return (
    <Scroll>
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
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