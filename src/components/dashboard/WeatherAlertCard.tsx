import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CloudRain, Droplets, Thermometer, Wind, AlertTriangle } from 'lucide-react';

export const WeatherAlertCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Background illustration */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <CloudRain className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {t('dashboard.weatherTitle')}
              </h3>
              <span className="text-xs text-blue-200 font-medium">
                {t('dashboard.microclimate')}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('dashboard.fungalRiskModerate')}</span>
          </span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[11px] text-blue-200 font-semibold">
                {t('dashboard.temperature')}
              </div>
              <div className="text-lg font-black text-white">28°C</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[11px] text-blue-200 font-semibold">
                {t('dashboard.humidity')}
              </div>
              <div className="text-lg font-black text-cyan-300">82%</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <Wind className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[11px] text-blue-200 font-semibold">
                {t('dashboard.windSpeed')}
              </div>
              <div className="text-lg font-black text-white">12 km/h</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <CloudRain className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-[11px] text-blue-200 font-semibold">
                {t('dashboard.rainChance')}
              </div>
              <div className="text-lg font-black text-white">45%</div>
            </div>
          </div>
        </div>

        {/* Advisory Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
          🌾 <strong className="text-white">{t('dashboard.agronomyAdvisory')}</strong> {t('dashboard.weatherTip')}
        </div>
      </div>
    </div>
  );
};
