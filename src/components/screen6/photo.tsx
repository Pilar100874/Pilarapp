import { Plane, useScroll, useTexture, useThree } from '@react-three/drei';
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
  const startTime = useRef(Date.now());
  const lastPosition = useRef({ x: 0, z: 0, rotation: 0 });
  const { viewport } = useThree();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  const baseWidth = (3.25 * 1.1) * (isMobile ? 0.7 : 1);
  const baseHeight = (4.5 * 1.1) * (isMobile ? 0.7 : 1);
  const rotationSpeed = isMobile ? 0.18 : 0.24;
  const radius = isMobile ? 2 : 3;

  useFrame((state) => {
    if (!ref.current) return;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000;
    
    const baseAngle = ((props.index / props.totalPhotos) * Math.PI * 2) + (isPaused ? 0 : elapsedTime * rotationSpeed);
    
    const targetX = Math.cos(baseAngle) * radius;
    const targetZ = Math.sin(baseAngle) * radius - (isMobile ? 1.5 : 2);
    const targetRotation = baseAngle + Math.PI;

    lastPosition.current.x = MathUtils.lerp(lastPosition.current.x, targetX, 0.1);
    lastPosition.current.z = MathUtils.lerp(lastPosition.current.z, targetZ, 0.1);
    lastPosition.current.rotation = MathUtils.lerp(lastPosition.current.rotation, targetRotation, 0.1);

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
      args={[baseWidth, baseHeight]}
      material-map={photo}
      material-transparent
      material-alphaTest={0.1}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    />
  );
};