import { Plane, useTexture } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Mesh, Vector3, Euler } from 'three';
import { useFrame } from '@react-three/fiber';

type Photo = {
  src: string;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick?: () => void;
};

export const Photo = (props: Photo) => {
  const photo = useTexture(props.src);
  const ref = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const targetPosition = useRef(new Vector3(...props.position));
  const targetRotation = useRef(new Euler(...props.rotation));

  useFrame(() => {
    if (!ref.current) return;

    // Smooth position transition
    ref.current.position.lerp(targetPosition.current, 0.1);
    
    // Smooth rotation transition
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetRotation.current.x,
      0.1
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetRotation.current.y,
      0.1
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      targetRotation.current.z,
      0.1
    );

    // Scale effect on hover
    const targetScale = isHovered ? 1.1 : 1;
    ref.current.scale.lerp(new Vector3(targetScale, targetScale, 1), 0.1);
  });

  return (
    <Plane
      ref={ref}
      position={props.position}
      rotation={props.rotation}
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