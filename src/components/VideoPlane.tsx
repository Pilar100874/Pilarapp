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

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('error', handleError);
    
    // Force load
    video.load();
    
    console.log('Video setup completed');

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoTexture]);

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 1.5;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    // Start video when animation is complete and video is ready
    if (progress >= 1.0 && videoReady && !videoStarted) {
      const video = videoTexture.source.data as HTMLVideoElement;
      
      console.log('Attempting to start video...');
      
      // Ensure video is properly configured before playing
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0;

      // Multiple attempts to start video
      const startVideo = async () => {
        try {
          await video.play();
          console.log('Video started successfully');
        } catch (error) {
          console.warn('Video start failed, retrying...', error);
          
          // Retry with different approach
          setTimeout(async () => {
            try {
              video.load();
              await new Promise(resolve => {
                video.addEventListener('canplay', resolve, { once: true });
              });
              await video.play();
              console.log('Video started on retry');
            } catch (retryError) {
              console.error('Video retry failed:', retryError);
              
              // Final attempt with user interaction simulation
              setTimeout(() => {
                try {
                  video.play().catch(finalError => {
                    console.error('Final video attempt failed:', finalError);
                  });
                } catch (finalAttemptError) {
                  console.error('Final attempt error:', finalAttemptError);
                }
              }, 500);
            }
          }, 1000);
        }
      };

      startVideo();
    }

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