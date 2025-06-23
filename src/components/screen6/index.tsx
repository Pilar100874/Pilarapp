import { Scroll } from '@react-three/drei';
import { SCREEN6_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';
import { useState } from 'react';
import { useTexture } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

export const Screen6 = () => {
  const photoList = Object.entries(dataPhotos);
  const [order, setOrder] = useState(photoList.map((_, i) => i));
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const playTexture = useTexture('/play.png');
  const { getFontSize, getSpacing } = useResponsiveText();

  const rotatePhotos = (clickedIndex: number) => {
    const newOrder = [...order];
    const currentPosition = order.indexOf(clickedIndex);
    
    // Move clicked photo to front by rotating array
    const itemsToRotate = newOrder.splice(currentPosition);
    newOrder.unshift(...itemsToRotate);
    
    setOrder(newOrder);
  };

  // Responsive button positioning - centered below the images
  // Reduced by 10%: multiply each value by 0.9
  const buttonScale = getFontSize(0.36, 0.315, 0.405, 0.45, 0.495);
  // Moved up by 7cm total (0.7 units): subtract 0.7 from each value
  const buttonY = getSpacing(-3.0, -2.5, -3.3, -3.5, -4.0);

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

        {/* Play/Pause Button - centered below images, reduced by 10% and moved up 7cm total */}
        <mesh
          position={[0, buttonY, 1]}
          scale={[buttonScale, buttonScale, 1]}
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
      </group>
    </Scroll>
  );
};