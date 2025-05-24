import { Scroll, Text } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y } from './constants';

export const Screen9 = () => {
  return (
    <Scroll>
      <group position-y={SCREEN9_OFFSET_START_Y}>
        <Text
          fontSize={0.1}
          letterSpacing={0.005}
          position-z={0.1}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          Endereço - Matriz: Rua Jardim Suspenso 126 - EMBU SP
          <meshBasicMaterial depthTest={false} />
        </Text>
        <Text
          fontSize={0.1}
          letterSpacing={0.005}
          position-z={0.1}
          position-y={-0.15}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          Tel (11) 2135-4444
          <meshBasicMaterial depthTest={false} />
        </Text>
      </group>
    </Scroll>
  );
};