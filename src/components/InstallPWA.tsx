import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Handle PWA updates if needed
      },
      onOfflineReady() {
        // Handle offline functionality if needed
      },
    });

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    const result = window.confirm('Deseja instalar o aplicativo Pilar Papéis no seu dispositivo?');
    
    if (result) {
      const outcome = await installPrompt.prompt();
      console.log(`Install prompt was: ${outcome.outcome}`);
      setInstallPrompt(null);
      setShowButton(false);
    }
  };

  if (!showButton) return null;

  return (
    <div
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        touchAction: 'manipulation'
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </div>
  );
}