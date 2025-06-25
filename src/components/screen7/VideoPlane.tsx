import {
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { DoubleSide, Mesh } from "three";
import { OpenerText } from "@/components/screen7/openerText";
import { Plane } from "@react-three/drei";

type VideoPlane = {
  texturePath: string;
};

export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  // Reduce the size by 30%
  const scale = windowSize.map(size => size * 0.7);
  const [videoReady, setVideoReady] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false,
    muted: true,
    playsInline: true,
    loop: true,
    crossOrigin: "anonymous",
  });

  const ref = useRef<Mesh>(null);

  // Enhanced video setup
  useEffect(() => {
    const video = videoTexture.source.data as HTMLVideoElement;
    
    // Universal video attributes
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('controls', 'false');
    video.setAttribute('preload', 'auto');
    video.volume = 0;
    
    const handleCanPlay = () => {
      console.log('Screen7 video can play');
      setVideoReady(true);
    };

    const handleLoadedMetadata = () => {
      console.log('Screen7 video metadata loaded');
      setVideoReady(true);
    };

    const handlePlay = () => {
      console.log('Screen7 video started playing');
      setVideoStarted(true);
    };

    const handleError = (e: Event) => {
      console.error('Screen7 video error:', e);
      setTimeout(() => {
        video.load();
      }, 1000);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('error', handleError);
    
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoTexture]);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const scrollOffset = scroll.offset;
    ref.current.rotation.y = scrollOffset * 2.5;

    // Start video when it comes into view (around screen 7 position)
    // Screen 7 is roughly at scroll offset 0.55-0.65
    if (scrollOffset > 0.5 && videoReady && !hasTriggered) {
      setHasTriggered(true);
      
      const video = videoTexture.source.data as HTMLVideoElement;
      
      console.log('Attempting to start Screen7 video at scroll offset:', scrollOffset);
      
      const startVideo = async () => {
        try {
          video.muted = true;
          video.playsInline = true;
          video.currentTime = 0;
          video.volume = 0;
          await video.play();
          console.log('Screen7 video started successfully');
        } catch (error) {
          console.warn('Screen7 video start failed:', error);
          
          // Retry logic
          setTimeout(async () => {
            try {
              video.load();
              await new Promise(resolve => {
                const handleCanPlay = () => {
                  video.removeEventListener('canplay', handleCanPlay);
                  resolve(null);
                };
                video.addEventListener('canplay', handleCanPlay);
              });
              
              video.muted = true;
              video.volume = 0;
              await video.play();
              console.log('Screen7 video started on retry');
            } catch (retryError) {
              console.error('Screen7 video retry failed:', retryError);
            }
          }, 500);
        }
      };

      startVideo();
    }
  });

  // Move up by 2cm (20 units) from the previous position (-50.5)
  const baseY = -48.5;
  const textY = -48;

  return (
    <Suspense fallback={null}>
      <Plane
        ref={ref}
        scale={[scale[0], scale[1], 1]}
        material-side={DoubleSide}
        material-map={videoTexture}
        position-y={baseY}
      />
      <OpenerText py={textY} />
    </Suspense>
  );
};