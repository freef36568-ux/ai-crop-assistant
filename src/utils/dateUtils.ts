import { LanguageCode } from '../types';

export function formatDate(isoString: string, lang: LanguageCode = 'en'): string {
  try {
    const date = new Date(isoString);
    const localeMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      as: 'as-IN',
      ur: 'ur-IN',
    };

    return new Intl.DateTimeFormat(localeMap[lang] || 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}
