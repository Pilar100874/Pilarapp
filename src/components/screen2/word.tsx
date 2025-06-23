import { Text, useScroll } from '@react-three/drei';
import { SCREEN2_OFFSET_START_Y } from './constants';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen2 } from './data';
import { useResponsiveText } from '@/utils/responsive';

type Word = {
  value: string;
  index: number;
};

export const Word = ({ index, value }: Word) => {
  const scroll = useScroll();
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);
  const { getFontSize, getSpacing } = useResponsiveText();

  // Responsive font sizes with orientation consideration
  const baseFontSize = getFontSize(0.6, 0.5, 0.75, 0.85, 1.05);
  const fontSize = value === '27' ? baseFontSize * 1.2 : baseFontSize;
  
  // Responsive vertical spacing with orientation
  const verticalSpacing = getSpacing(0.7, 0.6, 0.8, 0.9, 1.1);

  useFrame(() => {
    if (!ref.current || !refMaterial.current) {
      return;
    }

    const rotY = scroll.offset * 8 - Math.abs(dataScreen2.length - index) * 0.15 - Math.PI / 8;
    ref.current.rotation.y = rotY;
    refMaterial.current.opacity = MathUtils.clamp(Math.pow(rotY + 1, 10), -Infinity, 1);
  });

  return (
    <Text
      ref={ref}
      fontSize={fontSize}
      letterSpacing={0.005}
      position-y={SCREEN2_OFFSET_START_Y - 1 * -index * verticalSpacing}
      textAlign={'left'}
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
    >
      {value}
      <meshBasicMaterial transparent ref={refMaterial} side={DoubleSide} />
    </Text>
  );
};