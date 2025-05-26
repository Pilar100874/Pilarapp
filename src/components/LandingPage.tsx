import { Text, useTexture } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveScale } from '@/utils/responsive';

interface LandingPageProps {
  onStart: () => void;
  isMobile: boolean;
}

export const LandingPage = ({ onStart, isMobile }: LandingPageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const textScale = useResponsiveScale(0.6, isMobile);
  const logoScale = useResponsiveScale(1.5, isMobile);
  const buttonScale = isHovered 
    ? useResponsiveScale(2.16, isMobile) 
    : useResponsiveScale(1.98, isMobile);

  useFrame((state) => {
    if (!textRef.current || animationComplete) return;

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
      <mesh position-y={1.5} scale={[logoScale, logoScale, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} />
      </mesh>

      <Text
        ref={textRef}
        fontSize={textScale}
        letterSpacing={0.005}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} />
      </Text>

      <mesh
        position-y={-1.0}
        scale={[buttonScale, buttonScale * 0.25, 1]}
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
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={startButtonTexture}
          transparent
          opacity={1}
          depthTest={false}
        />
      </mesh>
    </group>
  );
};