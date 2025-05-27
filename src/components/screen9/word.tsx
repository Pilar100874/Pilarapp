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

  // Calculate responsive font size
  const isMobile = viewport.width < 5;
  const baseFontSize = isMobile ? 0.3 : 0.4;
  
  // Adjust vertical spacing for mobile
  const verticalSpacing = isMobile ? 0.6 : 0.8;

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
      maxWidth={isMobile ? 5 : 8}
    >
      {value}
      <meshBasicMaterial transparent ref={refMaterial} side={DoubleSide} opacity={1} />
    </Text>
  );
};