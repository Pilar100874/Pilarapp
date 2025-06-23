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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const initialY = -15; // Start position further down
  const targetY = 0; // Final position at top

  const videoTexture = useVideoTexture(texturePath, {
    autoplay: false, // Don't start playing immediately
  });

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.preload = 'auto';

    const audio = audioRef.current;

    const handleCanPlayThrough = () => {
      console.log('Music loaded and ready to play');
    };

    const handleError = (e: Event) => {
      console.error('Music loading error:', e);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
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

    // Start video when animation is almost complete
    if (progress >= 0.8 && !videoStarted) {
      setVideoStarted(true);
      (videoTexture.source.data as HTMLVideoElement).play();
    }

    // Start music automatically when video starts
    if (videoStarted && !musicStarted && audioRef.current) {
      setMusicStarted(true);
      console.log('Starting music automatically in opener...');
      
      const playMusic = async () => {
        try {
          await audioRef.current!.play();
          console.log('Music started successfully in opener');
        } catch (error) {
          console.warn('Music autoplay failed in opener, will retry on user interaction:', error);
          
          // Retry on next user interaction
          const retryPlay = async () => {
            try {
              await audioRef.current!.play();
              console.log('Music started after user interaction');
              document.removeEventListener('click', retryPlay);
              document.removeEventListener('touchstart', retryPlay);
            } catch (retryError) {
              console.error('Music start retry failed in opener:', retryError);
            }
          };
          
          document.addEventListener('click', retryPlay, { once: true });
          document.addEventListener('touchstart', retryPlay, { once: true });
        }
      };
      
      playMusic();
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