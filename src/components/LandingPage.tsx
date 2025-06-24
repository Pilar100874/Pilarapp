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
  const [showPWAButton, setShowPWAButton] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const installed = isStandalone || isFullscreenMode || isIOSStandalone;
      setIsInstalled(installed);
      
      // Show PWA button on mobile devices when not installed
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768;
      setShowPWAButton(isMobileDevice && !installed);
      
      console.log('PWA Status:', { installed, isMobileDevice, showButton: isMobileDevice && !installed });
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setShowPWAButton(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPWAButton(false);
      setDeferredPrompt(null);
    };

    // Listen for resize to update mobile detection
    const handleResize = () => {
      checkInstalled();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('resize', handleResize);

    // Force show button for testing on mobile (remove in production)
    const forceShowOnMobile = () => {
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768;
      if (isMobileDevice && !isInstalled) {
        setShowPWAButton(true);
        console.log('Force showing PWA button on mobile');
      }
    };

    // Delay to ensure proper detection
    setTimeout(forceShowOnMobile, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', handleResize);
    };
  }, [isInstalled]);

  const handlePWAInstallClick = useCallback(async (event: any) => {
    event.stopPropagation();
    
    console.log('PWA install button clicked', { deferredPrompt, isInstallable });
    
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        console.log('PWA install choice:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installation accepted');
        } else {
          console.log('PWA installation dismissed');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
        setShowPWAButton(false);
      } catch (error) {
        console.error('Error during PWA installation:', error);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      // Show instructions for manual installation
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let message = 'Para instalar este app:\n\n';
      
      if (isIOS) {
        message += '1. Toque no ícone de compartilhar (□↗)\n';
        message += '2. Selecione "Adicionar à Tela de Início"\n';
        message += '3. Toque em "Adicionar"';
      } else if (isAndroid) {
        message += '1. Toque no menu do navegador (⋮)\n';
        message += '2. Selecione "Adicionar à tela inicial"\n';
        message += '3. Toque em "Adicionar"';
      } else {
        message += '1. Abra o menu do navegador\n';
        message += '2. Procure por "Instalar app" ou "Adicionar à tela inicial"\n';
        message += '3. Siga as instruções';
      }
      
      alert(message);
    }
  }, [deferredPrompt, isInstallable]);

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

  // PWA Button configuration - positioned in bottom center
  const pwaButtonWidth = getFontSize(2.4, 2.2, 2.6, 2.8, 3.2);
  const pwaButtonHeight = getFontSize(0.6, 0.55, 0.65, 0.7, 0.8);
  const pwaButtonFontSize = getFontSize(0.16, 0.14, 0.18, 0.2, 0.22);
  const pwaButtonRadius = getFontSize(0.12, 0.1, 0.13, 0.14, 0.16);
  const pwaIconSize = getFontSize(0.35, 0.3, 0.4, 0.45, 0.5);

  // Position PWA button in bottom center with proper margins
  const pwaButtonX = 0; // Center horizontally
  const pwaButtonY = getSpacing(-1.8, -1.5, -2.0, -2.2, -2.5); // Bottom position

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

      {/* PWA Install Button - show on mobile devices when not installed */}
      {showPWAButton && (
        <group
          position={[pwaButtonX, pwaButtonY, 0.1]}
          onClick={handlePWAInstallClick}
          onPointerEnter={handlePWAPointerEnter}
          onPointerLeave={handlePWAPointerLeave}
        >
          {/* Button background with rounded corners */}
          <mesh position-z={0.01} geometry={pwaRoundedGeometry}>
            <meshBasicMaterial 
              color={isPWAButtonHovered ? "#4CAF50" : "#2196F3"} 
              transparent 
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
          
          {/* Button border */}
          <mesh position-z={0.005} geometry={pwaRoundedGeometry} scale={[1.02, 1.02, 1]}>
            <meshBasicMaterial 
              color={isPWAButtonHovered ? "#388E3C" : "#1976D2"} 
              transparent 
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
          
          {/* Pilar Icon */}
          <mesh 
            position={[-pwaButtonWidth / 2 + pwaIconSize / 2 + 0.2, 0, 0.02]}
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
            color="#ffffff"
            position={[0.3, 0, 0.02]}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            📱 Instalar App
          </Text>
        </group>
      )}
    </group>
  );
};