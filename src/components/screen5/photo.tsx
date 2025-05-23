import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Mesh } from 'three';

type Photo = {
  src: string;
  index: number;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!ref.current) return;

    // Calculate position on circle
    const angle = (props.index * (Math.PI * 2)) / 6 + state.clock.elapsedTime * 0.1 + scroll.offset * Math.PI;
    const radius = 4;
    
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    
    // Rotate to face center
    ref.current.rotation.y = angle + Math.PI / 2;
    
    // Add floating effect
    ref.current.position.y = Math.sin(state.clock.elapsedTime + props.index) * 0.3;
  });

  return (
    <Plane
      ref={ref}
      args={[2, 3]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
    />
  );
};