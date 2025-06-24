import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Progress bar dimensions - responsive
  const progressBarWidth = getFontSize(2.0, 1.8, 2.2, 2.5, 3.0);
  const progressBarHeight = getFontSize(0.08, 0.07, 0.09, 0.1, 0.12);

  // Background loading simulation
  useEffect(() => {
    const loadAssets = async () => {
      // Simulate loading various assets
      const totalSteps = 20;
      let currentStep = 0;

      const updateProgress = () => {
        currentStep++;
        const progress = (currentStep / totalSteps) * 100;
        setLoadingProgress(progress);

        if (progress >= 100) {
          // Small delay before showing button
          setTimeout(() => setIsLoaded(true), 300);
        } else {
          // Random delay between 100-300ms to simulate real loading
          setTimeout(updateProgress, Math.random() * 200 + 100);
        }
      };

      // Start loading after a small delay
      setTimeout(updateProgress, 500);
    };

    loadAssets();
  }, []);

  // Smooth handlers to prevent flicker
  const handlePointerEnter = useCallback(() => {
    if (isLoaded) {
      setIsHovered(true);
      if (!isMobile) {
        document.body.style.cursor = 'pointer';
      }
    }
  }, [isMobile, isLoaded]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  const handleClick = useCallback((event: any) => {
    if (!isLoaded) return;
    event.stopPropagation();
    onStart();
  }, [onStart, isLoaded]);

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

      {/* Loading Progress Bar or Start Button */}
      {!isLoaded ? (
        <group position-y={getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0)}>
          {/* Progress bar background */}
          <mesh position-z={0.01}>
            <planeGeometry args={[progressBarWidth, progressBarHeight]} />
            <meshBasicMaterial 
              color="#333333" 
              transparent 
              opacity={0.4} 
              depthWrite={false}
            />
          </mesh>
          
          {/* Progress bar fill */}
          <mesh 
            position-z={0.02}
            position-x={-(progressBarWidth / 2) + (progressBarWidth * loadingProgress / 100) / 2}
            scale-x={loadingProgress / 100}
          >
            <planeGeometry args={[progressBarWidth, progressBarHeight]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.9} 
              depthWrite={false}
            />
          </mesh>
          
          {/* Percentage text */}
          <Text
            fontSize={getFontSize(0.12, 0.1, 0.14, 0.16, 0.18)}
            color="#ffffff"
            position-z={0.03}
            position-y={getSpacing(-0.25, -0.2, -0.28, -0.3, -0.35)}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(loadingProgress)}%
          </Text>
        </group>
      ) : (
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