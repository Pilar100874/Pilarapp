import { useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useCallback } from 'react';
import { MathUtils, Mesh, PlaneGeometry } from 'three';
import { Plane } from '@react-three/drei';
import { useResponsiveText } from '@/utils/responsive';

type Photo = {
  src: string;
  z: number;
  onClick?: () => void;
  index: number;
  totalPhotos: number;
  isPaused: boolean;
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
  const { isTabletPortrait } = useResponsiveText();

  // Responsive configuration
  const isMobile = viewport.width < 5;
  
  // Base dimensions with 30% reduction for tablet portrait
  let baseWidth = (3.25 * 1.1) * (isMobile ? 0.7 : 1);
  let baseHeight = (4.5 * 1.1) * (isMobile ? 0.7 : 1);
  
  if (isTabletPortrait) {
    baseWidth = baseWidth * 0.7; // 30% reduction for tablet portrait
    baseHeight = baseHeight * 0.7; // 30% reduction for tablet portrait
  }
  
  const rotationSpeed = isMobile ? 0.198 : 0.264;
  const radius = isMobile ? 2 : 3;
  const xOffset = 1;

  // Smooth click handler
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    if (props.onClick) {
      props.onClick();
    }
  }, [props.onClick]);

  useFrame((state) => {
    if (!ref.current) return;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000;
    
    const baseAngle = ((props.index / props.totalPhotos) * Math.PI * 2) + 
      (props.isPaused ? lastPosition.current.rotation : elapsedTime * rotationSpeed);
    
    const targetX = Math.cos(baseAngle) * radius + xOffset;
    const targetZ = Math.sin(baseAngle) * radius - (isMobile ? 1.5 : 2);
    const targetRotation = baseAngle + Math.PI;

    if (!props.isPaused) {
      lastPosition.current.rotation = baseAngle;
    }

    // Smoother interpolation to prevent flicker
    lastPosition.current.x = MathUtils.lerp(lastPosition.current.x, targetX, 0.08);
    lastPosition.current.z = MathUtils.lerp(lastPosition.current.z, targetZ, 0.08);

    ref.current.position.x = lastPosition.current.x;
    ref.current.position.z = lastPosition.current.z;
    ref.current.rotation.y = targetRotation;
  });

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
      material-depthWrite={false}
      onClick={handleClick}
    />
  );
};