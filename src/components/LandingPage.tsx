import { Text, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial } from 'three';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial>();
  const [animationComplete, setAnimationComplete] = useState(false);

  useFrame((state) => {
    if (!textRef.current || !materialRef.current || animationComplete) return;

    const elapsed = state.clock.getElapsedTime();
    const opacity = Math.min(elapsed * 0.5, 1);
    
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }

    if (opacity >= 1) {
      setAnimationComplete(true);
    }
  });

  return (
    <group position-y={0}>
      {/* Logo with full opacity */}
      <mesh position-y={1.5} scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} />
      </mesh>

      <Text
        ref={textRef}
        fontSize={0.6}
        letterSpacing={0.005}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef} transparent depthTest={false} />
      </Text>

      <group
        position-y={-1.0}
        scale={isHovered ? 1.1 : 1}
        onClick={onStart}
        onPointerEnter={() => {
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <RoundedBox args={[2.5, 0.6, 0.1]} radius={0.25} smoothness={32}>
          <meshBasicMaterial color="white" />
        </RoundedBox>
        <Text
          fontSize={0.18}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="black"
        >
          INICIAR A EXPERIÊNCIA
          <meshBasicMaterial depthTest={false} color="black" />
        </Text>
      </group>
    </group>
  );
};