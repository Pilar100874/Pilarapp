import { Text, useScroll } from '@react-three/drei';
import { SCREEN4_OFFSET_START_Y } from './constants';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen4 } from './data';
import { useResponsiveScale } from '@/utils/responsive';

interface WordProps {
  value: string;
  index: number;
  isMobile: boolean;
}

export const Word = ({ index, value, isMobile }: WordProps) => {
  const scroll = useScroll();
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);

  const baseFontSize = value === 'BOBINAS INDUSTRIAIS' ? 0.65 : 0.85;
  const fontSize = useResponsiveScale(baseFontSize, isMobile);

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
      position-y={SCREEN4_OFFSET_START_Y - 1 * -index * (isMobile ? 0.9 : 1.1)}
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