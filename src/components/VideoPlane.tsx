import {
  useAspect,
  useScroll,
  useVideoTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { DoubleSide, Mesh, Group } from "three";
import { OpenerText } from "@/components/opener/openerText";
import { Plane } from "@react-three/drei";

type VideoPlane = {
  texturePath: string;
};

export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  const ref = useRef<Group>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const initialY = -15;
  const targetY = 0;

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false,
    muted: true,
    playsInline: true,
    loop: true,
    crossOrigin: "anonymous",
  });

  // Enhanced video setup for all devices
  useEffect(() => {
    const video = videoTexture.source.data as HTMLVideoElement;
    
    // Universal video attributes for better compatibility
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('controls', 'false');
    video.setAttribute('preload', 'auto');
    video.setAttribute('autoplay', 'false');
    video.volume = 0; // Ensure muted
    
    // Event listeners for video state
    const handleCanPlay = () => {
      console.log('Video can play');
      setVideoReady(true);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
      setVideoReady(true);
    };

    const handlePlay = () => {
      console.log('Video started playing');
      setVideoStarted(true);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      // Try to reload video on error
      setTimeout(() => {
        video.load();
      }, 1000);
    };

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded');
      setVideoReady(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('error', handleError);
    
    // Force load
    video.load();
    
    console.log('Video setup completed');

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoTexture]);

  // Start video immediately when component mounts and video is ready
  useEffect(() => {
    if (videoReady && !videoStarted) {
      const video = videoTexture.source.data as HTMLVideoElement;
      
      console.log('Starting video immediately...');
      
      const startVideo = async () => {
        try {
          // Ensure video is properly configured
          video.muted = true;
          video.playsInline = true;
          video.currentTime = 0;
          video.volume = 0;

          await video.play();
          console.log('Video started successfully on mount');
        } catch (error) {
          console.warn('Video start failed on mount, will retry...', error);
          
          // Retry with different approach
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
              console.log('Video started on retry');
            } catch (retryError) {
              console.error('Video retry failed:', retryError);
            }
          }, 500);
        }
      };

      startVideo();
    }
  }, [videoReady, videoStarted, videoTexture]);

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    
    // Start animation immediately
    if (!animationStarted) {
      setAnimationStarted(true);
    }

    const duration = 1.5;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;
    ref.current.rotation.y = scroll.offset * 2.5;
  });

  return (
    <Suspense fallback={null}>
      <group ref={ref} position-y={initialY}>
        <Plane
          scale={windowSize}
          material-side={DoubleSide}
          material-map={videoTexture}
        />
        <OpenerText py={0.5} />
      </group>
    </Suspense>
  );
};