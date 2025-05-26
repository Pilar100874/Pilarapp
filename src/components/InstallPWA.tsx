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
    <button
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        padding: '8px 16px',
        backgroundColor: '#000',
        color: '#fff',
        border: '1px solid #fff',
        borderRadius: '20px',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span style={{ fontSize: '18px' }}>📱</span>
      Instalar App
    </button>
  );
};