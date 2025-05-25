import { Text, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial } from 'three';

export const LandingPage = ({ onStart, loadingProgress = 0 }: { onStart: () => void; loadingProgress?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial>();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

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
  });

  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => setShowButton(true), 500);
    }
  }, [loadingProgress]);

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

      {/* Loading Progress Bar */}
      <group position-y={-1}>
        <RoundedBox args={[3, 0.1, 0.1]} radius={0.05} smoothness={4}>
          <meshBasicMaterial color="#333333" />
        </RoundedBox>
        <group position-x={-1.5 + (loadingProgress / 100) * 1.5}>
          <RoundedBox args={[loadingProgress / 100 * 3, 0.1, 0.1]} radius={0.05} smoothness={4} position-x={loadingProgress / 100 * 1.5}>
            <meshBasicMaterial color="white" />
          </RoundedBox>
        </group>
        <Text
          fontSize={0.15}
          position-y={0.2}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`${Math.round(loadingProgress)}%`}
          <meshBasicMaterial color="white" />
        </Text>
      </group>

      {showButton && (
        <group
          position-y={-2}
          scale={isHovered ? 1.1 : 1}
          onClick={onStart}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          <RoundedBox args={[2.2, 0.5, 0.1]} radius={0.25} smoothness={32}>
            <meshBasicMaterial color="white" />
          </RoundedBox>
          <Text
            fontSize={0.15}
            position-z={0.1}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            color="black"
          >
            {' INICIAR A EXPERIÊNCIA '}
            <meshBasicMaterial depthTest={false} color="black" />
          </Text>
        </group>
      )}
    </group>
  );
};