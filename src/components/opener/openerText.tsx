import { Text, useTexture } from "@react-three/drei";

type OpenerText = {
  py: number;
};

export const OpenerText = ({ py }: OpenerText) => {
  const logoTexture = useTexture('/logo_branco.png');

  return (
    <group position-y={py}>
      {/* Logo */}
      <mesh position-y={1.5} scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={1} 
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Text
        fontSize={0.35}
        letterSpacing={0.005}
        position-z={0.1}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PROCURANDO PAPÉIS ??
        <meshBasicMaterial depthTest={false} />
      </Text>
      <Text
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
        <meshBasicMaterial depthTest={false} />
      </Text>
    </group>
  );
};