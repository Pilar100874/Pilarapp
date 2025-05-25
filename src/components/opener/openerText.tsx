import { Text, useTexture, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MeshBasicMaterial } from "three";

type OpenerText = {
  py: number;
};

export const OpenerText = ({ py }: OpenerText) => {
  const { viewport } = useThree();
  const logoTexture = useTexture('/logo_branco.png');
  const arrowTexture = useTexture('/seta_B.png');
  const logoRef = useRef<any>();
  const text1Ref = useRef<any>();
  const text2Ref = useRef<any>();
  const arrowRef = useRef<any>();
  const [startFade, setStartFade] = useState(false);
  const scroll = useScroll();

  // Calculate responsive sizes based on viewport
  const logoScale = Math.min(1.5, viewport.width / 4);
  const smallTextSize = Math.min(0.35, viewport.width / 15);
  const largeTextSize = Math.min(1.05, viewport.width / 5);
  const arrowScale = Math.min(0.5, viewport.width / 10);

  useFrame((state) => {
    if (!logoRef.current?.material || !text1Ref.current?.material || !text2Ref.current?.material || !arrowRef.current?.material) return;

    if (state.clock.getElapsedTime() > 1 && !startFade) {
      setStartFade(true);
    }

    if (startFade) {
      const fadeTime = state.clock.getElapsedTime() - 1;
      const opacity = Math.min(fadeTime, 1);
      
      logoRef.current.material.opacity = opacity;
      text1Ref.current.material.opacity = opacity;
      text2Ref.current.material.opacity = opacity;
      arrowRef.current.material.opacity = opacity;
    } else {
      logoRef.current.material.opacity = 0;
      text1Ref.current.material.opacity = 0;
      text2Ref.current.material.opacity = 0;
      arrowRef.current.material.opacity = 0;
    }
  });

  const handleArrowClick = () => {
    scroll.el.scrollTo({
      top: scroll.el.scrollHeight * 0.10,
      behavior: 'smooth'
    });
  };

  return (
    <group position-y={py}>
      <mesh 
        ref={logoRef}
        position-y={1.25} 
        scale={[logoScale, logoScale, 1]}
      >
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Text
        ref={text1Ref}
        fontSize={smallTextSize}
        letterSpacing={0.005}
        position-z={0.1}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PROCURANDO PAPÉIS ??
        <meshBasicMaterial transparent opacity={0} depthTest={false} />
      </Text>

      <Text
        ref={text2Ref}
        fontSize={largeTextSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={-0.75}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        VOCÊ ENCONTRA AQUI !!
        <meshBasicMaterial transparent opacity={0} depthTest={false} />
      </Text>

      <mesh 
        ref={arrowRef}
        position-y={-3.4} 
        scale={[arrowScale, arrowScale, 1]}
        onClick={handleArrowClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          map={arrowTexture} 
          transparent 
          opacity={0}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};