import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i)); // ordem de exibição por índice

  const sendToBack = (clickedIndex: number) => {
    const newOrder = order.filter((i) => i !== clickedIndex);
    newOrder.push(clickedIndex); // move para o fundo
    setOrder(newOrder);
  };

  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
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