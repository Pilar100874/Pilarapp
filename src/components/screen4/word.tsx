import { Text, useScroll } from '@react-three/drei';
import { SCREEN4_OFFSET_START_Y } from './constants';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial } from 'three';
import { dataScreen4 } from './data';

type Word = {
  value: string;
  index: number;
};

export const Word = ({ index, value }: Word) => {
  const scroll = useScroll();
  const ref = useRef<Mesh>(null);
  const refMaterial = useRef<MeshBasicMaterial>(null);
  const { viewport } = useThree();

  // Calculate responsive font size with additional 10% reduction
  const isMobile = viewport.width < 5;
  const baseFontSize = isMobile ? 0.54 : 0.765; // Reduced by 10% from previous values (0.6 and 0.85)
  
  // Special case for longer text, also reduced by 10%
  const fontSize = value === 'BOBINAS INDUSTRIAIS' 
    ? (isMobile ? 0.405 : 0.585) // Reduced by 10% from previous values (0.45 and 0.65)
    : baseFontSize;
  
  // Adjust vertical spacing for mobile
  const verticalSpacing = isMobile ? 0.9 : 1.1;

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