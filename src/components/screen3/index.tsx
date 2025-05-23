import { Scroll, Text } from '@react-three/drei';
import { SCREEN3_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';

export const Screen3 = () => {
  return (
    <Scroll>
      <group position-y={SCREEN3_OFFSET_START_Y} rotation-y={Math.PI * -0.05}>
        <Text
          fontSize={0.25}
          letterSpacing={0.005}
          position-z={0.1}
          textAlign={"left"}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          AN EXPERIENCE WITH SOCIAL MEDIA SUPERSTAR
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
          KHABY LAME
          <meshBasicMaterial depthTest={false} />
        </Text>
        {Object.entries(dataPhotos).map(([name, src], i) => (
          <Photo key={name} index={i} src={src} />
        ))}
      </group>
    </Scroll>
  );
};