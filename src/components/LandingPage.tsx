import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveText } from '@/utils/responsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [logoTexture, setLogoTexture] = useState<any>(null);
  const [startButtonTexture, setStartButtonTexture] = useState<any>(null);
  
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, getScale, isMobile } = useResponsiveText();

  // Load textures with error handling
  useEffect(() => {
    const loadTextures = async () => {
      try {
        const { useTexture } = await import('@react-three/drei');
        
        // Try to load textures
        try {
          const [logo, button] = await Promise.all([
            new Promise((resolve, reject) => {
              const loader = new (await import('three')).TextureLoader();
              loader.load('/logo_branco.png', resolve, undefined, reject);
            }),
            new Promise((resolve, reject) => {
              const loader = new (await import('three')).TextureLoader();
              loader.load('/iniciar.png', resolve, undefined, reject);
            })
          ]);
          
          setLogoTexture(logo);
          setStartButtonTexture(button);
          setTexturesLoaded(true);
        } catch (error) {
          console.warn('Texture loading failed, using fallback:', error);
          setTexturesLoaded(true); // Still proceed without textures
        }
      } catch (error) {
        console.error('Failed to load texture module:', error);
        setTexturesLoaded(true); // Proceed without textures
      }
    };

    loadTextures();
  }, []);

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

  if (!texturesLoaded) {
    return (
      <group position-y={0}>
        {/* Loading placeholder */}
        <mesh position-y={getSpacing(0.8, 0.6, 1.0, 1.2, 1.5)} scale={logoScale}>
          <planeGeometry args={[2, 1]} />
          <meshBasicMaterial color="white" transparent opacity={0.3} />
        </mesh>
        
        <Text
          fontSize={fontSize}
          letterSpacing={0.005}
          position-z={0.1}
          position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="white"
        >
          CARREGANDO...
        </Text>
      </group>
    );
  }

  return (
    <group position-y={0}>
      {/* Logo */}
      <mesh position-y={getSpacing(0.8, 0.6, 1.0, 1.2, 1.5)} scale={logoScale}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={1} 
          depthWrite={false}
          color={logoTexture ? "white" : "white"}
        />
      </mesh>

      {/* Text */}
      <Text
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        color="white"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} depthWrite={false} />
      </Text>

      {/* Start Button */}
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
          color={startButtonTexture ? "white" : "white"}
        />
      </mesh>
    </group>
  );
};