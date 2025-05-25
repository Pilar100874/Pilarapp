import { Text, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial } from 'three';

type LoadingProgress = {
  progress: number;
};

const LoadingIndicator = ({ progress }: LoadingProgress) => {
  return (
    <group position-y={-1.8}>
      <Text
        fontSize={0.15}
        position-y={0.4}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        {`${Math.round(progress * 100)}%`}
        <meshBasicMaterial color="white" transparent opacity={0.7} />
      </Text>
      <RoundedBox args={[2, 0.1, 0.1]} radius={0.05} smoothness={4}>
        <meshBasicMaterial color="white" transparent opacity={0.3} />
      </RoundedBox>
      <RoundedBox 
        args={[2 * progress, 0.1, 0.1]} 
        radius={0.05} 
        smoothness={4}
        position={[-1 + progress, 0, 0]}
      >
        <meshBasicMaterial color="white" />
      </RoundedBox>
    </group>
  );
};

export const LandingPage = ({ onStart, loadingProgress = 0 }: { onStart: () => void, loadingProgress: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial>();
  const [animationComplete, setAnimationComplete] = useState(false);

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

  return (
    <group position-y={0}>
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

      <group
        position-y={-1.0}
        scale={isHovered && loadingProgress === 1 ? 1.1 : 1}
        onClick={() => loadingProgress === 1 && onStart()}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <RoundedBox args={[2.2, 0.5, 0.1]} radius={0.25} smoothness={32}>
          <meshBasicMaterial color={loadingProgress === 1 ? "white" : "gray"} />
        </RoundedBox>
        <Text
          fontSize={0.15}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="black"
        >
          {loadingProgress === 1 ? 'INICIAR A EXPERIÊNCIA' : 'CARREGANDO...'}
          <meshBasicMaterial depthTest={false} color="black" />
        </Text>
      </group>

      <LoadingIndicator progress={loadingProgress} />
    </group>
  );
};