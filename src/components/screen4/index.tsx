import { Text, Scroll, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MeshBasicMaterial } from 'three';

export const Screen4 = () => {
  const textRef = useRef<Text>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!textRef.current) return;
    textRef.current.position.y = -20;
  });

  return (
    <Scroll>
      <group position-z={0.1}>
        <Text
          fontSize={0.25}
          letterSpacing={0.005}
          position-y={0.5}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          MAIS DE 30 MIL METROS DE GALPÃO
          <meshBasicMaterial depthTest={false} />
        </Text>
        <Text
          fontSize={1.25}
          letterSpacing={0.005}
          position-y={-0.75}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          PARA MELHOR{'\n'}ATENDE-LO
          <meshBasicMaterial depthTest={false} />
        </Text>
      </group>
    </Scroll>
  );
};