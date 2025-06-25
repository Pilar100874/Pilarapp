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
  const [userInteracted, setUserInteracted] = useState(false);
  const initialY = -15;
  const targetY = 0;

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false,
    muted: true,
    playsInline: true,
    loop: true,
    crossOrigin: "anonymous",
  });

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Listen for any user interaction to unlock video on iOS
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('User interaction detected for video unlock');
      setUserInteracted(true);
      
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('touchend', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  // Enhanced video setup for all devices, especially iOS
  useEffect(() => {
    const video = videoTexture.source.data as HTMLVideoElement;
    
    // iOS-specific video attributes
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('controls', 'false');
    video.setAttribute('preload', 'auto');
    video.setAttribute('autoplay', 'false');
    video.volume = 0;
    
    // iOS-specific attributes
    if (isIOS) {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('playsinline', 'true');
      video.defaultMuted = true;
      video.muted = true;
    }
    
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
    
    console.log('Video setup completed, iOS:', isIOS);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoTexture, isIOS]);

  // Start video when ready and user has interacted (especially important for iOS)
  useEffect(() => {
    if (videoReady && !videoStarted && (!isIOS || userInteracted)) {
      const video = videoTexture.source.data as HTMLVideoElement;
      
      console.log('Starting video, iOS:', isIOS, 'User interacted:', userInteracted);
      
      const startVideo = async () => {
        try {
          // Ensure video is properly configured for iOS
          video.muted = true;
          video.playsInline = true;
          video.currentTime = 0;
          video.volume = 0;
          
          if (isIOS) {
            video.defaultMuted = true;
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
          }

          await video.play();
          console.log('Video started successfully');
        } catch (error) {
          console.warn('Video start failed, will retry...', error);
          
          // iOS-specific retry logic
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
              video.playsInline = true;
              
              if (isIOS) {
                video.defaultMuted = true;
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('playsinline', 'true');
              }
              
              await video.play();
              console.log('Video started on retry');
            } catch (retryError) {
              console.error('Video retry failed:', retryError);
              
              // Final iOS fallback - try to play on next user interaction
              if (isIOS) {
                const playOnNextInteraction = async () => {
                  try {
                    await video.play();
                    console.log('Video started on iOS fallback');
                    document.removeEventListener('touchstart', playOnNextInteraction);
                    document.removeEventListener('click', playOnNextInteraction);
                  } catch (finalError) {
                    console.error('iOS video fallback failed:', finalError);
                  }
                };
                
                document.addEventListener('touchstart', playOnNextInteraction, { once: true, passive: true });
                document.addEventListener('click', playOnNextInteraction, { once: true });
              }
            }
          }, 500);
        }
      };

      startVideo();
    }
  }, [videoReady, videoStarted, videoTexture, isIOS, userInteracted]);

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