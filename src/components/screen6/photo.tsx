import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Mesh } from 'three';
import { easeOutQuart } from './utils';

type Photo = {
  src: string;
  z: number;
  onClick?: () => void;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const isOdd = Math.random() > 0.5;
  const startPosition = isOdd ? -1.5 : 1.5;
  const previousOffset = useRef(-1);

  useFrame(() => {
    if (!ref.current || previousOffset.current === Number(scroll.offset.toFixed(8))) {
      return;
    }

    const { x } = ref.current.position;
    const dir = previousOffset.current > scroll.offset ? -1 : 1;
    ref.current.position.x = isOdd
      ? MathUtils.clamp(x + easeOutQuart(0.01 * dir), startPosition, 0)
      : MathUtils.clamp(x - easeOutQuart(0.01 * dir), 0, startPosition);

    previousOffset.current = Number(scroll.offset.toFixed(8));
  });

  return (
    <Plane
      ref={ref}
      position-x={startPosition}
      position-y={-0.25 + Math.random() * 0.5}
      position-z={props.z}
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