import { Text } from '@react-three/drei';
import { SCREEN9_OFFSET_START_Y } from './constants';
import { useRef } from 'react';
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen9 } from './data';
import { useThree } from '@react-three/fiber';

type Word = {
  value: string;
  index: number;
};

export const Word = ({ index, value }: Word) => {
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);
  const { viewport } = useThree();

  // Calculate responsive font size (reduced by 30%)
  const isMobile = viewport.width < 5;
  const baseFontSize = isMobile ? 0.11 : 0.147; // Original sizes (0.157 and 0.21) reduced by 30%
  
  // Adjust vertical spacing proportionally
  const verticalSpacing = isMobile ? 1.26 : 1.68; // Original spacing (1.8 and 2.4) reduced by 30%

  // Adjust text width for better readability
  const maxWidth = isMobile ? 3.5 : 5.6; // Original widths (5 and 8) reduced by 30%

  return (
    <Text
      ref={ref}
      fontSize={baseFontSize}
      letterSpacing={0.005}
      position-y={SCREEN9_OFFSET_START_Y - 1 * -index * verticalSpacing}
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