import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, isMobile } = useResponsiveText();

  // Responsive scaling
  const logoScale = [
    getFontSize(0.8, 1.2, 1.5),
    getFontSize(0.8, 1.2, 1.5),
    1
  ] as [number, number, number];
  
  const fontSize = getFontSize(0.3, 0.45, 0.6);
  
  const buttonScale = (isHovered 
    ? [getFontSize(1.3, 1.8, 2.16), getFontSize(0.325, 0.45, 0.54), 1]
    : [getFontSize(1.2, 1.65, 1.98), getFontSize(0.3, 0.4125, 0.495), 1]) as [number, number, number];

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
      <mesh position-y={getSpacing(0.8, 1.2, 1.5)} scale={logoScale}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} />
      </mesh>

      <Text
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.1, -0.05, 0)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} />
      </Text>

      <mesh
        position-y={getSpacing(-0.6, -0.8, -1.0)}
        scale={buttonScale}
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