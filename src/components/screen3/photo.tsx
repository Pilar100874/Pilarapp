import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  
  // Snap points configuration
  const snapPoints = [-4, -2, 0, 2, 4]; // Horizontal positions to snap to
  const snapThreshold = 0.1; // How close we need to be to snap
  const snapSpeed = 0.15; // How fast we snap into position

  useFrame(() => {
    if (!ref.current) return;

    // Calculate scroll influence
    const scrollInfluence = (scroll.offset - 0.5) * 10;
    
    // Find the closest snap point
    let closestPoint = snapPoints[0];
    let minDistance = Math.abs(ref.current.position.x - snapPoints[0]);
    
    snapPoints.forEach(point => {
      const distance = Math.abs(ref.current.position.x - point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    // Apply snapping if we're close enough to a snap point
    if (minDistance < snapThreshold) {
      ref.current.position.x = MathUtils.lerp(
        ref.current.position.x,
        closestPoint,
        snapSpeed
      );
    } else {
      // Otherwise, move based on scroll
      ref.current.position.x = MathUtils.lerp(
        ref.current.position.x,
        scrollInfluence,
        0.1
      );
    }

    // Keep Z position constant
    ref.current.position.z = props.z;

    // Scale effect on hover
    const targetScale = isHovered ? 1.1 : 1;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
    ref.current.scale.y = MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);

    // Subtle rotation based on movement
    ref.current.rotation.y = MathUtils.lerp(
      ref.current.rotation.y,
      (ref.current.position.x - closestPoint) * 0.1,
      0.1
    );
  });

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