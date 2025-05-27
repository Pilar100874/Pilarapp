import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';
import { useTexture } from '@react-three/drei';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const playTexture = useTexture('/play.png');

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
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        {/* Play/Pause Button */}
        <mesh
          position={[-2, 0, 2]}
          {/* Reduced by 10% from 0.5 to 0.45 */}
          scale={[0.45, 0.45, 1]}
          rotation={[0, 0, isAnimationPaused ? Math.PI : 0]}
          onClick={() => setIsAnimationPaused(!isAnimationPaused)}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={playTexture} 
            transparent 
            opacity={1} 
            depthTest={false}
            alphaTest={0.1}
          />
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
              onClick={() => rotatePhotos(originalIndex)}
              isPaused={isAnimationPaused}
            />
          );
        })}
      </group>
    </Scroll>
  );
};