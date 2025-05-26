import { Text } from '@react-three/drei';
import { SCREEN10_OFFSET_START_Y } from './constants';
import { useRef } from 'react';
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three';
import { useResponsiveScale } from '@/utils/responsive';

interface WordProps {
  value: string;
  index: number;
  isMobile: boolean;
}

export const Word = ({ index, value, isMobile }: WordProps) => {
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);

  const baseFontSize = value === 'ALGUNS' ? 0.595 : 0.85;
  const fontSize = useResponsiveScale(baseFontSize, isMobile);

  return (
    <Text
      ref={ref}
      fontSize={fontSize}
      letterSpacing={0.005}
      position-y={SCREEN10_OFFSET_START_Y - 1 * -index * (isMobile ? 0.9 : 1.1)}
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