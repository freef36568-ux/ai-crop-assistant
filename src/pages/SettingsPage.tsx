import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { storageService, AppSettings } from '../services/storageService';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Settings as SettingsIcon,
  Globe,
  Database,
  Key,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [savedSuccess] = useState(false);

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear local storage cache?')) {
      storageService.clearAllAnalyses();
      alert(t('settings.dataCleared'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-agri-600" />
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-2.5 font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t('settings.settingsSaved')}</span>
        </div>
      )}

      {/* Language Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-agri-100 text-agri-700">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('settings.languageSection')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('settings.selectLanguage')}</p>
          </div>
        </div>

        <LanguageSelector variant="full" />
      </div>

      {/* Cloud & Supabase Sync Status */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('settings.storageSection')}</h2>
              <p className="text-xs text-slate-500 font-medium">Local database & cloud synchronization</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>{isSupabaseConfigured ? t('settings.syncConnected') : t('settings.syncOffline')}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50/60 rounded-2xl border border-rose-100">
          <div>
            <div className="text-sm font-bold text-rose-900">{t('settings.clearLocalData')}</div>
            <div className="text-xs text-rose-600 font-medium">Wipes local history and cache on this device</div>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* AI Credentials info */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('settings.apiSection')}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Configure Gemini Vision API or Supabase Edge Functions
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-600 leading-relaxed">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Google Gemini Vision API Key (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={settings.customGeminiApiKey || ''}
                onChange={(e) => setSettings({ ...settings, customGeminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => {
                  storageService.saveSettings(settings);
                  alert(t('settings.settingsSaved'));
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Save Key
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Enables real-time plant and crop identification from uploaded photos using Gemini 1.5 Flash Vision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
