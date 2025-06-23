import { Scroll } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y, SCREEN9_MOBILE_PORTRAIT_ADJUSTMENT } from './constants';
import { dataScreen9 } from './data';
import { Word } from './word';
import { useResponsiveText } from '@/utils/responsive';

export const Screen9 = () => {
  const { isMobilePortrait } = useResponsiveText();
  
  // Adjust position for mobile portrait - move up by 6cm
  const adjustedY = isMobilePortrait 
    ? SCREEN9_OFFSET_START_Y + SCREEN9_MOBILE_PORTRAIT_ADJUSTMENT 
    : SCREEN9_OFFSET_START_Y;

  return (
    <Scroll>
      <group position-y={adjustedY}>
        {dataScreen9.map((word, i) => (
          <Word key={word} value={word} index={dataScreen9.length - i} />
        ))}
      </group>
    </Scroll>
  );
};