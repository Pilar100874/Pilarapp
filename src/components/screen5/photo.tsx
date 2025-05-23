import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Mesh } from 'three';
import { easeOutQuart } from './utils';

type Photo = {
  src: string;
  index: number;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const previousOffset = useRef(-1);

  useFrame(() => {
    if (!ref.current || previousOffset.current === Number(scroll.offset.toFixed(8))) {
      return;
    }

    // Calculate rotation based on scroll
    const rotY = scroll.offset * 5 - Math.abs(6 - props.index) * 0.25 - Math.PI / 8;
    ref.current.rotation.y = rotY;

    // Calculate vertical position with less spacing
    const baseY = -1 + props.index * 1;
    const scrollY = scroll.offset * 2;
    ref.current.position.y = baseY + scrollY;

    // Add slight x-axis movement (reduced range)
    const dir = previousOffset.current > scroll.offset ? -1 : 1;
    ref.current.position.x = easeOutQuart(0.3 * dir) * (props.index % 2 === 0 ? 0.5 : -0.5);

    // Update z-position based on rotation (reduced depth)
    ref.current.position.z = Math.sin(rotY) * 1;

    previousOffset.current = Number(scroll.offset.toFixed(8));
  });

  return (
    <Plane
      ref={ref}
      args={[2, 3]}
      position={[0, 0, 0]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
    />
  );
};