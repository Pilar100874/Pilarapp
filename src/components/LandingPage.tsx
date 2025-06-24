import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart, loadingProgress }: { onStart: () => void; loadingProgress: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const progressBarRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const progressMaterialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, getScale, isMobile } = useResponsiveText();

  // Show button only when loading is complete
  const isLoadingComplete = loadingProgress >= 100;

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
    if (!isLoadingComplete) return;
    setIsHovered(true);
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile, isLoadingComplete]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  const handleClick = useCallback((event: any) => {
    if (!isLoadingComplete) return;
    event.stopPropagation();
    onStart();
  }, [onStart, isLoadingComplete]);

  useFrame((state) => {
    if (!textRef.current || animationComplete) return;

    const elapsed = state.clock.getElapsedTime();
    const opacity = Math.min(elapsed * 0.5, 1);
    
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }

    // Update progress bar fill
    if (progressBarRef.current && progressMaterialRef.current) {
      const progressWidth = (loadingProgress / 100) * 4.5; // 4.5 is approximate text width
      progressBarRef.current.scale.x = progressWidth;
      progressMaterialRef.current.opacity = opacity * 0.8; // Slightly transparent
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

      {/* Background text (lighter) */}
      <Text
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        color="#666666"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} depthWrite={false} />
      </Text>

      {/* Progress bar overlay (white fill from left to right) */}
      <mesh
        ref={progressBarRef}
        position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
        position-z={0.11}
        position-x={-2.25} // Start from left edge
      >
        <planeGeometry args={[1, 0.4]} />
        <meshBasicMaterial 
          ref={progressMaterialRef as any}
          color="#ffffff" 
          transparent 
          opacity={0}
          depthTest={false} 
          depthWrite={false} 
        />
      </mesh>

      {/* Progress text overlay (white text that appears as progress fills) */}
      <Text
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.12}
        position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        color="#ffffff"
      >
        PILAR APRESENTA
        <meshBasicMaterial 
          transparent 
          opacity={loadingProgress / 100}
          depthTest={false} 
          depthWrite={false} 
        />
      </Text>

      {/* Loading percentage */}
      <Text
        fontSize={fontSize * 0.5}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.4, -0.45, -0.35, -0.3, -0.25)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        color="#888888"
      >
        {Math.round(loadingProgress)}%
        <meshBasicMaterial transparent depthTest={false} depthWrite={false} />
      </Text>

      {/* Start button - only show when loading is complete */}
      {isLoadingComplete && (
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
      )}
    </group>
  );
};