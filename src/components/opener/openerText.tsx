import { Text, useTexture, useScroll } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useCallback } from "react";
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
  const { getFontSize, getSpacing, getScale, isMobile, isTabletPortrait, isMobilePortrait } = useResponsiveText();

  // Responsive font sizes with orientation consideration
  const text1Size = getFontSize(0.2, 0.18, 0.25, 0.28, 0.35);
  const text2Size = getFontSize(0.45, 0.4, 0.55, 0.65, 0.84);
  
  // Arrow scale with orientation
  const arrowScale = [
    getScale(0.3, 0.25, 0.35, 0.4, 0.5),
    getScale(0.3, 0.25, 0.35, 0.4, 0.5),
    1
  ] as [number, number, number];
  
  // Arrow position with orientation - moved down by 8cm total (0.8 units)
  const arrowY = getSpacing(-2.8, -2.3, -3.2, -3.5, -4.2);

  // Determine if we should use split text layout
  const useSplitText = isMobilePortrait || isTabletPortrait;

  // Smooth arrow click handler
  const handleArrowClick = useCallback((event: any) => {
    event.stopPropagation();
    scroll.el.scrollTo({
      top: scroll.el.scrollHeight * 0.10,
      behavior: 'smooth'
    });
  }, [scroll]);

  // Smooth hover handlers
  const handlePointerOver = useCallback(() => {
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile]);

  const handlePointerOut = useCallback(() => {
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  useFrame((state) => {
    // Check if all required refs exist based on layout
    const requiredRefs = [logoRef.current?.material, text1Ref.current?.material, arrowRef.current?.material];
    
    if (useSplitText) {
      requiredRefs.push(
        text2Ref.current?.material,
        text3Ref.current?.material,
        text4Ref.current?.material
      );
    } else {
      requiredRefs.push(text2Ref.current?.material);
    }

    if (requiredRefs.some(ref => !ref)) return;

    if (state.clock.getElapsedTime() > 1 && !startFade) {
      setStartFade(true);
    }

    if (startFade) {
      const fadeTime = state.clock.getElapsedTime() - 1;
      const opacity = Math.min(fadeTime, 1);
      
      logoRef.current.material.opacity = opacity;
      text1Ref.current.material.opacity = opacity;
      arrowRef.current.material.opacity = opacity;
      
      if (useSplitText) {
        text2Ref.current.material.opacity = opacity;
        text3Ref.current.material.opacity = opacity;
        text4Ref.current.material.opacity = opacity;
      } else {
        text2Ref.current.material.opacity = opacity;
      }
    } else {
      logoRef.current.material.opacity = 0;
      text1Ref.current.material.opacity = 0;
      arrowRef.current.material.opacity = 0;
      
      if (useSplitText) {
        text2Ref.current.material.opacity = 0;
        text3Ref.current.material.opacity = 0;
        text4Ref.current.material.opacity = 0;
      } else {
        text2Ref.current.material.opacity = 0;
      }
    }
  });

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
        <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
      </Text>

      {useSplitText ? (
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
            <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
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
            <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
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
            AQUI !!!
            <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
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
          VOCÊ ENCONTRA AQUI !!!
          <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
        </Text>
      )}

      <mesh 
        ref={arrowRef}
        position-y={arrowY}
        scale={arrowScale}
        onClick={handleArrowClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
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