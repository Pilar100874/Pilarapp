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
import { useAudio } from "@/components/AudioManager";

type VideoPlane = {
  texturePath: string;
};

export const VideoPlane = ({ texturePath }: VideoPlane) => {
  const scroll = useScroll();
  const windowSize = useAspect(1920, 1080);
  const ref = useRef<Group>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { play } = useAudio();
  const initialY = -15;
  const targetY = 0;

  // Detect iOS
  useEffect(() => {
    const iosDetected = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(iosDetected);
    console.log('iOS detected:', iosDetected);
  }, []);

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false,
    muted: true,
    playsInline: true,
    loop: true,
    crossOrigin: "anonymous",
  });

  // Enhanced user interaction detection for iOS
  useEffect(() => {
    let interactionDetected = false;

    const handleUserInteraction = (event: Event) => {
      if (interactionDetected) return;
      
      console.log('User interaction detected:', event.type);
      interactionDetected = true;
      setUserInteracted(true);
      
      // For iOS, immediately try to start video and audio
      if (isIOS) {
        const video = videoTexture.source.data as HTMLVideoElement;
        
        // Setup video for iOS
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('controls', 'false');
        
        // Try to play video immediately on iOS
        video.play().then(() => {
          console.log('iOS video started successfully');
          setVideoStarted(true);
          
          // Start music after video starts
          setTimeout(() => {
            if (!musicStarted) {
              setMusicStarted(true);
              play().catch(error => {
                console.warn('iOS music start failed:', error);
              });
            }
          }, 500);
        }).catch(error => {
          console.warn('iOS video start failed:', error);
        });
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    // Multiple event listeners for better iOS compatibility
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('touchend', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isIOS, videoTexture, play, musicStarted]);

  // Enhanced video setup for iOS
  useEffect(() => {
    const video = videoTexture.source.data as HTMLVideoElement;
    
    if (isIOS) {
      // iOS-specific video attributes
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('controls', 'false');
      video.setAttribute('preload', 'metadata');
      
      // Force load on iOS
      video.load();
      
      console.log('iOS video setup completed');
    }
  }, [videoTexture, isIOS]);

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 1.5;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    // For non-iOS devices, start video when animation is complete
    if (!isIOS && progress >= 0.8 && !videoStarted && userInteracted) {
      setVideoStarted(true);
      const video = videoTexture.source.data as HTMLVideoElement;
      
      video.muted = true;
      video.playsInline = true;
      
      video.play().then(() => {
        console.log('Non-iOS video started successfully');
        
        // Start music for non-iOS devices
        if (!musicStarted) {
          setMusicStarted(true);
          play().catch(error => {
            console.warn('Non-iOS music start failed:', error);
          });
        }
      }).catch(error => {
        console.warn('Non-iOS video start failed:', error);
      });
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