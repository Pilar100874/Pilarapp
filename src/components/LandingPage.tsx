import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, getScale, isMobile } = useResponsiveText();

  // Responsive scaling with orientation consideration
  const logoScale = [
    getScale(0.8, 0.7, 1.0, 1.2, 1.5),
    getScale(0.8, 0.7, 1.0, 1.2, 1.5),
    1
  ] as [number, number, number];
  
  // Font size with orientation adjustments
  const fontSize = getFontSize(0.3, 0.25, 0.4, 0.45, 0.6);
  
  // Button scale with hover and orientation
  const buttonScale = (isHovered 
    ? [
        getFontSize(1.3, 1.1, 1.6, 1.8, 2.16), 
        getFontSize(0.325, 0.275, 0.4, 0.45, 0.54), 
        1
      ]
    : [
        getFontSize(1.2, 1.0, 1.45, 1.65, 1.98), 
        getFontSize(0.3, 0.25, 0.3625, 0.4125, 0.495), 
        1
      ]) as [number, number, number];

  // Smooth handlers to prevent flicker
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    
    // Start music immediately when button is clicked
    const audio = new Audio('/musica.mp3');
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch(error => {
      console.warn('Audio autoplay failed:', error);
    });
    
    onStart();
  }, [onStart]);

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
      <mesh position-y={getSpacing(0.8, 0.6, 1.0, 1.2, 1.5)} scale={logoScale}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} depthWrite={false} />
      </mesh>

      <Text
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} depthWrite={false} />
      </Text>

      <mesh
        position-y={getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0)}
        scale={buttonScale}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={startButtonTexture}
          transparent
          opacity={1}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};