import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceButton } from '../common/VoiceButton';
import { Sprout, Keyboard, Mic, Sparkles } from 'lucide-react';
import { CROP_DATABASE } from '../../services/cropDatabase';

interface CropInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const CropInput: React.FC<CropInputProps> = ({ value, onChange, className = '' }) => {
  const { currentLanguage, t } = useLanguage();
  const [inputMode, setInputMode] = useState<'type' | 'voice'>('type');

  const popularCrops = CROP_DATABASE.slice(0, 6);

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript) {
      onChange(transcript);
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Choice Selector Header: Option A (Type) vs Option B (Voice) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="block text-sm font-bold text-slate-800">
          <span className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-agri-600" />
            <span>{t('analyzer.cropNameLabel')}</span>
            <span className="text-[11px] font-bold text-agri-700 bg-agri-50 border border-agri-200 px-2 py-0.5 rounded-full">
              {t('analyzer.optionalCropBadge')}
            </span>
          </span>
        </label>

        {/* Input Mode Choice Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setInputMode('type')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              inputMode === 'type'
                ? 'bg-white text-agri-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{t('analyzer.optionType')}</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('voice')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              inputMode === 'voice'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{t('analyzer.optionVoice')}</span>
          </button>
        </div>
      </div>

      {/* Input container according to chosen mode or combined */}
      {inputMode === 'voice' ? (
        /* VOICE INPUT FOCUSED CARD */
        <div className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-2xl space-y-3 text-center animate-in fade-in duration-200">
          <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span>{t('analyzer.optionVoice')} ({currentLanguage.toUpperCase()})</span>
          </div>

          <p className="text-xs text-amber-800 font-medium">
            {t('analyzer.voicePrompt')}
          </p>

          <div className="flex justify-center py-1">
            <VoiceButton
              onTranscript={handleVoiceTranscript}
              size="lg"
              showLabel={true}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl shadow-lg shadow-amber-500/30 text-base"
            />
          </div>

          {/* Result Text input allowing manual edit of recognized voice text */}
          <div className="relative pt-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('analyzer.voiceResultPlaceholder')}
              className="w-full pl-4 pr-10 py-3 bg-white rounded-xl border border-amber-300 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-center"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs font-bold rounded-full bg-slate-100"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ) : (
        /* MANUAL TYPING FOCUSED INPUT */
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('analyzer.cropNamePlaceholder')}
              className="w-full pl-4 pr-12 py-3.5 bg-white rounded-2xl border-2 border-slate-200 text-slate-900 text-base font-semibold placeholder:text-slate-400 focus:outline-none focus:border-agri-600 focus:ring-4 focus:ring-agri-500/15 shadow-sm transition-all"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs font-bold rounded-full bg-slate-100"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Voice Mic Shortcut */}
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            size="md"
            className="shrink-0"
          />
        </div>
      )}

      {/* Popular Crop Quick Chips */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-xs font-semibold text-slate-500">
          {t('analyzer.popularCropsLabel')}
        </span>
        {popularCrops.map((crop) => {
          const localizedName = crop.localNames[currentLanguage] || crop.name;
          const isSelected = value.toLowerCase() === localizedName.toLowerCase() || value.toLowerCase() === crop.id;
          return (
            <button
              key={crop.id}
              type="button"
              onClick={() => onChange(localizedName)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                isSelected
                  ? 'bg-agri-600 text-white shadow-sm ring-2 ring-agri-500/30'
                  : 'bg-slate-100 hover:bg-agri-50 text-slate-700 hover:text-agri-800 border border-slate-200/80'
              }`}
            >
              {localizedName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
