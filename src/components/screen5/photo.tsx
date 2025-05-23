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

    const time = state.clock.elapsedTime;
    const angle = (props.index * (Math.PI * 2)) / 6 + time * 0.3;
    const radius = 4;
    
    // Orbital movement in different planes
    const planeAngle = (props.index * Math.PI) / 3;
    
    ref.current.position.x = Math.cos(angle) * radius * Math.cos(planeAngle);
    ref.current.position.y = Math.sin(angle) * radius * Math.sin(planeAngle);
    ref.current.position.z = Math.sin(angle) * radius * Math.cos(planeAngle);
    
    // Complex rotation
    ref.current.rotation.x = angle * 0.2;
    ref.current.rotation.y = angle + Math.PI / 2;
    ref.current.rotation.z = Math.sin(time + props.index) * 0.2;
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