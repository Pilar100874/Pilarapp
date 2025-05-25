import { Scroll } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export const Screen3 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const groupRef = useRef<Group>(null);
  const targetRotation = useRef(0);

  const handlePhotoClick = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Calculate target rotation to snap to clicked photo
    targetRotation.current = (currentPosition / photoList.length) * Math.PI * 2;
    
    // Move clicked photo to front with elastic animation
    newOrder.splice(currentPosition, 1);
    newOrder.unshift(clickedIndex);
    
    setOrder(newOrder);
  };

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth rotation towards target
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      0.1
    );
  });

  return (
    <Scroll>
      <group 
        ref={groupRef}
        position-y={SCREEN3_OFFSET_START_Y}
      >
        {order.map((originalIndex, displayIndex) => {
          const [name, src] = photoList[originalIndex];
          const angle = (displayIndex / photoList.length) * Math.PI * 2;
          const radius = 4;
          
          return (
            <Photo
              key={name}
              src={src}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle + Math.PI, 0]}
              onClick={() => handlePhotoClick(originalIndex)}
            />
          );
        })}
      </group>
    </Scroll>
  );
};