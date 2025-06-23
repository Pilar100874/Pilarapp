import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback } from 'react';
import { MeshBasicMaterial, Texture } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [logoTexture, setLogoTexture] = useState<Texture | null>(null);
  const [startButtonTexture, setStartButtonTexture] = useState<Texture | null>(null);
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, getScale, isMobile } = useResponsiveText();

  // Load textures with error handling
  try {
    const logo = useTexture('/logo_branco.png');
    if (!logoTexture) setLogoTexture(logo);
  } catch (error) {
    console.warn('Failed to load logo texture:', error);
  }

  try {
    const startButton = useTexture('/iniciar.png');
    if (!startButtonTexture) setStartButtonTexture(startButton);
  } catch (error) {
    console.warn('Failed to load start button texture:', error);
  }

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
    // Just start the experience - music will start automatically in the opener
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
      {/* Only render logo if texture loaded successfully */}
      {logoTexture && (
        <mesh position-y={getSpacing(0.8, 0.6, 1.0, 1.2, 1.5)} scale={logoScale}>
          <planeGeometry args={[2, 1]} />
          <meshBasicMaterial map={logoTexture} transparent opacity={1} depthWrite={false} />
        </mesh>
      )}

      {/* Fallback text logo if image fails to load */}
      {!logoTexture && (
        <Text
          fontSize={getFontSize(0.4, 0.35, 0.5, 0.55, 0.7)}
          letterSpacing={0.02}
          position-y={getSpacing(0.8, 0.6, 1.0, 1.2, 1.5)}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="white"
        >
          PILAR
        </Text>
      )}

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

      {/* Start button - render with or without texture */}
      <mesh
        position-y={getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0)}
        scale={buttonScale}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[1, 1]} />
        {startButtonTexture ? (
          <meshBasicMaterial
            map={startButtonTexture}
            transparent
            opacity={1}
            depthTest={false}
            depthWrite={false}
          />
        ) : (
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.8}
            depthTest={false}
            depthWrite={false}
          />
        )}
      </mesh>

      {/* Fallback text for start button if texture fails */}
      {!startButtonTexture && (
        <Text
          fontSize={getFontSize(0.15, 0.12, 0.18, 0.2, 0.25)}
          position-y={getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0)}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="black"
        >
          INICIAR
        </Text>
      )}
    </group>
  );
};