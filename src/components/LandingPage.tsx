import { Text, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial } from 'three';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial>();
  const [animationComplete, setAnimationComplete] = useState(false);
  const buttonRef = useRef<any>();
  const buttonTextRef = useRef<any>();

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

    // Button hover animation
    if (buttonRef.current && buttonTextRef.current) {
      const scale = isHovered ? 1.05 : 1;
      buttonRef.current.scale.x = scale;
      buttonRef.current.scale.y = scale;
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
        onClick={onStart}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {/* Button background */}
        <mesh ref={buttonRef}>
          <roundedBoxGeometry args={[2.2, 0.5, 0.1]} radius={0.12} smoothness={4} />
          <meshBasicMaterial color={isHovered ? 'black' : 'white'} />
        </mesh>

        {/* Button text */}
        <Text
          ref={buttonTextRef}
          fontSize={0.15}
          position-z={0.06}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          INICIAR EXPERIÊNCIA
          <meshBasicMaterial color={isHovered ? 'white' : 'black'} depthTest={false} />
        </Text>
      </group>
    </group>
  );
};