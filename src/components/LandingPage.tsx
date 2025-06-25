import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MeshBasicMaterial } from 'three';
import { useResponsiveText } from '@/utils/responsive';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPWAHovered, setIsPWAHovered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [orientationChanged, setOrientationChanged] = useState(false);
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, getScale, isMobile, isTablet } = useResponsiveText();
  
  // PWA state
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Detect iOS
  useEffect(() => {
    const iosDetected = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(iosDetected);
    console.log('Landing Page - iOS detected:', iosDetected);
  }, []);

  // iOS orientation change detection
  useEffect(() => {
    if (!isIOS) return;

    const handleOrientationChange = () => {
      console.log('Landing Page - iOS orientation change detected');
      setOrientationChanged(true);
      setUserInteracted(true);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isIOS]);

  // Enhanced user interaction detection for iOS
  useEffect(() => {
    let interactionDetected = false;

    const handleUserInteraction = (event: Event) => {
      if (interactionDetected) return;
      
      console.log('Landing Page - User interaction detected:', event.type);
      interactionDetected = true;
      setUserInteracted(true);
      
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('touchend', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  // Faster loading simulation for iOS
  useEffect(() => {
    const baseInterval = isIOS ? 50 : 200; // Much faster on iOS
    const randomRange = isIOS ? 50 : 300;
    
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const increment = Math.random() * (isIOS ? 25 : 15) + (isIOS ? 15 : 5); // Faster increment on iOS
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => {
            setIsFullyLoaded(true);
          }, isIOS ? 50 : 300); // Much shorter delay on iOS
        }
        
        return newProgress;
      });
    }, baseInterval + Math.random() * randomRange);

    return () => clearInterval(loadingInterval);
  }, [isIOS]);

  // PWA setup
  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      setIsInstalled(isStandalone || isFullscreenMode);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Responsive scaling with orientation consideration
  const logoScale = [
    getScale(0.8, 0.7, 1.0, 1.2, 1.5),
    getScale(0.8, 0.7, 1.0, 1.2, 1.5),
    1
  ] as [number, number, number];
  
  // Font size with orientation adjustments
  const fontSize = getFontSize(0.3, 0.25, 0.4, 0.45, 0.6);
  
  // Button scale with hover and orientation
  const buttonScale = (isHovered 
    ? [
        getFontSize(1.3, 1.1, 1.6, 1.8, 2.16), 
        getFontSize(0.325, 0.275, 0.4, 0.45, 0.54), 
        1
      ]
    : [
        getFontSize(1.2, 1.0, 1.45, 1.65, 1.98), 
        getFontSize(0.3, 0.25, 0.3625, 0.4125, 0.495), 
        1
      ]) as [number, number, number];

  // PWA button scale and position
  const pwaButtonScale = (isPWAHovered 
    ? [getScale(0.35, 0.3, 0.4, 0.45, 0.55), getScale(0.35, 0.3, 0.4, 0.45, 0.55), 1]
    : [getScale(0.3, 0.25, 0.35, 0.4, 0.5), getScale(0.3, 0.25, 0.35, 0.4, 0.5), 1]) as [number, number, number];
  
  const pwaButtonPosition = [
    getSpacing(2.2, 1.8, 2.5, 2.8, 3.2),
    getSpacing(0.6, 0.4, 0.7, 0.8, 1.0),
    0.1
  ] as [number, number, number];

  // Loading bar dimensions and position
  const loadingBarWidth = getScale(1.5, 1.25, 1.75, 2.0, 2.25);
  const loadingBarHeight = getScale(0.04, 0.03, 0.05, 0.06, 0.075);
  const loadingBarY = getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0);

  // Smooth handlers to prevent flicker
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    
    // Ensure user interaction is registered
    if (!userInteracted) {
      setUserInteracted(true);
    }
    
    console.log('Start button clicked, iOS:', isIOS, 'User interacted:', userInteracted, 'Orientation changed:', orientationChanged);
    onStart();
  }, [onStart, userInteracted, isIOS, orientationChanged]);

  // PWA button handlers
  const handlePWAPointerEnter = useCallback(() => {
    setIsPWAHovered(true);
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile]);

  const handlePWAPointerLeave = useCallback(() => {
    setIsPWAHovered(false);
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  const handlePWAClick = useCallback(async (event: any) => {
    event.stopPropagation();
    
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  }, [deferredPrompt]);

  useFrame((state) => {
    if (!textRef.current || animationComplete) return;

    const elapsed = state.clock.getElapsedTime();
    const opacity = Math.min(elapsed * 0.5, 1);
    
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }

    if (opacity >= 1) {
      setAnimationComplete(true);
    }
  });

  // Show PWA button only on mobile/tablet when installable and not installed
  const showPWAButton = (isMobile || isTablet) && isInstallable && !isInstalled;

  return (
    <group position-y={0}>
      <mesh position-y={getSpacing(0.8, 0.6, 1.0, 1.2, 1.5)} scale={logoScale}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} depthWrite={false} />
      </mesh>

      <Text
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={0.005}
        position-z={0.1}
        position-y={getSpacing(-0.1, -0.15, -0.05, 0, 0)}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        PILAR APRESENTA
        <meshBasicMaterial ref={materialRef as any} transparent depthTest={false} depthWrite={false} />
      </Text>

      {/* Loading Progress Bar */}
      {!isFullyLoaded && (
        <group position-y={loadingBarY}>
          {/* Background bar */}
          <mesh position-z={0.05}>
            <planeGeometry args={[loadingBarWidth, loadingBarHeight]} />
            <meshBasicMaterial 
              color="#333333" 
              transparent 
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
          
          {/* Progress bar */}
          <mesh 
            position-z={0.06} 
            position-x={-loadingBarWidth/2 + (loadingBarWidth * loadingProgress/100)/2}
            scale-x={loadingProgress/100}
          >
            <planeGeometry args={[loadingBarWidth, loadingBarHeight]} />
            <meshBasicMaterial 
              color="#00ff00" 
              transparent 
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
          
          {/* Progress percentage text */}
          <Text
            fontSize={getFontSize(0.08, 0.06, 0.09, 0.1, 0.125)}
            color="white"
            position-z={0.07}
            position-y={getSpacing(-0.15, -0.12, -0.17, -0.18, -0.2)}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(loadingProgress)}%
          </Text>
          
          {/* iOS-specific loading message */}
          {isIOS && (
            <Text
              fontSize={getFontSize(0.06, 0.05, 0.07, 0.08, 0.1)}
              color="white"
              position-z={0.07}
              position-y={getSpacing(-0.3, -0.25, -0.35, -0.4, -0.45)}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              anchorX="center"
              anchorY="middle"
            >
              {orientationChanged ? 'Pronto para iOS!' : 'Gire a tela para ativar...'}
            </Text>
          )}
        </group>
      )}

      {/* Start Button - only show when fully loaded */}
      {isFullyLoaded && (
        <mesh
          position-y={getSpacing(-0.6, -0.4, -0.7, -0.8, -1.0)}
          scale={buttonScale}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={startButtonTexture}
            transparent
            opacity={1}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* PWA Install Button */}
      {showPWAButton && isFullyLoaded && (
        <group
          position={pwaButtonPosition}
          scale={pwaButtonScale}
          onClick={handlePWAClick}
          onPointerEnter={handlePWAPointerEnter}
          onPointerLeave={handlePWAPointerLeave}
        >
          <mesh position-z={0.01}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial 
              color={isPWAHovered ? "#0066cc" : "#0080ff"} 
              transparent 
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
          
          <mesh position-z={0.005} scale={[1.05, 1.05, 1]}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial 
              color="white" 
              transparent 
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
          
          <Text
            fontSize={0.4}
            color="white"
            position-z={0.02}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            📱
          </Text>
        </group>
      )}
    </group>
  );
};