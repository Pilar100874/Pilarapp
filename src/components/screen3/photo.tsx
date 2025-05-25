import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh } from 'three';

type Photo = {
  src: string;
  index: number;
  isActive: boolean;
  totalPhotos: number;
  activeIndex: number;
  onClick?: () => void;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scroll = useScroll();

  // Configuration
  const spacing = 2.5; // Reduced spacing between photos
  const centerZ = 0; // Centered Z position
  const sideZ = -2; // Closer side Z position
  const rotationFactor = 0.35; // Reduced rotation for smoother effect
  const perspective = 1.5; // Adjusted perspective

  useFrame(() => {
    if (!ref.current) return;

    const relativeIndex = props.index - props.activeIndex;
    
    // Center the photos horizontally
    const targetX = relativeIndex * spacing;
    
    // Calculate z-position with perspective
    let targetZ = centerZ;
    if (relativeIndex !== 0) {
      targetZ = sideZ - Math.abs(relativeIndex) * perspective;
    }

    // Calculate rotation - centered photos have less rotation
    const targetRotationY = -relativeIndex * rotationFactor;

    // Scale based on position and hover state
    const baseScale = isHovered ? 1.1 : 1;
    const targetScale = props.isActive ? baseScale : baseScale * 0.85;

    // Smooth transitions
    ref.current.position.x = MathUtils.lerp(ref.current.position.x, targetX, 0.1);
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetZ, 0.1);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.1);
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    // Add subtle movement based on scroll
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