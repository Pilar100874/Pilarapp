import { Text, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const textRef = useRef();
  const [visible, setVisible] = useState(false);

  useFrame((state) => {
    if (!textRef.current) return;
    
    // Start position is off-screen to the right
    const targetX = 0;
    const startX = 3;
    
    // Animate the text position from right to left
    textRef.current.position.x = MathUtils.lerp(
      textRef.current.position.x,
      visible ? targetX : startX,
      0.05
    );

    // Set visible after a small delay
    if (!visible && state.clock.elapsedTime > 0.5) {
      setVisible(true);
    }
  });

  return (
    <group position-y={0}>
      <mesh position-y={1}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent />
      </mesh>

      <group ref={textRef} position-x={3}>
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
      </group>

      <group
        position-y={-1.0}
        scale={isHovered ? 1.1 : 1}
        onClick={onStart}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <RoundedBox args={[2.2, 0.5, 0.1]} radius={0.25} smoothness={32}>
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