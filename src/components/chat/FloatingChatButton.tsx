import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquareQuote, Sparkles } from 'lucide-react';

export const FloatingChatButton: React.FC = () => {
  const { isAssistantOpen, setIsAssistantOpen, analysisResult, cropName } = useAnalysis();
  const { t } = useLanguage();

  if (isAssistantOpen) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-40">
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="group relative flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-full shadow-2xl shadow-amber-600/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-400/40"
        aria-label="Open AI Crop Doctor"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-40 animate-ping pointer-events-none" />

        <div className="relative flex items-center gap-2.5">
          <div className="p-1 rounded-full bg-white/20">
            <MessageSquareQuote className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-wide uppercase flex items-center gap-1">
              <span>{t('chat.floatingTitle')}</span>
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
            </div>
            <div className="text-[10px] text-amber-100 font-medium truncate max-w-[140px]">
              {analysisResult ? `${analysisResult.cropName} Expert` : cropName ? `${cropName} Expert` : '24/7 Agronomist'}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
