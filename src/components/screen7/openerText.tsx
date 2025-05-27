import { Text } from "@react-three/drei";

type OpenerText = {
  py: number;
};

export const OpenerText = ({ py }: OpenerText) => {
  return (
    <group position-y={py}>
      <Text
        fontSize={0.35}
        letterSpacing={0.005}
        position-z={0.1}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        NOSSA 
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
        HISTÓRIA
        <meshBasicMaterial depthTest={false} />
      </Text>
    </group>
  );
};