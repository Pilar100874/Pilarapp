import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh } from 'three';
import { easeOutQuart } from '../screen3/utils';

type Photo = {
  src: string;
  index: number;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const [isFlipped, setIsFlipped] = useState(false);
  const [zPosition, setZPosition] = useState(props.index * -0.35);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setIsFlipped(!isFlipped);
    setZPosition(isFlipped ? props.index * -0.35 : (5 - props.index) * -0.35);
  };

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    // Smooth rotation animation for flip
    const targetRotation = isFlipped ? Math.PI : 0;
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotation, 0.1);

    // Smooth z-position transition
    ref.current.position.z = MathUtils.lerp(ref.current.position.z, zPosition, 0.1);
  });

  return (
    <Plane
      ref={ref}
      onClick={handleClick}
      position-x={props.index % 2 === 0 ? -1.5 : 1.5}
      position-y={-0.25 + Math.random() * 0.5}
      position-z={props.index * -0.35}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
    />
  );
};