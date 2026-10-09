import { LanguageCode, LanguageOption } from '../types';

import en from './en.json';
import te from './te.json';
import hi from './hi.json';
import ta from './ta.json';
import kn from './kn.json';
import ml from './ml.json';
import mr from './mr.json';
import bn from './bn.json';
import gu from './gu.json';
import pa from './pa.json';
import or from './or.json';
import as from './as.json';
import ur from './ur.json';

export const translations: Record<LanguageCode, typeof en> = {
  en,
  te: te as unknown as typeof en,
  hi: hi as unknown as typeof en,
  ta: ta as unknown as typeof en,
  kn: kn as unknown as typeof en,
  ml: ml as unknown as typeof en,
  mr: mr as unknown as typeof en,
  bn: bn as unknown as typeof en,
  gu: gu as unknown as typeof en,
  pa: pa as unknown as typeof en,
  or: or as unknown as typeof en,
  as: as as unknown as typeof en,
  ur: ur as unknown as typeof en,
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN', flag: '🇬🇧' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🌾' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🌱' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', flag: '🌿' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', flag: '🌴' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', flag: '🌻' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', flag: '🌾' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', flag: '🥜' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN', flag: '🌾' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN', flag: '🍃' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechCode: 'as-IN', flag: '🍵' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechCode: 'ur-IN', flag: '☘️' },
];

export function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
}
