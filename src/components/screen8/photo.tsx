import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { MathUtils, Mesh } from 'three';

type Photo = {
  src: string;
  index: number;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const startTime = useRef(Date.now());
  const [isForward, setIsForward] = useState(true);
  const lastPosition = useRef({ x: 0, y: 0, z: 0 });
  const animationSpeed = 2;
  const boomerangDistance = 3;

  useFrame(() => {
    if (!ref.current) return;

    const currentTime = (Date.now() - startTime.current) / 1000;
    const oscillation = Math.sin(currentTime * animationSpeed);
    
    // Calculate target positions with boomerang effect
    const targetX = oscillation * boomerangDistance * (props.index % 2 === 0 ? 1 : -1);
    const targetY = Math.cos(currentTime * animationSpeed) * 0.5;
    const targetZ = props.index * -0.35 + Math.abs(oscillation) * -0.5;

    // Smooth interpolation
    lastPosition.current.x = MathUtils.lerp(lastPosition.current.x, targetX, 0.1);
    lastPosition.current.y = MathUtils.lerp(lastPosition.current.y, targetY, 0.1);
    lastPosition.current.z = MathUtils.lerp(lastPosition.current.z, targetZ, 0.1);

    // Apply positions
    ref.current.position.x = lastPosition.current.x;
    ref.current.position.y = lastPosition.current.y - 0.25;
    ref.current.position.z = lastPosition.current.z;

    // Rotate the image based on movement
    ref.current.rotation.y = oscillation * 0.2;
  });

  return (
    <Plane
      ref={ref}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    />
  );
};