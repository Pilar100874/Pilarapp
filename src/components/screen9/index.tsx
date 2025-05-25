import { Scroll, Text, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { SCREEN9_OFFSET_START_Y } from './constants';
import { MathUtils, Mesh } from 'three';

export const Screen9 = () => {
  const scroll = useScroll();
  const textRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!textRef.current) return;

    // Calculate scroll progress for this section
    const scrollProgress = MathUtils.clamp((scroll.offset * 9 - 8), 0, 1);
    
    // Animate scale and position based on scroll
    const scale = MathUtils.lerp(0.5, 2, scrollProgress);
    const yOffset = MathUtils.lerp(-5, 0, scrollProgress);
    const opacity = MathUtils.lerp(0, 1, scrollProgress);

    textRef.current.scale.setScalar(scale);
    textRef.current.position.y = SCREEN9_OFFSET_START_Y + yOffset;
    
    // Update material opacity
    if (textRef.current.material) {
      textRef.current.material.opacity = opacity;
    }
  });

  return (
    <Scroll>
      <Text
        ref={textRef}
        fontSize={2}
        letterSpacing={0.005}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        Pilar Pap
        <meshBasicMaterial transparent depthTest={false} />
      </Text>
    </Scroll>
  );
};