import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { ShieldCheck, XCircle } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const { t } = useLanguage();
  const { analysisStageMessage, analysisPercent, cancelAnalysis, imageDataUrl } = useAnalysis();

  return (
    <div className="bg-white border border-agri-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-agri-950/5 max-w-xl mx-auto text-center space-y-6">
      {/* Scanning viewport preview */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-2xl overflow-hidden border-2 border-agri-500 shadow-inner bg-slate-900">
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="Scanning leaf"
            className="w-full h-full object-cover opacity-70 filter contrast-125"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">
            🌿
          </div>
        )}

        {/* Laser scan line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-agri-400 to-transparent shadow-[0_0_15px_#4ade80] animate-scan-line" />

        {/* Reticle grid marks */}
        <div className="absolute inset-2 border border-dashed border-agri-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
          <div className="flex justify-between text-[10px] font-mono text-agri-400 font-bold">
            <span>AI SCAN</span>
            <span>{analysisPercent}%</span>
          </div>
          <div className="text-center font-mono text-[9px] text-agri-300 tracking-wider">
            PATHOLOGY MATRIX
          </div>
        </div>
      </div>

      {/* Progress & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-agri-800 font-bold text-lg sm:text-xl">
          <ShieldCheck className="w-6 h-6 text-agri-600 animate-pulse" />
          <span>{t(analysisStageMessage)}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-agri-500 to-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(8, analysisPercent)}%` }}
          />
        </div>
      </div>

      {/* Cancel button */}
      <div>
        <button
          onClick={cancelAnalysis}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600 px-4 py-2 rounded-xl hover:bg-rose-50 transition-colors"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Scan</span>
        </button>
      </div>
    </div>
  );
};
