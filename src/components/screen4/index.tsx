import { Text, Scroll, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial } from 'three';

export const Screen4 = () => {
  const textRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!textRef.current || !materialRef.current) return;

    // Floating animation
    textRef.current.position.y = -20 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    
    // Rotation and opacity animation based on scroll
    const rotY = scroll.offset * 5 - Math.PI / 8;
    textRef.current.rotation.y = rotY;
    materialRef.current.opacity = MathUtils.clamp(Math.pow(rotY + 1, 20), -Infinity, 1);
  });

  return (
    <Scroll>
      <Text
        ref={textRef}
        fontSize={0.8}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        position-z={0.5}
      >
        Breaking barriers through silence{'\n'}
        Inspiring millions with simplicity
        <meshBasicMaterial ref={materialRef} transparent side={DoubleSide} />
      </Text>
    </Scroll>
  );
};