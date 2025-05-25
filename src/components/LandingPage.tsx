import { Text, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial>();
  const buttonRef = useRef<any>();
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

    if (buttonRef.current) {
      // Add subtle floating animation
      buttonRef.current.position.y = -1.0 + Math.sin(elapsed * 2) * 0.03;
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
        ref={buttonRef}
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
        {/* Button shadow */}
        <RoundedBox args={[2.5, 0.6, 0.02]} radius={0.2} smoothness={4} position={[0, -0.05, -0.05]}>
          <meshBasicMaterial color="black" opacity={0.3} transparent />
        </RoundedBox>

        {/* Button back layer for depth */}
        <RoundedBox args={[2.5, 0.6, 0.15]} radius={0.2} smoothness={4} position={[0, 0, -0.075]}>
          <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.5} />
        </RoundedBox>

        {/* Main button face */}
        <RoundedBox args={[2.5, 0.6, 0.15]} radius={0.2} smoothness={4}>
          <meshStandardMaterial 
            color="white" 
            metalness={0.3} 
            roughness={0.4}
            emissive="white"
            emissiveIntensity={isHovered ? 0.2 : 0}
          />
        </RoundedBox>

        <Text
          fontSize={0.18}
          position-z={0.08}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="black"
        >
          INICIAR A EXPERIÊNCIA
          <meshStandardMaterial 
            color="black" 
            metalness={0.1} 
            roughness={0.8}
            depthTest={false} 
          />
        </Text>
      </group>
    </group>
  );
};