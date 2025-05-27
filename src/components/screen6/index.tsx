import { Scroll, Text } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';
import { Shape } from 'three';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);

  const rotatePhotos = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front by rotating array
    const itemsToRotate = newOrder.splice(currentPosition);
    newOrder.unshift(...itemsToRotate);
    
    setOrder(newOrder);
  };

  // Create Shape objects for play and pause icons
  const createShape = (points: { x: number; y: number }[]) => {
    const shape = new Shape();
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y); // Close the shape
    return shape;
  };

  const playShape = createShape([
    { x: -0.15, y: -0.15 },
    { x: -0.15, y: 0.15 },
    { x: 0.15, y: 0 }
  ]);

  const pauseShape = createShape([
    { x: -0.15, y: -0.15 },
    { x: -0.15, y: 0.15 },
    { x: -0.05, y: 0.15 },
    { x: -0.05, y: -0.15 },
    { x: 0.05, y: -0.15 },
    { x: 0.05, y: 0.15 },
    { x: 0.15, y: 0.15 },
    { x: 0.15, y: -0.15 }
  ]);

  return (
    <Scroll>
      <group position-y={SCREEN6_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
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
        
        {/* Play/Pause Button */}
        <group position-y={-3}>
          <mesh
            onClick={() => setIsAnimationPaused(!isAnimationPaused)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
          >
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial color="white" transparent opacity={0} />
            <shapeGeometry args={[isAnimationPaused ? playShape : pauseShape]} />
          </mesh>
        </group>
      </group>
    </Scroll>
  );
};