import { Text, useTexture, useScroll } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from "react";
import { MeshBasicMaterial } from "three";
import { useResponsiveText } from '@/utils/responsive';

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
  const { getFontSize, getSpacing, getScale, isMobileLandscape } = useResponsiveText();

  // Responsive font sizes with orientation consideration
  const text1Size = getFontSize(0.2, 0.18, 0.25, 0.28, 0.35);
  const text2Size = getFontSize(0.45, 0.4, 0.55, 0.65, 0.84);
  
  // Arrow scale with orientation
  const arrowScale = [
    getScale(0.3, 0.25, 0.35, 0.4, 0.5),
    getScale(0.3, 0.25, 0.35, 0.4, 0.5),
    1
  ] as [number, number, number];
  
  // Arrow position with orientation
  const arrowY = getSpacing(-2.0, -1.5, -2.4, -2.7, -3.4);

  useFrame((state) => {
    if (!logoRef.current?.material || !text1Ref.current?.material || 
        !text2Ref.current?.material || !arrowRef.current?.material ||
        (isMobileLandscape && (!text3Ref.current?.material || !text4Ref.current?.material))) return;

    if (state.clock.getElapsedTime() > 1 && !startFade) {
      setStartFade(true);
    }

    if (startFade) {
      const fadeTime = state.clock.getElapsedTime() - 1;
      const opacity = Math.min(fadeTime, 1);
      
      logoRef.current.material.opacity = opacity;
      text1Ref.current.material.opacity = opacity;
      text2Ref.current.material.opacity = opacity;
      if (isMobileLandscape) {
        text3Ref.current.material.opacity = opacity;
        text4Ref.current.material.opacity = opacity;
      }
      arrowRef.current.material.opacity = opacity;
    } else {
      logoRef.current.material.opacity = 0;
      text1Ref.current.material.opacity = 0;
      text2Ref.current.material.opacity = 0;
      if (isMobileLandscape) {
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
        position-y={getSpacing(1.0, 0.8, 1.1, 1.15, 1.25)} 
        scale={[
          getScale(1.2, 1.0, 1.3, 1.35, 1.5), 
          getScale(1.2, 1.0, 1.3, 1.35, 1.5), 
          1
        ]}
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

      {isMobileLandscape ? (
        <>
          <Text
            ref={text2Ref}
            fontSize={text2Size}
            letterSpacing={0.005}
            position-z={0.1}
            position-y={getSpacing(-0.6, -0.4, -0.65, -0.7, -0.75)}
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
            position-y={getSpacing(-1.2, -0.8, -1.3, -1.4, -1.5)}
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
            position-y={getSpacing(-1.8, -1.2, -1.95, -2.1, -2.25)}
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
          position-y={getSpacing(-0.6, -0.5, -0.65, -0.7, -0.75)}
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