import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { Stethoscope, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { history } = useAnalysis();

  const totalScans = history.length;
  const highAlerts = history.filter((h) => h.severity === 'High').length;
  const healthyCount = history.filter((h) => h.severity === 'Healthy' || h.severity === 'Low').length;
  const treatedCount = Math.max(0, totalScans - highAlerts);

  const stats = [
    {
      id: 'total',
      label: t('dashboard.statsTotal'),
      value: totalScans,
      icon: Stethoscope,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'healthy',
      label: t('dashboard.statsHealthy'),
      value: healthyCount,
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'alerts',
      label: t('dashboard.statsAlerts'),
      value: highAlerts,
      icon: AlertOctagon,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-600 text-white',
    },
    {
      id: 'treated',
      label: t('dashboard.statsTreated'),
      value: treatedCount,
      icon: CheckCircle2,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-transform hover:scale-[1.02] bg-white shadow-sm flex flex-col justify-between ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl shadow-sm ${stat.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {stat.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
