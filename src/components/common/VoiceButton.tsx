import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const { currentLanguage, t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    isListening,
    startListening,
    stopListening,
    isSupported,
    permissionError,
  } = useSpeechRecognition({
    language: currentLanguage,
    onTranscriptChange: (text) => {
      if (text) onTranscript(text);
    },
    onResultFinal: (text) => {
      if (text) onTranscript(text);
    },
    onError: (err) => {
      if (err.includes('permission') || permissionError) {
        setErrorMessage(t('voice.micDenied'));
      } else {
        setErrorMessage(t('voice.notSupported'));
      }
    },
  });


  const handleToggleListening = () => {
    if (!isSupported) {
      setErrorMessage(t('voice.notSupported'));
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    setErrorMessage(null);
    startListening();
  };

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleListening}
        aria-label={t('voice.buttonTitle')}
        title={t('voice.buttonTitle')}
        className={`relative inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse ring-4 ring-rose-400/40'
            : 'bg-agri-600 hover:bg-agri-700 text-white shadow-md shadow-agri-600/20 hover:shadow-lg focus:ring-agri-500/30'
        } ${sizeClasses[size]} ${className}`}
      >
        {/* Pulsing ring waves during speech recognition */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-rose-500 animate-ping opacity-30" />
            <span className="absolute -inset-1 rounded-2xl border-2 border-rose-400 animate-pulse-glow" />
          </>
        )}

        <div className="relative flex items-center gap-2">
          {isListening ? (
            <MicOff className="w-5 h-5 animate-bounce" />
          ) : (
            <Mic className="w-5 h-5" />
          )}

          {showLabel && (
            <span>
              {isListening ? t('voice.listening') : t('voice.buttonTitle')}
            </span>
          )}
        </div>
      </button>

      {/* Floating status pill when listening */}
      {isListening && !showLabel && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20 animate-in fade-in slide-in-from-left-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>{t('voice.listening')}</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute top-full left-0 mt-2 bg-rose-100 border border-rose-300 text-rose-800 text-xs px-3 py-1.5 rounded-lg shadow-md z-20 whitespace-nowrap">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

