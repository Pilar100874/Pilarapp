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

  // Responsive font sizes with special case for longer text and orientation
  const baseFontSize = getFontSize(0.45, 0.4, 0.55, 0.65, 0.765);
  const fontSize = value === 'BOBINAS INDUSTRIAIS' || value === 'INSUMOS GRÁFICOS'
    ? getFontSize(0.35, 0.3, 0.42, 0.5, 0.585)
    : baseFontSize;
  
  // Responsive vertical spacing with orientation - reduced by 0.5cm (0.05 units)
  const verticalSpacing = getSpacing(0.75, 0.65, 0.85, 0.95, 1.15);

  useFrame(() => {
    if (!ref.current || !refMaterial.current) {
      return;
    }

    // Adjusted animation parameters with 30 degree delay (0.52 radians)
    const scrollProgress = scroll.offset;
    const itemProgress = (scrollProgress * 8) - (Math.abs(dataScreen4.length - index) * 0.2);
    
    // Add 30 degree delay (0.52 radians) to the rotation
    const rotY = itemProgress - Math.PI / 8 - 0.52; // Added 30 degree delay
    ref.current.rotation.y = rotY;
    
    // Improved opacity calculation with better visibility range
    const opacityFactor = Math.pow(Math.max(0, rotY + 1.2), 15);
    refMaterial.current.opacity = MathUtils.clamp(opacityFactor, 0, 1);
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