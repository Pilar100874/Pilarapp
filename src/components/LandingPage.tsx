import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState } from 'react';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();

  return (
    <group position-y={0}>
      <Text
        fontSize={0.6}
        letterSpacing={0.005}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA:
        <meshBasicMaterial depthTest={false} />
      </Text>

      <group
        position-y={-1.5}
        scale={isHovered ? 1.1 : 1}
        onClick={onStart}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <mesh>
          <planeGeometry args={[2.4, 0.6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <Text
          fontSize={0.2}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="black"
        >
          {' Iniciar a Experiência '}
          <meshBasicMaterial depthTest={false} color="black" />
        </Text>
      </group>
    </group>
  );
};