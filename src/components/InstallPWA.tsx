import { useEffect, useState } from 'react';

export const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
      setIsMobileOrTablet(isMobile);
    };

    checkDevice();

    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) return;
    promptInstall.prompt();

    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA || !isMobileOrTablet) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <button
        onClick={handleInstallClick}
        style={{
          padding: '12px 24px',
          backgroundColor: '#000',
          color: '#fff',
          border: '1px solid #fff',
          borderRadius: '24px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <img 
          src="/logo_branco.png" 
          alt="Pilar Logo" 
          style={{ 
            width: '24px', 
            height: '24px',
            objectFit: 'contain'
          }} 
        />
        Instalar App
      </button>
    </div>
  );
};