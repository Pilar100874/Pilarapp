import { Text, useScroll } from '@react-three/drei';
import { SCREEN4_OFFSET_START_Y } from './constants';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen4 } from './data';
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

  // Responsive font sizes with special case for longer text
  const baseFontSize = getFontSize(0.45, 0.65, 0.765);
  const fontSize = value === 'BOBINAS INDUSTRIAIS' 
    ? getFontSize(0.35, 0.5, 0.585)
    : baseFontSize;
  
  // Responsive vertical spacing
  const verticalSpacing = getSpacing(0.7, 0.9, 1.1);

  useFrame(() => {
    if (!ref.current || !refMaterial.current) {
      return;
    }

    const rotY = scroll.offset * 5 - Math.abs(dataScreen4.length - index) * 0.25 - Math.PI / 8;
    ref.current.rotation.y = rotY;
    refMaterial.current.opacity = MathUtils.clamp(Math.pow(rotY + 1, 20), -Infinity, 1);
  });

  return (
    <Text
      ref={ref}
      fontSize={fontSize}
      letterSpacing={0.005}
      position-y={SCREEN4_OFFSET_START_Y - 1 * -index * verticalSpacing}
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