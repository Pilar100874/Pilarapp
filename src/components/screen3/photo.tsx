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
  const velocity = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring physics constants
  const springStrength = 0.1;
  const dampening = 0.75;
  const targetX = 0;
  const targetY = 0;

  useFrame(() => {
    if (!ref.current) return;

    // Spring physics calculation
    const dx = targetX - ref.current.position.x;
    const dy = targetY - ref.current.position.y;

    // Add force towards target (spring effect)
    velocity.current.x += dx * springStrength;
    velocity.current.y += dy * springStrength;

    // Apply dampening
    velocity.current.x *= dampening;
    velocity.current.y *= dampening;

    // Update position
    ref.current.position.x += velocity.current.x;
    ref.current.position.y += velocity.current.y;
    ref.current.position.z = props.z;

    // Add subtle floating animation
    ref.current.position.y += Math.sin(Date.now() * 0.001) * 0.001;

    // Elastic rotation based on velocity
    ref.current.rotation.z = MathUtils.lerp(
      ref.current.rotation.z,
      -velocity.current.x * 0.2,
      0.1
    );

    // Scale effect on hover
    const targetScale = isHovered ? 1.1 : 1;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);
  });

  useEffect(() => {
    // Set random initial position
    if (ref.current) {
      ref.current.position.x = (Math.random() - 0.5) * 10;
      ref.current.position.y = (Math.random() - 0.5) * 5;
    }
  }, []);

  return (
    <Plane
      ref={ref}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onClick={props.onClick}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    />
  );
};