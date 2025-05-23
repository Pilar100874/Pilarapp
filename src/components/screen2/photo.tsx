import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils, Mesh, Group } from 'three';

type Photo = {
  src: string;
  index: number;
};

export const Photo = (props: Photo) => {
  const frontTexture = useTexture(props.src);
  const backTexture = useTexture(`/k-0${props.index + 1}.jpeg`);
  const groupRef = useRef<Group>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [zPosition, setZPosition] = useState(props.index * -0.35);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setIsFlipped(!isFlipped);
    setZPosition(isFlipped ? props.index * -0.35 : (5 - props.index) * 0.35);
  };

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth rotation animation for flip
    const targetRotation = isFlipped ? Math.PI : 0;
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);

    // Smooth z-position transition
    groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, zPosition, 0.1);
  });

  return (
    <group
      ref={groupRef}
      position-x={props.index % 2 === 0 ? -1.5 : 1.5}
      position-y={-0.25 + Math.random() * 0.5}
      position-z={props.index * -0.35}
      onClick={handleClick}
    >
      {/* Front of the photo */}
      <Plane
        args={[3.25, 4.5]}
        position-z={0.001}
        material-map={frontTexture}
        material-transparent
        material-alphaTest={0.1}
      />
      
      {/* Back of the photo */}
      <Plane
        args={[3.25, 4.5]}
        rotation-y={Math.PI}
        position-z={-0.001}
        material-map={backTexture}
        material-transparent
        material-alphaTest={0.1}
      />
    </group>
  );
};