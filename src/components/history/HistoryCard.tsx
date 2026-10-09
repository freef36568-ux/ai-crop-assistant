import React from 'react';
import { AnalysisResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/dateUtils';
import { generatePdfReport } from '../../services/pdfService';
import { ShieldAlert, ShieldCheck, AlertTriangle, Download, Trash2, Eye } from 'lucide-react';

interface HistoryCardProps {
  item: AnalysisResult;
  onView: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onView, onDelete }) => {
  const { currentLanguage, t } = useLanguage();

  const isHigh = item.severity === 'High';
  const isMed = item.severity === 'Medium';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    generatePdfReport(item, currentLanguage);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('history.confirmDelete'))) {
      onDelete(item.id);
    }
  };

  return (
    <div
      onClick={() => onView(item)}
      className="bg-white rounded-3xl border border-slate-200/90 hover:border-agri-400 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Leaf Thumbnail */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
          <img
            src={item.imageUrl}
            alt={item.cropName}
            className="w-full h-full object-cover"
          />
          {item.isDemo && (
            <span className="absolute bottom-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded">
              DEMO
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-agri-700 bg-agri-50 px-2.5 py-0.5 rounded-lg border border-agri-200">
              {item.cropName}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
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
              <span>{item.severity}</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
            {item.diseaseName}
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>{formatDate(item.createdAt, currentLanguage)}</span>
            <span>•</span>
            <span className="text-agri-600 font-bold">{item.confidence}% Match</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(item);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          title={t('history.viewDetails')}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">{t('history.viewDetails')}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 border border-agri-200 text-xs font-bold transition-colors"
          title={t('history.downloadReport')}
        >
          <Download className="w-4 h-4 text-agri-600" />
          <span className="hidden md:inline">PDF</span>
        </button>

        <button
          onClick={handleDelete}
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
          title={t('history.delete')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
