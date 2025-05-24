import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState } from 'react';
import { RoundedBox } from '@react-three/drei';

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
        PILAR APRESENTA
        <meshBasicMaterial depthTest={false} />
      </Text>

      <group
        position-y={-1.0}
        scale={isHovered ? 1.1 : 1}
        onClick={onStart}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <RoundedBox args={[2.4, 0.5, 0.1]} radius={0.3} smoothness={16}>
          <meshBasicMaterial color="white" />
        </RoundedBox>
        <Text
          fontSize={0.15}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="black"
        >
          {' INICIAR A EXPERIÊNCIA '}
          <meshBasicMaterial depthTest={false} color="black" />
        </Text>
      </group>
    </group>
  );
}