import { Text } from '@react-three/drei';
import { SCREEN10_OFFSET_START_Y } from './constants';
import { useRef } from 'react';
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen10 } from './data';
import { useThree } from '@react-three/fiber';

type Word = {
  value: string;
  index: number;
};

export const Word = ({ index, value }: Word) => {
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);
  const { viewport } = useThree();

  // Calculate responsive font size with 10% reduction
  const isMobile = viewport.width < 5;
  const baseFontSize = isMobile ? 0.54 : 0.765; // Base size reduced by 10%
  const fontSize = value === 'ALGUNS' 
    ? (isMobile ? 0.36 : 0.535) // 'ALGUNS' size reduced by 10%
    : baseFontSize;

  // Adjust vertical spacing for mobile
  const verticalSpacing = isMobile ? 0.9 : 1.1;

  return (
    <Text
      ref={ref}
      fontSize={fontSize}
      letterSpacing={0.005}
      position-y={SCREEN10_OFFSET_START_Y - 1 * -index * verticalSpacing}
      textAlign={'left'}
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
    >
      {value}
      <meshBasicMaterial transparent ref={refMaterial} side={DoubleSide} opacity={1} />
    </Text>
  );
};