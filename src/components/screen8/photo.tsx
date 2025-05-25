import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { MathUtils, Mesh } from 'three';

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
  const rotationSpeed = 0.15; // Slightly slower than Screen6
  const startTime = useRef(Date.now());
  const lastPosition = useRef({ x: 0, z: 0, rotation: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000;
    
    // Calculate the base angle for continuous rotation
    const baseAngle = ((props.index / props.totalPhotos) * Math.PI * 2) + (isPaused ? 0 : elapsedTime * rotationSpeed);
    
    // Larger radius for a wider carousel
    const radius = 4;
    const targetX = Math.cos(baseAngle) * radius;
    const targetZ = Math.sin(baseAngle) * radius - 2;
    const targetRotation = baseAngle + Math.PI;

    // Smooth interpolation with hover effect
    const scale = isHovered ? 1.1 : 1;
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x, scale, 0.1));

    // Position interpolation
    lastPosition.current.x = MathUtils.lerp(lastPosition.current.x, targetX, 0.1);
    lastPosition.current.z = MathUtils.lerp(lastPosition.current.z, targetZ, 0.1);
    lastPosition.current.rotation = MathUtils.lerp(lastPosition.current.rotation, targetRotation, 0.1);

    // Apply positions
    ref.current.position.x = lastPosition.current.x;
    ref.current.position.z = lastPosition.current.z;
    ref.current.rotation.y = lastPosition.current.rotation;
  });

  const handleClick = () => {
    if (!props.onClick) return;

    setIsPaused(true);
    props.onClick();
    
    if (pauseTimer.current !== null) {
      window.clearTimeout(pauseTimer.current);
    }
    
    pauseTimer.current = window.setTimeout(() => {
      setIsPaused(false);
      startTime.current = Date.now() - (lastPosition.current.rotation / rotationSpeed) * 1000;
      pauseTimer.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimer.current !== null) {
        window.clearTimeout(pauseTimer.current);
      }
    };
  }, []);

  return (
    <Plane
      ref={ref}
      position-y={0}
      args={[3.25, 4.5]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setIsHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setIsHovered(false);
      }}
    />
  );
};