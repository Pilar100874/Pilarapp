import { Text, Scroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export const Screen4 = () => {
  const textRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!textRef.current) return;
    textRef.current.position.y = -20 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <Scroll>
      <Text
        ref={textRef}
        fontSize={0.8}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        position-z={0.5}
      >
        Mais de 30 mil metros de galpão{'\n'}para melhor atende-lo
        <meshBasicMaterial color="white" />
      </Text>
    </Scroll>
  );
};