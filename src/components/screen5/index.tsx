import { Scroll } from '@react-three/drei';
import { SCREEN5_OFFSET_START_Y } from './constants';
import { dataPhotos } from './dataPhotos';
import { Photo } from './photo';

export const Screen5 = () => {
  return (
    <Scroll>
      <group position-y={SCREEN5_OFFSET_START_Y}>
        {Object.entries(dataPhotos).map(([name, src], i) => (
          <Photo key={name} index={i} src={src} />
        ))}
      </group>
    </Scroll>
  );
};