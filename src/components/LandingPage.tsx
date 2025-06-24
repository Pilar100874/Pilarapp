import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MeshBasicMaterial, Shape, ShapeGeometry } from 'three';
import { useResponsiveText } from '@/utils/responsive';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Function to create rounded rectangle shape
const createRoundedRectShape = (width: number, height: number, radius: number) => {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  
  return shape;
};

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPWAButtonHovered, setIsPWAButtonHovered] = useState(false);
  const logoTexture = useTexture('/logo_branco.png');
  const startButtonTexture = useTexture('/iniciar.png');
  const pilarIconTexture = useTexture('/icone_pilar.png');
  const textRef = useRef<any>();
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { getFontSize, getSpacing, getScale, isMobile } = useResponsiveText();
  const { viewport } = useThree();

  // PWA Install functionality
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

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

  const handlePWAInstallClick = useCallback(async (event: any) => {
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

  // PWA Button configuration - positioned in bottom right
  const pwaButtonWidth = getFontSize(2.2, 2.0, 2.4, 2.6, 3.0);
  const pwaButtonHeight = getFontSize(0.5, 0.45, 0.55, 0.6, 0.7);
  const pwaButtonFontSize = getFontSize(0.14, 0.12, 0.16, 0.18, 0.2);
  const pwaButtonRadius = getFontSize(0.1, 0.08, 0.11, 0.12, 0.14);
  const pwaIconSize = getFontSize(0.3, 0.25, 0.35, 0.4, 0.45);

  // Position PWA button in bottom right corner with proper margins
  const pwaButtonX = viewport.width / 2 - pwaButtonWidth / 2 - getFontSize(0.4, 0.3, 0.5, 0.6, 0.7);
  const pwaButtonY = -viewport.height / 2 + pwaButtonHeight / 2 + getFontSize(0.4, 0.3, 0.5, 0.6, 0.7);

  // Create rounded rectangle geometry for PWA button
  const pwaRoundedShape = createRoundedRectShape(pwaButtonWidth, pwaButtonHeight, pwaButtonRadius);
  const pwaRoundedGeometry = new ShapeGeometry(pwaRoundedShape);

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

  const handlePWAPointerEnter = useCallback(() => {
    setIsPWAButtonHovered(true);
    if (!isMobile) {
      document.body.style.cursor = 'pointer';
    }
  }, [isMobile]);

  const handlePWAPointerLeave = useCallback(() => {
    setIsPWAButtonHovered(false);
    if (!isMobile) {
      document.body.style.cursor = 'default';
    }
  }, [isMobile]);

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    // Just start the experience - music will start automatically in the opener
    onStart();
  }, [onStart]);

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

      {/* PWA Install Button - only show when installable but not installed */}
      {isInstallable && !isInstalled && (
        <group
          position={[pwaButtonX, pwaButtonY, 0.1]}
          onClick={handlePWAInstallClick}
          onPointerEnter={handlePWAPointerEnter}
          onPointerLeave={handlePWAPointerLeave}
        >
          {/* Button background with rounded corners */}
          <mesh position-z={0.01} geometry={pwaRoundedGeometry}>
            <meshBasicMaterial 
              color={isPWAButtonHovered ? "#ffffff" : "#f0f0f0"} 
              transparent 
              opacity={0.95}
              depthWrite={false}
            />
          </mesh>
          
          {/* Button border */}
          <mesh position-z={0.005} geometry={pwaRoundedGeometry} scale={[1.02, 1.02, 1]}>
            <meshBasicMaterial 
              color={isPWAButtonHovered ? "#333333" : "#666666"} 
              transparent 
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
          
          {/* Pilar Icon */}
          <mesh 
            position={[-pwaButtonWidth / 2 + pwaIconSize / 2 + 0.15, 0, 0.02]}
            scale={[pwaIconSize, pwaIconSize, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={pilarIconTexture} 
              transparent 
              opacity={1}
              depthWrite={false}
            />
          </mesh>
          
          {/* Button text */}
          <Text
            fontSize={pwaButtonFontSize}
            color={isPWAButtonHovered ? "#000000" : "#333333"}
            position={[0.2, 0, 0.02]}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            Instalar App
          </Text>
        </group>
      )}
    </group>
  );
};