import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimer = useRef<number | null>(null);
  const lastAngle = useRef(0);

  useFrame((state) => {
    if (!ref.current || previousOffset.current === Number(scroll.offset.toFixed(8))) {
      return;
    }

    // Calculate the base angle
    const baseAngle = (props.index / props.totalPhotos) * Math.PI * 2;
    
    // Only update rotation if not paused
    if (!isPaused) {
      lastAngle.current = baseAngle + state.clock.getElapsedTime() * 0.2;
    }

    const radius = 3;

    // Update position in a circular pattern with smooth easing
    ref.current.position.x = Math.cos(lastAngle.current) * radius;
    ref.current.position.z = Math.sin(lastAngle.current) * radius - 2;

    // Rotate to face center
    ref.current.rotation.y = lastAngle.current + Math.PI;

    previousOffset.current = Number(scroll.offset.toFixed(8));
  });

  const handleClick = () => {
    if (props.onClick) {
      setIsPaused(true);
      props.onClick();
      
      // Clear existing timer if any
      if (pauseTimer.current !== null) {
        window.clearTimeout(pauseTimer.current);
      }
      
      // Set new timer
      pauseTimer.current = window.setTimeout(() => {
        setIsPaused(false);
        pauseTimer.current = null;
      }, 2000);
    }
  };

  return (
    <Plane
      ref={ref}
      position-y={0}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    />
  );
};