import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';
import { useTexture } from '@react-three/drei';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const arrowTexture = useTexture('/seta_B.png');

  const handlePrevious = () => {
    const newOrder = [...order];
    const last = newOrder.pop();
    if (last !== undefined) {
      newOrder.unshift(last);
      setOrder(newOrder);
    }
  };

  const handleNext = () => {
    const newOrder = [...order];
    const first = newOrder.shift();
    if (first !== undefined) {
      newOrder.push(first);
      setOrder(newOrder);
    }
  };

  return (
    <Scroll>
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {/* Previous Button */}
        <mesh
          position={[-5, 0, 0]}
          scale={[0.35, 0.35, 1]}
          rotation={[0, 0, Math.PI / 2]}
          onClick={handlePrevious}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
        </mesh>

        {/* Next Button */}
        <mesh
          position={[5, 0, 0]}
          scale={[0.35, 0.35, 1]}
          rotation={[0, 0, -Math.PI / 2]}
          onClick={handleNext}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={arrowTexture} transparent opacity={1} />
        </mesh>

        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          return (
            <Photo
              key={name}
              src={src}
              z={-displayIndex * 0.35}
              index={displayIndex}
              totalPhotos={photoList.length}
              onClick={() => {
                const newOrder = [...order];
                const currentPosition = displayIndex;
                const itemsToRotate = newOrder.splice(currentPosition);
                newOrder.unshift(...itemsToRotate);
                setOrder(newOrder);
              }}
            />
          );
        })}
      </group>
    </Scroll>
  );
};