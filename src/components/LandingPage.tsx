import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsive } from '@/hooks/useResponsive';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { isPortrait, getTextSize, getSpacing } = useResponsive();

  // Calculate responsive scales
  const logoScale = isPortrait ? [0.8, 0.8, 1] : [1.5, 1.5, 1];
  const fontSize = getTextSize(0.6);
  const buttonScale = isHovered 
    ? (isPortrait ? [1.2, 0.3, 1] : [2.16, 0.54, 1])
    : (isPortrait ? [1.1, 0.275, 1] : [1.98, 0.495, 1]);

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

  const verticalSpacing = getSpacing(1.1);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        // Try to re-enter fullscreen if it was exited
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen().catch(() => {});
        } else if ((element as any).webkitRequestFullscreen) {
          (element as any).webkitRequestFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <group position-y={0}>
      <mesh position-y={isPortrait ? 0.8 : 1.5} scale-x={logoScale[0]} scale-y={logoScale[1]} scale-z={logoScale[2]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} />
      </mesh>

      <Text
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={isPortrait ? 0 : undefined}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} />
      </Text>

      <mesh
        position-y={isPortrait ? -0.6 : -1.0}
        scale-x={buttonScale[0]}
        scale-y={buttonScale[1]}
        scale-z={buttonScale[2]}
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