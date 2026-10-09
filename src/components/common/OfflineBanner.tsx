import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RotateCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Detects loss/return of network connectivity (works the same in the
 * browser, the PWA, and inside a Capacitor Android WebView, since all of
 * them support the standard `online`/`offline` window events). Never
 * crashes the app — this is purely an informational banner with a manual
 * retry action.
 */
export const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      // Auto-hide the "back online" confirmation after a few seconds
      setTimeout(() => setJustReconnected(false), 4000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleRetry = () => {
    setIsOffline(!navigator.onLine);
  };

  if (!isOffline && !justReconnected) return null;

  if (isOffline) {
    return (
      <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold z-50">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>{t('errors.offlineMessage')}</span>
        <button
          onClick={handleRetry}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{t('errors.retry')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-agri-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold z-50 animate-in fade-in duration-300">
      <Wifi className="w-4 h-4" />
      <span>{t('errors.backOnline')}</span>
    </div>
  );
};
