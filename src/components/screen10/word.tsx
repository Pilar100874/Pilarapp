import { Text } from '@react-three/drei';
import { SCREEN10_OFFSET_START_Y } from './constants';
import { useRef } from 'react';
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen10 } from './data';
import { useResponsiveText } from '@/utils/responsive';

type Word = {
  value: string;
  index: number;
};

export const Word = ({ index, value }: Word) => {
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);
  const { getFontSize, getSpacing } = useResponsiveText();

  // Responsive font sizes
  const baseFontSize = getFontSize(0.45, 0.65, 0.765);
  const fontSize = value === 'ALGUNS' 
    ? getFontSize(0.3, 0.45, 0.535)
    : baseFontSize;

  // Responsive vertical spacing
  const verticalSpacing = getSpacing(0.7, 0.9, 1.1);

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