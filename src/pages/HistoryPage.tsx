import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAnalysis } from '../context/AnalysisContext';
import { HistoryCard } from '../components/history/HistoryCard';
import { History, Search, Filter, Trash2, Stethoscope } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryPageProps {
  setActivePage: (page: string) => void;
  onViewAnalysisResult: (result: AnalysisResult) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  setActivePage,
  onViewAnalysisResult,
}) => {
  const { t } = useLanguage();
  const { history, deleteHistoryItem, clearAllHistory } = useAnalysis();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filteredHistory = history.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCrop = item.cropName.toLowerCase().includes(q);
      const matchDisease = item.diseaseName.toLowerCase().includes(q);
      if (!matchCrop && !matchDisease) return false;
    }

    if (filterSeverity !== 'All') {
      if (filterSeverity === 'High' && item.severity !== 'High') return false;
      if (filterSeverity === 'Medium' && item.severity !== 'Medium') return false;
      if (filterSeverity === 'Low' && item.severity !== 'Low') return false;
    }

    return true;
  });

  const handleClearAll = async () => {
    if (window.confirm(t('history.confirmClear'))) {
      await clearAllHistory();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <History className="w-8 h-8 text-agri-600" />
            <span>{t('history.title')}</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {t('history.subtitle')} ({history.length} {t('history.totalScans')})
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('history.clearHistory')}</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('history.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-agri-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {['All', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filterSeverity === sev
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sev === 'All' ? t('history.filterAll') : sev}
              </button>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/90 p-8 space-y-4 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-agri-50 text-agri-600 flex items-center justify-center font-bold text-3xl mx-auto shadow-inner">
            🌱
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              {t('history.noHistory')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t('history.noHistorySub')}
            </p>
          </div>
          <button
            onClick={() => setActivePage('analyze')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-agri-600/20 active:scale-95 transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t('landing.startAnalysis')}</span>
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <p className="text-sm font-semibold text-slate-600">
            No diagnoses match your search query.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={(it) => {
                onViewAnalysisResult(it);
                setActivePage('analyze');
              }}
              onDelete={deleteHistoryItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
