import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode } from '../../types';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { currentLanguage, setLanguage, supportedLanguages, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'full') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${className}`}>
        {supportedLanguages.map((lang) => {
          const isSelected = lang.code === currentLanguage;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-agri-600 bg-agri-50 shadow-sm ring-2 ring-agri-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <div>
                  <div className="font-bold text-slate-800 text-base leading-tight">
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{lang.name}</div>
                </div>
              </div>
              {isSelected && <Check className="w-5 h-5 text-agri-600 font-bold" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border-2 border-slate-200 hover:border-agri-500 hover:bg-agri-50/40 text-slate-800 shadow-sm transition-all text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agri-500/30"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-agri-600 shrink-0" />
        <span className="text-xs font-extrabold uppercase text-slate-400">Language:</span>
        <span className="font-black text-slate-900">
          {currentLanguageOption.nativeName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-agri-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-2xl border-2 border-slate-100 py-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>🌐 Select Language</span>
            <span className="text-agri-600">{supportedLanguages.length} Indian Languages</span>
          </div>
          <div className="py-1">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-agri-50 font-black text-agri-800'
                      : 'text-slate-700 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">
                        {lang.nativeName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4.5 h-4.5 text-agri-600 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
