import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState } from 'react';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();

  return (
    <group position-y={0}>
      <Text
        fontSize={1.2}
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
          <planeGeometry args={[4, 1]} />
          <meshBasicMaterial color={isHovered ? '#646cff' : '#444'} />
        </mesh>
        <Text
          fontSize={0.4}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          Iniciar a Experiência
          <meshBasicMaterial depthTest={false} />
        </Text>
      </group>
    </group>
  );
};