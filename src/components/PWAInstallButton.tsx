import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Detect device type
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      setIsMobile(width <= 768 && isMobileDevice);
      setIsTablet(width > 768 && width <= 1024 && isMobileDevice);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);

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
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
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

  // Only show on mobile/tablet and when installable but not installed
  if ((!isMobile && !isTablet) || !isInstallable || isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        top: '85px', // Positioned below the shop icon
        right: '25px',
        zIndex: 1000,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(0, 100, 200, 0.8)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        backgroundImage: 'url(/icopwa.png)',
        backgroundSize: '60%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      onTouchStart={(e) => e.preventDefault()}
      title="Instalar App"
      aria-label="Instalar aplicativo"
    >
      {/* Fallback text if background image doesn't load */}
      <span style={{ 
        fontSize: '12px', 
        opacity: 0.8,
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        📱
      </span>
    </button>
  );
};