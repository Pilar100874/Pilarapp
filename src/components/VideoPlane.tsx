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
  const { play } = useAudio();
  const initialY = -15; // Start position further down
  const targetY = 0; // Final position at top

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false, // Don't start playing immediately
    muted: true, // Mute video for iOS autoplay compatibility
    playsInline: true, // Required for iOS
    loop: true,
  });

  // Detect user interaction for iOS
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    const elapsed = state.clock.getElapsedTime();
    const duration = 1.5; // Animation duration in seconds
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easedProgress = easeOutCubic(progress);
    
    // Animate position from bottom to top
    ref.current.position.y = initialY + (targetY - initialY) * easedProgress;

    // Start video when animation is almost complete AND user has interacted
    if (progress >= 0.8 && !videoStarted && userInteracted) {
      setVideoStarted(true);
      const video = videoTexture.source.data as HTMLVideoElement;
      
      // iOS-specific video setup
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      video.play().catch(error => {
        console.warn('Video autoplay failed:', error);
        // Fallback: try again after a short delay
        setTimeout(() => {
          video.play().catch(e => console.warn('Video retry failed:', e));
        }, 500);
      });
    }

    // Start music automatically when video starts (only after user interaction)
    if (videoStarted && !musicStarted && userInteracted) {
      setMusicStarted(true);
      console.log('Starting music automatically in opener...');
      
      // Use the centralized audio manager with iOS-specific handling
      play().catch(error => {
        console.warn('Music autoplay failed in opener:', error);
        // For iOS, we might need to wait for explicit user interaction
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          console.log('iOS detected - music will start on next user interaction');
        }
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