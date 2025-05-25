import { Scroll, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { SCREEN9_OFFSET_START_Y } from './constants';
import { MathUtils } from 'three';

export const Screen9 = () => {
  const textRef = useRef<any>();
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!textRef.current) return;

    const time = (Date.now() - startTime.current) / 1000;
    const boomerangCycle = Math.sin(time * 2) * 0.5; // Controls the speed and range of movement
    
    // Boomerang effect - combines rotation and position
    textRef.current.rotation.y = boomerangCycle * Math.PI * 0.25;
    textRef.current.position.x = boomerangCycle * 2;
    
    // Add a slight up and down movement
    textRef.current.position.y = SCREEN9_OFFSET_START_Y + Math.sin(time * 3) * 0.2;
    
    // Scale effect
    const scale = MathUtils.lerp(0.8, 1.2, (Math.sin(time * 2) + 1) * 0.5);
    textRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Scroll>
      <Text
        ref={textRef}
        fontSize={2}
        letterSpacing={0.005}
        position-y={SCREEN9_OFFSET_START_Y}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        Pilar Pap
        <meshBasicMaterial depthTest={false} />
      </Text>
    </Scroll>
  );
};