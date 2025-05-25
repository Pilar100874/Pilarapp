import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { MathUtils, Mesh } from 'three';

type Photo = {
  src: string;
  z: number;
  onClick?: () => void;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const scroll = useScroll();
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!ref.current) return;

    const now = Date.now();
    const elapsed = (now - startTime.current) / 1000;
    
    // Smooth glide animation
    currentPosition.current.x = MathUtils.lerp(
      currentPosition.current.x,
      targetPosition.x,
      0.05
    );
    
    currentPosition.current.y = MathUtils.lerp(
      currentPosition.current.y,
      targetPosition.y + Math.sin(elapsed) * 0.1, // Subtle floating effect
      0.05
    );

    ref.current.position.x = currentPosition.current.x;
    ref.current.position.y = currentPosition.current.y;
    ref.current.position.z = props.z;

    // Subtle rotation based on movement
    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      (currentPosition.current.x - targetPosition.x) * 0.2,
      0.05
    );
  });

  useEffect(() => {
    // Random initial position
    const randomX = (Math.random() - 0.5) * 4;
    const randomY = (Math.random() - 0.5) * 2;
    
    currentPosition.current = { x: randomX, y: randomY };
    if (ref.current) {
      ref.current.position.x = randomX;
      ref.current.position.y = randomY;
    }
    
    // Animate to center
    setTargetPosition({ x: 0, y: 0 });
  }, []);

  return (
    <Plane
      ref={ref}
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