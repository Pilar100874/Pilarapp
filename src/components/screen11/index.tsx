import { Scroll } from '@react-three/drei';
import { SCREEN11_OFFSET_START_Y } from './constants';
import { ShopButton } from './ShopButton';

export const Screen11 = () => {
  return (
    <Scroll>
      <group position-y={SCREEN11_OFFSET_START_Y}>
        <ShopButton />
      </group>
    </Scroll>
  );
};