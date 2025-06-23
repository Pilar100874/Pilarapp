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

  useEffect(() => {
    // Detectar dispositivo móvel
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Considerar mobile apenas para telas menores (celulares)
      setIsMobile(width <= 768 && isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Verificar se já está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      setIsInstalled(isStandalone || isFullscreenMode);
    };

    checkInstalled();

    // Escutar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Escutar evento de app instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('resize', checkMobile);
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
        console.log('Instalação PWA aceita');
      } else {
        console.log('Instalação PWA rejeitada');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Erro durante instalação PWA:', error);
    }
  }, [deferredPrompt]);

  // Mostrar apenas em mobile quando instalável mas não instalado
  if (!isMobile || !isInstallable || isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        top: '85px', // Abaixo do ícone da loja
        right: '25px',
        zIndex: 1000,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(0, 120, 255, 0.9)', // Azul iOS
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0, 120, 255, 0.4)',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onTouchStart={(e) => e.preventDefault()}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 120, 255, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 120, 255, 0.4)';
      }}
      title="Instalar App Pilar"
      aria-label="Instalar aplicativo Pilar"
    >
      {/* Ícone usando a imagem ico.png */}
      <img 
        src="/ico.png" 
        alt="Instalar App"
        style={{
          width: '28px',
          height: '28px',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)', // Torna a imagem branca
        }}
      />
    </button>
  );
};