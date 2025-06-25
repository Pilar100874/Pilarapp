import { Scroll } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y, SCREEN9_MOBILE_PORTRAIT_ADJUSTMENT, SCREEN9_TABLET_PORTRAIT_ADJUSTMENT } from './constants';
import { dataScreen9 } from './data';
import { Word } from './word';
import { ShopButton } from './ShopButton';
import { useResponsiveText } from '@/utils/responsive';

export const Screen9 = () => {
  const { isMobilePortrait, isTabletPortrait } = useResponsiveText();
  
  // Adjust position based on device and orientation
  let adjustedY = SCREEN9_OFFSET_START_Y;
  
  if (isMobilePortrait) {
    adjustedY = SCREEN9_OFFSET_START_Y + SCREEN9_MOBILE_PORTRAIT_ADJUSTMENT;
  } else if (isTabletPortrait) {
    adjustedY = SCREEN9_OFFSET_START_Y + SCREEN9_TABLET_PORTRAIT_ADJUSTMENT;
  }

  return (
    <Scroll>
      <group position-y={adjustedY}>
        {dataScreen9.map((word, i) => (
          <Word key={word} value={word} index={dataScreen9.length - i} />
        ))}
        
        {/* Show button after text only for tablet portrait */}
        {isTabletPortrait && (
          <group position-y={-3.0}> {/* Position below the text */}
            <ShopButton />
          </group>
        )}
      </group>
    </Scroll>
  );
};