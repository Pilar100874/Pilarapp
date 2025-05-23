import { Text } from "@react-three/drei";

type Screen3Text = {
  py: number;
};

export const Screen3Text = ({ py }: Screen3Text) => {
  return (
    <group position-y={py}>
      <Text
        fontSize={0.25}
        letterSpacing={0.005}
        position-z={0.1}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        QUALIDADE E TRADIÇÃO
        <meshBasicMaterial depthTest={false} />
      </Text>
      <Text
        fontSize={1.25}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={-0.75}
        textAlign={"left"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        DESDE 1986
        <meshBasicMaterial depthTest={false} />
      </Text>
    </group>
  );
};