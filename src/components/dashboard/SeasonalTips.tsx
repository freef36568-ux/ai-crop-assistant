import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export const SeasonalTips: React.FC = () => {
  const { t } = useLanguage();

  const tips = [
    { id: 1, text: t('dashboard.tip1'), category: t('dashboard.catPestControl') },
    { id: 2, text: t('dashboard.tip2'), category: t('dashboard.catWaterSoil') },
    { id: 3, text: t('dashboard.tip3'), category: t('dashboard.catSeedProtection') },
  ];

  return (
    <div className="bg-gradient-to-br from-agri-900 to-agri-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="p-2 rounded-xl bg-amber-400 text-agri-950 font-bold">
          <Lightbulb className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-white">
            {t('dashboard.seasonalTipsTitle')}
          </h3>
          <span className="text-xs text-agri-200 font-medium">
            {t('dashboard.expertRecommendations')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-agri-800 text-agri-200 border border-agri-700">
                {tip.category}
              </span>
              <CheckCircle2 className="w-4 h-4 text-agri-400" />
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
