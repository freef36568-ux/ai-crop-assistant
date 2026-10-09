import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES, translations, getNestedTranslation } from '../i18n';
import { storageService } from '../services/storageService';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  supportedLanguages: LanguageOption[];
  currentLanguageOption: LanguageOption;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const saved = storageService.getSettings();
    return saved.language || 'en';
  });

  useEffect(() => {
    // Set document lang attribute
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    storageService.saveSettings({ language: lang });
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const t = (path: string, fallback?: string): string => {
    const currentDict = translations[currentLanguage] || translations.en;
    const translated = getNestedTranslation(currentDict as unknown as Record<string, unknown>, path);

    if (translated !== path) {
      return translated;
    }

    // Fallback to English if translation is missing in selected language
    const enDict = translations.en;
    const enTranslated = getNestedTranslation(enDict as unknown as Record<string, unknown>, path);
    if (enTranslated !== path) {
      return enTranslated;
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
