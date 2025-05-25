import { Scroll, Text, useThree } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y } from './constants';

export const Screen9 = () => {
  const { viewport } = useThree();
  const fontSize = Math.min(2, viewport.width / 3);

  return (
    <Scroll>
      <Text
        fontSize={fontSize}
        letterSpacing={0.005}
        position-y={SCREEN9_OFFSET_START_Y}
        position-z={0.1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        Pilar Pap
        <meshBasicMaterial depthTest={false} />
      </Text>
    </Scroll>
  );
};