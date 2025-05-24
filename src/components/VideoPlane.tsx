import {
  Plane,
  useAspect,
  useScroll,
  useVideoTexture,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { DoubleSide, Mesh } from "three";
import { OpenerText } from "@/components/opener/openerText";

type VideoPlane = {
  texturePath: string;
};
export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  const logoTexture = useTexture('/logo_branco.png');

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: true,
  });

  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = scroll.offset * 2.5;
  });

  return (
    <Suspense fallback={null}>
      <Plane
        ref={ref}
        scale={[...windowSize]}
        material-side={DoubleSide}
        material-map={videoTexture}
      />
      <group position={[-6, 3, 0]}>
        {/* Shadow plane */}
        <mesh position={[0, 0, 0.05]} scale={[2.5, 1.25, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="black" transparent opacity={0.3} depthTest={false} />
        </mesh>
        {/* Logo plane */}
        <mesh position={[0, 0, 0.1]} scale={[2.5, 1.25, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={logoTexture} transparent depthTest={false} />
        </mesh>
      </group>
      <OpenerText py={0.5} />
    </Suspense>
  );
};