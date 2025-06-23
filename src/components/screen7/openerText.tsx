import { Text } from "@react-three/drei";
import { useResponsiveText } from '@/utils/responsive';

type OpenerText = {
  py: number;
};

export const OpenerText = ({ py }: OpenerText) => {
  const { getFontSize, getSpacing } = useResponsiveText();

  return (
    <group position-y={py}>
      <Text
        fontSize={getFontSize(0.25, 0.22, 0.28, 0.3, 0.35)}
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
        fontSize={getFontSize(0.75, 0.65, 0.85, 0.9, 1.05)}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.6, -0.5, -0.65, -0.7, -0.75)}
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