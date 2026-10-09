import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { formatDate } from '../../utils/dateUtils';
import { Stethoscope, ArrowRight, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface RecentAnalysesWidgetProps {
  onViewDetails: (item: AnalysisResult) => void;
  onNavigateToAnalyze: () => void;
  onNavigateToHistory: () => void;
}

export const RecentAnalysesWidget: React.FC<RecentAnalysesWidgetProps> = ({
  onViewDetails,
  onNavigateToAnalyze,
  onNavigateToHistory,
}) => {
  const { t, currentLanguage } = useLanguage();
  const { history } = useAnalysis();

  const recentList = history.slice(0, 4);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-agri-600" />
          <span>{t('dashboard.recentTitle')}</span>
        </h3>
        {history.length > 0 && (
          <button
            onClick={onNavigateToHistory}
            className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center gap-1 hover:underline"
          >
            <span>{t('dashboard.viewAllWithCount')} ({history.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {recentList.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-agri-100 text-agri-600 flex items-center justify-center font-bold text-xl">
            🌱
          </div>
          <p className="text-sm font-semibold text-slate-600 max-w-xs mx-auto">
            {t('dashboard.noRecent')}
          </p>
          <button
            onClick={onNavigateToAnalyze}
            className="inline-flex items-center gap-2 px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold shadow-md shadow-agri-600/20 active:scale-95 transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t('landing.startAnalysis')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentList.map((item) => {
            const isHigh = item.severity === 'High';
            const isMed = item.severity === 'Medium';
            const severityLabel = isHigh
              ? t('results.severityHigh')
              : isMed
              ? t('results.severityMedium')
              : item.severity === 'Low'
              ? t('results.severityLow')
              : t('results.severityHealthy');

            return (
              <div
                key={item.id}
                onClick={() => onViewDetails(item)}
                className="group p-3.5 bg-slate-50 hover:bg-agri-50/50 border border-slate-200/80 hover:border-agri-400 rounded-2xl transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300 group-hover:scale-105 transition-transform">
                  <img
                    src={item.imageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-agri-700 truncate">
                      {item.cropName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800'
                          : isMed
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isHigh ? (
                        <ShieldAlert className="w-3 h-3" />
                      ) : isMed ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                      <span>{severityLabel}</span>
                    </span>
                  </div>

                  <div className="text-sm font-black text-slate-900 truncate mt-0.5">
                    {item.diseaseName}
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium mt-1">
                    {formatDate(item.createdAt, currentLanguage)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
