import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// Configure DRACOLoader globally for useGLTF
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
useGLTF.setDRACOLoader(dracoLoader);

export function PillarModel(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('pillar-ok-transformed.glb');

  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) {
      return null;
    }

    ref.current.rotation.x += 0.001;
    ref.current.rotation.z += 0.001;
    ref.current.rotation.y += 0.001;
  });

  return (
    <group {...props} dispose={null}>
      <group position={[2.71, 0.7, -1]} scale={0.005}>
        <mesh
          ref={ref}
          //@ts-ignore
          geometry={nodes.pedestal.geometry}
          material={materials.Material_0}
          rotation={[Math.PI / 2, 0, 0]}
          scale={2.08}
        />
      </group>
    </group>
  );
}

useGLTF.preload('pillar-ok-transformed.glb');