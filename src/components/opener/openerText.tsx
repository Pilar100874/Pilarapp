import { Text, useTexture, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MeshBasicMaterial } from "three";

type OpenerText = {
  py: number;
};

export const OpenerText = ({ py }: OpenerText) => {
  const logoTexture = useTexture('/logo_branco.png');
  const logoRef = useRef<any>();
  const text1Ref = useRef<any>();
  const text2Ref = useRef<any>();
  const buttonRef = useRef<any>();
  const textRef = useRef<any>();
  const [startFade, setStartFade] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scroll = useScroll();

  useFrame((state) => {
    if (!logoRef.current?.material || !text1Ref.current?.material || !text2Ref.current?.material || !buttonRef.current?.material || !textRef.current?.material) return;

    if (state.clock.getElapsedTime() > 1 && !startFade) {
      setStartFade(true);
    }

    if (startFade) {
      const fadeTime = state.clock.getElapsedTime() - 1;
      const opacity = Math.min(fadeTime, 1);
      
      logoRef.current.material.opacity = opacity;
      text1Ref.current.material.opacity = opacity;
      text2Ref.current.material.opacity = opacity;
      buttonRef.current.material.opacity = opacity;
      textRef.current.material.opacity = opacity;
    } else {
      logoRef.current.material.opacity = 0;
      text1Ref.current.material.opacity = 0;
      text2Ref.current.material.opacity = 0;
      buttonRef.current.material.opacity = 0;
      textRef.current.material.opacity = 0;
    }
  });

  const handleClick = () => {
    const scrollElement = scroll.el;
    const currentScroll = scrollElement.scrollTop;
    const targetScroll = currentScroll + window.innerHeight;
    
    scrollElement.scrollTo({
      top: targetScroll,
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
        fontSize={0.35}
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
        fontSize={1.05}
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

      <group
        position-y={-3.9}
        scale={isHovered ? 1.1 : 1}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <mesh ref={buttonRef}>
          <circleGeometry args={[0.2, 32]} />
          <meshBasicMaterial transparent opacity={0} color="black" />
        </mesh>
        
        <Text
          ref={textRef}
          fontSize={0.15}
          position-z={0.01}
          font="https://fonts.gstatic.com/s/robotocondensed/v19/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQ.woff"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          color="white"
        >
          V
          <meshBasicMaterial transparent opacity={0} depthTest={false} color="white" />
        </Text>
      </group>
    </group>
  );
};