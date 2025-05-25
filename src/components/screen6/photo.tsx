import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Mesh } from 'three';
import { easeOutQuart } from './utils';

type Photo = {
  src: string;
  z: number;
  onClick?: () => void;
  index: number;
  totalPhotos: number;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const previousOffset = useRef(-1);

  useFrame((state) => {
    if (!ref.current || previousOffset.current === Number(scroll.offset.toFixed(8))) {
      return;
    }

    // Calculate the circular position
    const angle = (props.index / props.totalPhotos) * Math.PI * 2 + state.clock.getElapsedTime() * 0.5;
    const radius = 3;

    // Update position in a circular pattern
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius - 2;

    // Rotate to face center
    ref.current.rotation.y = angle + Math.PI;

    previousOffset.current = Number(scroll.offset.toFixed(8));
  });

  return (
    <Plane
      ref={ref}
      position-y={0}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onClick={props.onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    />
  );
};