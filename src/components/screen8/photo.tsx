import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh } from 'three';

type Photo = {
  src: string;
  index: number;
  totalPhotos: number;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate initial positions in a grid
  const columns = 3;
  const rows = Math.ceil(props.totalPhotos / columns);
  const column = props.index % columns;
  const row = Math.floor(props.index / columns);
  
  const baseX = (column - 1) * 4; // Spread horizontally
  const baseY = -row * 6; // Spread vertically
  const baseZ = 0;

  useFrame((state) => {
    if (!ref.current) return;

    // Parallax effect based on scroll
    const scrollOffset = scroll.offset;
    const parallaxStrength = 2;
    const parallaxY = scrollOffset * parallaxStrength;
    
    // Calculate movement based on mouse position
    const mouseX = state.mouse.x * 0.5;
    const mouseY = state.mouse.y * 0.5;

    // Smooth transitions
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

    // Scale effect on hover
    const targetScale = isHovered ? 1.1 : 1;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    // Subtle rotation based on mouse position
    ref.current.rotation.x = MathUtils.lerp(
      ref.current.rotation.x,
      mouseY * 0.2,
      0.1
    );
    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      mouseX * 0.2,
      0.1
    );
  });

  return (
    <Plane
      ref={ref}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
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