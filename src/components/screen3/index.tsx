import { Scroll } from '@react-three/drei';
import { VideoPlane } from '@/components/VideoPlane';
import { Screen3Text } from './Screen3Text';

export const Screen3 = () => {
  return (
    <Scroll>
      <group position-y={-13.5}>
        <VideoPlane texturePath="opener.mp4" />
        <Screen3Text py={0.5} />
      </group>
    </Scroll>
  );
};