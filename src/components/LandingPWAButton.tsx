import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const LandingPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Detect device type
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // More precise mobile/tablet detection
      if (isMobileDevice) {
        if (width <= 768 || (width <= 1024 && height <= 768)) {
          setIsMobile(true);
          setIsTablet(false);
        } else if (width <= 1024) {
          setIsMobile(false);
          setIsTablet(true);
        } else {
          setIsMobile(false);
          setIsTablet(false);
        }
      } else {
        setIsMobile(false);
        setIsTablet(false);
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkDevice, 100);
    });

    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isFullscreenMode || isIOSStandalone);
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
      window.removeEventListener('orientationchange', checkDevice);
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
    <>
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 6px 20px rgba(0, 100, 200, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 8px 25px rgba(0, 100, 200, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          100% {
            box-shadow: 0 6px 20px rgba(0, 100, 200, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
      <button
        onClick={handleInstallClick}
        style={{
          position: 'fixed',
          bottom: isMobile ? '30px' : '40px',
          right: isMobile ? '20px' : '30px',
          zIndex: 1000,
          width: isMobile ? '60px' : '70px',
          height: isMobile ? '60px' : '70px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.9)',
          backgroundColor: 'rgba(0, 100, 200, 0.9)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          boxShadow: '0 6px 20px rgba(0, 100, 200, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          backgroundImage: 'url(/ico.png)',
          backgroundSize: '50%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'pulse 2s infinite',
        }}
        onTouchStart={(e) => e.preventDefault()}
        onMouseEnter={(e) => {
          if (!isMobile && !isTablet) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 100, 200, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile && !isTablet) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 100, 200, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)';
          }
        }}
        title="Instalar App Pilar"
        aria-label="Instalar aplicativo Pilar"
      >
        {/* Fallback icon and text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          lineHeight: '1',
        }}>
          <span style={{ 
            fontSize: isMobile ? '20px' : '24px',
            marginBottom: '2px',
          }}>
            📱
          </span>
          <span style={{ 
            fontSize: isMobile ? '8px' : '9px',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            opacity: 0.9,
          }}>
            INSTALAR
          </span>
        </div>
      </button>
    </>
  );
};