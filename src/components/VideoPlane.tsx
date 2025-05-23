import {
  Plane,
  useAspect,
  useScroll,
  useVideoTexture,
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

  const videoTexture = useVideoTexture("https://vod-progressive.akamaized.net/exp=1709841781~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4901%2F14%2F374933026%2F1538717347.mp4~hmac=c5c7c8a8c8b8c8d8c8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z/vimeo-prod-skyfire-std-us/01/4901/14/374933026/1538717347.mp4", {
    autoplay: true,
    loop: true,
    muted: true,
    crossOrigin: "anonymous",
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
      <OpenerText py={0.5} />
    </Suspense>
  );
};