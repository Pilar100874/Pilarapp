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
  const { getFontSize, getSpacing } = useResponsiveText();

  // Responsive font sizes with orientation consideration
  const baseFontSize = getFontSize(0.12, 0.1, 0.14, 0.16, 0.21);
  
  // Responsive vertical spacing with orientation
  const verticalSpacing = getSpacing(1.4, 1.2, 1.6, 1.8, 2.24);
  
  // Responsive text width with orientation
  const maxWidth = getFontSize(3.8, 5.5, 5.2, 6.0, 7.45);

  return (
    <Text
      ref={ref}
      fontSize={baseFontSize}
      letterSpacing={0.005}
      position-y={-1 * -index * verticalSpacing}
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