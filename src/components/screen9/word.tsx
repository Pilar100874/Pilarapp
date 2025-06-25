import { Text } from '@react-three/drei';
import { useRef } from 'react';
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen9 } from './data';
import { useResponsiveText } from '@/utils/responsive';

type Word = {
  value: string;
  index: number;
};

export const Word = ({ index, value }: Word) => {
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);
  const { getFontSize, getSpacing, isTabletPortrait } = useResponsiveText();

  // Responsive font sizes with orientation consideration - reduced for tablet portrait
  const baseFontSize = isTabletPortrait 
    ? getFontSize(0.12, 0.1, 0.13, 0.16, 0.21) // Reduced from 0.14 to 0.13 for tablet portrait
    : getFontSize(0.12, 0.1, 0.14, 0.16, 0.21);
  
  // Responsive vertical spacing with orientation
  const verticalSpacing = getSpacing(1.4, 1.2, 1.6, 1.8, 2.24);
  
  // Responsive text width with orientation - increase width for tablet portrait to prevent cutting
  let maxWidth = getFontSize(3.8, 5.5, 5.2, 6.0, 7.45);
  
  // Increase max width for tablet portrait to prevent text cutting
  if (isTabletPortrait) {
    maxWidth = maxWidth * 1.2; // Increase by 20% for tablet portrait
  }
  
  // Adjust text positioning for tablet portrait to fix left cut-off
  const textPositionX = isTabletPortrait ? 0.2 : 0; // Move text 2cm to the right for tablet portrait

  return (
    <Text
      ref={ref}
      fontSize={baseFontSize}
      letterSpacing={0.005}
      position-y={-1 * -index * verticalSpacing}
      position-x={textPositionX} // Add horizontal offset for tablet portrait
      textAlign={'left'}
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
      maxWidth={maxWidth}
      lineHeight={2}
    >
      {value}
      <meshBasicMaterial transparent ref={refMaterial} side={DoubleSide} opacity={1} />
    </Text>
  );
};