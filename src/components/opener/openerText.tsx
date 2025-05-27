import { Text, useTexture, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MeshBasicMaterial } from "three";

type OpenerText = {
  py: number;
};

export const OpenerText = ({ py }: OpenerText) => {
  const logoTexture = useTexture('/logo_branco.png');
  const arrowTexture = useTexture('/seta_B.png');
  const logoRef = useRef<any>();
  const text1Ref = useRef<any>();
  const text2Ref = useRef<any>();
  const text3Ref = useRef<any>();
  const text4Ref = useRef<any>();
  const arrowRef = useRef<any>();
  const [startFade, setStartFade] = useState(false);
  const scroll = useScroll();
  const { viewport } = useThree();

  // Calculate responsive sizes
  const isMobile = viewport.width < 5;
  const text1Size = isMobile ? 0.25 : 0.35;
  const text2Size = isMobile ? 0.6 : 0.84;
  const arrowScale = isMobile ? [0.35, 0.35, 1] as [number, number, number] : [0.5, 0.5, 1] as [number, number, number];
  // Move arrow up by 0.5cm (approximately -3.9 for desktop, -2.9 for mobile)
  const arrowY = isMobile ? -2.9 : -3.9;

  useFrame((state) => {
    if (!logoRef.current?.material || !text1Ref.current?.material || 
        !text2Ref.current?.material || !arrowRef.current?.material ||
        (isMobile && (!text3Ref.current?.material || !text4Ref.current?.material))) return;

    if (state.clock.getElapsedTime() > 1 && !startFade) {
      setStartFade(true);
    }

    if (startFade) {
      const fadeTime = state.clock.getElapsedTime() - 1;
      const opacity = Math.min(fadeTime, 1);
      
      logoRef.current.material.opacity = opacity;
      text1Ref.current.material.opacity = opacity;
      text2Ref.current.material.opacity = opacity;
      if (isMobile) {
        text3Ref.current.material.opacity = opacity;
        text4Ref.current.material.opacity = opacity;
      }
      arrowRef.current.material.opacity = opacity;
    } else {
      logoRef.current.material.opacity = 0;
      text1Ref.current.material.opacity = 0;
      text2Ref.current.material.opacity = 0;
      if (isMobile) {
        text3Ref.current.material.opacity = 0;
        text4Ref.current.material.opacity = 0;
      }
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
        scale={[1.5, 1.5, 1]}
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
        fontSize={text1Size}
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

      {isMobile ? (
        <>
          <Text
            ref={text2Ref}
            fontSize={text2Size}
            letterSpacing={0.005}
            position-z={0.1}
            position-y={-0.75}
            textAlign={"left"}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            VOCÊ
            <meshBasicMaterial transparent opacity={0} depthTest={false} />
          </Text>
          <Text
            ref={text3Ref}
            fontSize={text2Size}
            letterSpacing={0.005}
            position-z={0.1}
            position-y={-1.5}
            textAlign={"left"}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            ENCONTRA
            <meshBasicMaterial transparent opacity={0} depthTest={false} />
          </Text>
          <Text
            ref={text4Ref}
            fontSize={text2Size}
            letterSpacing={0.005}
            position-z={0.1}
            position-y={-2.25}
            textAlign={"left"}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            AQUI !!
            <meshBasicMaterial transparent opacity={0} depthTest={false} />
          </Text>
        </>
      ) : (
        <Text
          ref={text2Ref}
          fontSize={text2Size}
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
      )}

      <mesh 
        ref={arrowRef}
        position-y={arrowY}
        scale={arrowScale}
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