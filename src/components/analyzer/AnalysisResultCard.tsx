import React, { useState } from 'react';
import { AnalysisResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { generatePdfReport } from '../../services/pdfService';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  MessageSquareQuote,
  RotateCcw,
  Sparkles,
  Leaf,
  FlaskConical,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result, onReset }) => {
  const { currentLanguage, t } = useLanguage();
  const { setIsAssistantOpen } = useAnalysis();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const severityConfig = {
    High: {
      label: t('results.severityHigh'),
      bg: 'bg-rose-100 border-rose-300 text-rose-800',
      badge: 'bg-rose-600 text-white',
      icon: ShieldAlert,
    },
    Medium: {
      label: t('results.severityMedium'),
      bg: 'bg-amber-100 border-amber-300 text-amber-900',
      badge: 'bg-amber-600 text-white',
      icon: AlertTriangle,
    },
    Low: {
      label: t('results.severityLow'),
      bg: 'bg-blue-100 border-blue-300 text-blue-800',
      badge: 'bg-blue-600 text-white',
      icon: ShieldCheck,
    },
    Healthy: {
      label: t('results.severityHealthy'),
      bg: 'bg-emerald-100 border-emerald-300 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      icon: ShieldCheck,
    },
  };

  const currentSeverity = severityConfig[result.severity] || severityConfig.Medium;
  const SeverityIcon = currentSeverity.icon;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePdfReport(result, currentLanguage);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-900/5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Header Grid */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-slate-100 pb-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-agri-500 shrink-0 shadow-md">
            <img
              src={result.imageUrl}
              alt={result.cropName}
              className="w-full h-full object-cover"
            />
            {result.isDemo && (
              <span className="absolute bottom-1 right-1 bg-amber-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                DEMO
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold text-agri-700 bg-agri-50 px-2.5 py-1 rounded-lg border border-agri-200">
                {t('results.crop')}: {result.cropName}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${currentSeverity.badge} flex items-center gap-1`}>
                <SeverityIcon className="w-3.5 h-3.5" />
                <span>{currentSeverity.label}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {result.diseaseName}
            </h2>

            {result.scientificName && (
              <p className="text-xs sm:text-sm italic text-slate-500 font-serif">
                {result.scientificName}
              </p>
            )}

            {/* Confidence Bar */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold text-slate-500">
                {t('results.confidence')}:
              </span>
              <div className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-agri-600 h-full rounded-full"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-sm font-black text-agri-700">
                {result.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* PDF Action bar */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-agri-400" />
            <span>{t('results.downloadReport')}</span>
          </button>
        </div>
      </div>

      {/* Immediate Alert banner if present */}
      {result.recommendedCare.immediateAction && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              {t('results.immediateAction')}
            </div>
            <p className="text-sm font-bold text-rose-950 mt-0.5">
              {result.recommendedCare.immediateAction}
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Grid: Symptoms & Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-700">🔍</span>
            <span>{t('results.symptoms')}</span>
          </h3>
          <ul className="space-y-2">
            {result.symptoms.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Causes */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-100 text-indigo-700">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span>{t('results.causes')}</span>
          </h3>
          <ul className="space-y-2">
            {result.possibleCauses.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Prescribed Treatments: Organic & Chemical */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-agri-600" />
          <span>{t('results.recommendedCare')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organic Care */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{t('results.organicCare')}</span>
            </div>
            <ul className="space-y-2.5">
              {result.recommendedCare.organic.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-950 font-medium">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chemical Spray Schedule */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>{t('results.chemicalCare')}</span>
            </div>
            <ul className="space-y-2.5">
              {result.recommendedCare.chemical.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-amber-950 font-medium">
                  <span className="text-amber-600 font-bold">🧪</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Prevention Advice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>{t('results.prevention')}</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {result.prevention.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
              <span className="text-agri-600 font-bold">🛡️</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>{t('results.askAboutDisease')}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('results.newAnalysis')}</span>
        </button>
      </div>
    </div>
  );
};
