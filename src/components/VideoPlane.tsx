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
      <mesh position={[-6, 3, 0.1]} scale={[2, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={logoTexture} transparent depthTest={false} />
      </mesh>
      <OpenerText py={0.5} />
    </Suspense>
  );
};