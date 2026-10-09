import React, { useState } from 'react';
import { isGeminiConfigured, isSupabaseConfigured } from '../../lib/supabase';
import { Sparkles, Settings, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DemoBannerProps {
  onNavigateToSettings?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onNavigateToSettings }) => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // If live Gemini or Supabase is configured, show a positive live status badge or hide banner
  const isLive = isGeminiConfigured || isSupabaseConfigured;

  if (dismissed) return null;

  if (isLive) {
    return (
      <div className="bg-emerald-900 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live AI Engine Active (Connected to Cloud Backend)</span>
        </div>
      </div>
    );
  }

  return (
    <aside aria-label="Demo mode notice" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs sm:text-sm py-2 px-4 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-white/20 p-1 rounded-lg">
            <Sparkles className="w-4 h-4 text-amber-100" />
          </span>
          <p className="font-medium">
            <strong className="font-bold">Demo Mode:</strong>{' '}
            <span>{t('analyzer.demoNotice')}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateToSettings && (
            <button
              onClick={onNavigateToSettings}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
