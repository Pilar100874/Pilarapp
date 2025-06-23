import { Scroll } from '@react-three/drei';
import { SCREEN11_OFFSET_START_Y, SCREEN11_MOBILE_PORTRAIT_ADJUSTMENT } from './constants';
import { ShopButton } from './ShopButton';
import { useResponsiveText } from '@/utils/responsive';

export const Screen11 = () => {
  const { isMobilePortrait } = useResponsiveText();
  
  // Adjust position for mobile portrait - move up by 120cm
  const adjustedY = isMobilePortrait 
    ? SCREEN11_OFFSET_START_Y + SCREEN11_MOBILE_PORTRAIT_ADJUSTMENT 
    : SCREEN11_OFFSET_START_Y;

  return (
    <Scroll>
      <group position-y={adjustedY}>
        <ShopButton />
      </group>
    </Scroll>
  );
};