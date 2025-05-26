import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh } from 'three';
import { useResponsiveScale } from '@/utils/responsive';

interface PhotoProps {
  src: string;
  index: number;
  isActive: boolean;
  totalPhotos: number;
  activeIndex: number;
  onClick?: () => void;
  isMobile: boolean;
}

export const Photo = (props: PhotoProps) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scroll = useScroll();

  const spacing = props.isMobile ? 1.8 : 2.5;
  const centerZ = 0;
  const sideZ = props.isMobile ? -1.5 : -2;
  const rotationFactor = props.isMobile ? 0.25 : 0.35;
  const perspective = props.isMobile ? 1.2 : 1.5;

  const baseScale = useResponsiveScale(1, props.isMobile);

  useFrame(() => {
    if (!ref.current) return;

    const relativeIndex = props.index - props.activeIndex;
    const targetX = relativeIndex * spacing;
    
    let targetZ = centerZ;
    if (relativeIndex !== 0) {
      targetZ = sideZ - Math.abs(relativeIndex) * perspective;
    }

    const targetRotationY = -relativeIndex * rotationFactor;

    const hoverScale = isHovered ? 1.1 : 1;
    const targetScale = props.isActive ? hoverScale * baseScale : hoverScale * baseScale * 0.85;

    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.1);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.1);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.1);
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    const scrollOffset = scroll.offset - 0.5;
    ref.current.position.x += scrollOffset;
  });

  return (
    <Plane
      ref={ref}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onClick={props.onClick}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    />
  );
};