import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      setIsInstalled(isStandalone || isFullscreenMode);
      setIsFullscreen(isFullscreenMode);
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

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null ||
        (document as any).webkitFullscreenElement !== null ||
        (document as any).mozFullScreenElement !== null ||
        (document as any).msFullscreenElement !== null
      );
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
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

  const handleFullscreenToggle = useCallback(async () => {
    try {
      if (!isFullscreen) {
        // Enter fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [isFullscreen]);

  // Don't show if not mobile or if already installed and in fullscreen
  if (!isMobile || (isInstalled && isFullscreen)) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '85px', // 10px below the shop icon (75px + 10px)
        right: '25px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Install PWA Button */}
      {isInstallable && !isInstalled && (
        <button
          onClick={handleInstallClick}
          style={{
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
            fontSize: '20px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          title="Instalar App"
          aria-label="Instalar aplicativo"
        >
          📱
        </button>
      )}

      {/* Fullscreen Toggle Button */}
      <button
        onClick={handleFullscreenToggle}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          backgroundColor: isFullscreen 
            ? 'rgba(200, 100, 0, 0.8)' 
            : 'rgba(100, 0, 200, 0.8)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
      >
        {isFullscreen ? '🔳' : '⛶'}
      </button>
    </div>
  );
};