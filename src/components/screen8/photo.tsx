import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh } from 'three';

type Photo = {
  defaultSrc: string;
  alternateSrc: string;
  index: number;
  totalPhotos: number;
};

export const Photo = (props: Photo) => {
  const defaultTexture = useTexture(props.defaultSrc);
  const alternateTexture = useTexture(props.alternateSrc);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const [isAlternate, setIsAlternate] = useState(false);
  const { viewport } = useThree();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const columns = isMobile ? 2 : 3;
  const spacing = isMobile ? 3 : 4;
  const verticalSpacing = isMobile ? 4.5 : 6;
  
  const column = props.index % columns;
  const row = Math.floor(props.index / columns);
  
  const baseX = (column - (columns === 2 ? 0.5 : 1)) * spacing;
  const baseY = -row * verticalSpacing;
  const baseZ = 0;

  // Apply 20% reduction to the base scale
  const baseScale = 0.8; // 20% reduction from 1
  const scale = isMobile ? (baseScale * 0.7) : baseScale;

  useFrame((state) => {
    if (!ref.current) return;

    const scrollOffset = scroll.offset;
    const parallaxStrength = isMobile ? 1.5 : 2;
    const parallaxY = scrollOffset * parallaxStrength;
    
    const mouseX = state.mouse.x * (isMobile ? 0.3 : 0.5);
    const mouseY = state.mouse.y * (isMobile ? 0.3 : 0.5);

    ref.current.position.x = MathUtils.lerp(
      ref.current.position.x,
      baseX + mouseX,
      0.1
    );
    ref.current.position.y = MathUtils.lerp(
      ref.current.position.y,
      baseY + parallaxY + mouseY,
      0.1
    );
    ref.current.position.z = MathUtils.lerp(
      ref.current.position.z,
      baseZ + (isHovered ? 1 : 0),
      0.1
    );

    const targetScale = (isHovered ? 1.1 : 1) * scale;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    ref.current.rotation.x = MathUtils.lerp(
      ref.current.rotation.x,
      mouseY * (isMobile ? 0.1 : 0.2),
      0.1
    );
    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      mouseX * (isMobile ? 0.1 : 0.2),
      0.1
    );
  });

  return (
    <Plane
      ref={ref}
      args={[3.25, 4.5]}
      material-map={isAlternate ? alternateTexture : defaultTexture}
      material-transparent
      material-alphaTest={0.1}
      onClick={() => setIsAlternate(!isAlternate)}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setIsHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setIsHovered(false);
      }}
    />
  );
};