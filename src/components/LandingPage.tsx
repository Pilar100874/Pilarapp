import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MeshBasicMaterial, RingGeometry, Group } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const progressRingRef = useRef<Group>(null);
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

  // Progress circle scale
  const progressScale = getScale(0.8, 0.7, 1.0, 1.2, 1.5);

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
          setIsLoaded(true);
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

    // Animate progress ring rotation
    if (progressRingRef.current && !isLoaded) {
      progressRingRef.current.rotation.z = elapsed * 2;
    }
  });

  // Create progress ring geometry
  const createProgressRing = (progress: number) => {
    const radius = 0.15;
    const thickness = 0.02;
    const segments = 64;
    const angle = (progress / 100) * Math.PI * 2;
    
    return new RingGeometry(radius - thickness, radius + thickness, 0, angle, segments);
  };

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

      {/* Loading Progress Circle or Start Button */}
      {!isLoaded ? (
        <group 
          ref={progressRingRef}
          position-y={getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0)}
          scale={[progressScale, progressScale, 1]}
        >
          {/* Background circle */}
          <mesh>
            <ringGeometry args={[0.13, 0.17, 64]} />
            <meshBasicMaterial color="#333333" transparent opacity={0.3} />
          </mesh>
          
          {/* Progress circle */}
          <mesh geometry={createProgressRing(loadingProgress)}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          
          {/* Center circle with percentage */}
          <mesh>
            <circleGeometry args={[0.12, 32]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
          
          {/* Percentage text */}
          <Text
            fontSize={getFontSize(0.08, 0.07, 0.09, 0.1, 0.12)}
            color="#ffffff"
            position-z={0.01}
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