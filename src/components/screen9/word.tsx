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

  // Calculate responsive font size (increased by 2 sizes from previous values)
  const isMobile = viewport.width < 5;
  const baseFontSize = isMobile ? 0.19 : 0.25; // Increased from 0.11 and 0.147
  
  // Adjust vertical spacing proportionally
  const verticalSpacing = isMobile ? 2.1 : 2.8; // Increased from 1.26 and 1.68
  
  // Adjust text width for better readability
  const maxWidth = isMobile ? 5.8 : 9.3; // Increased from 3.5 and 5.6

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