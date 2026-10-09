import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAnalysis } from '../context/AnalysisContext';
import { CropInput } from '../components/analyzer/CropInput';
import { ImageUploader } from '../components/analyzer/ImageUploader';
import { AnalysisResultCard } from '../components/analyzer/AnalysisResultCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Stethoscope, AlertCircle, ArrowRight, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Edit3, Info } from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const { t } = useLanguage();
  const {
    cropName,
    setCropName,
    imageDataUrl,
    setImageDataUrl,
    analysisResult,
    setAnalysisResult,
    runAnalysis,
    isAnalyzing,
    isDetectingCrop,
    detectedCropResult,
    cropDetectionError,
  } = useAnalysis();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showManualEdit, setShowManualEdit] = useState<boolean>(false);

  const handleStartAnalysis = async () => {
    if (!imageDataUrl) {
      setValidationError(t('errors.missingImage'));
      return;
    }

    setValidationError(null);
    await runAnalysis(cropName, imageDataUrl);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setImageDataUrl(null);
    setValidationError(null);
    setShowManualEdit(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-agri-100 border border-agri-300 text-agri-900 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-agri-600 fill-agri-600" />
          <span>{t('brand.taglineShort')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('analyzer.title')}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base font-medium">
          {t('analyzer.subtitle')}
        </p>
      </div>

      {isAnalyzing && <LoadingSkeleton />}

      {!isAnalyzing && analysisResult && (
        <AnalysisResultCard result={analysisResult} onReset={handleReset} />
      )}

      {!isAnalyzing && !analysisResult && (
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-8 animate-in fade-in duration-200">
          {/* Step 1: Upload / Capture Image */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-agri-700 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center font-bold">1</span>
              <span>{t('analyzer.step2')}</span>
            </div>
            <ImageUploader
              imageDataUrl={imageDataUrl}
              onImageSelected={setImageDataUrl}
            />
          </div>

          {/* Auto-Detection Status Indicator */}
          {imageDataUrl && (
            <div className="space-y-4">
              {isDetectingCrop && (
                <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm animate-pulse">
                  <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
                  <span className="font-bold text-emerald-950 text-sm">
                    {t('analyzer.detectingCrop')}
                  </span>
                </div>
              )}

              {!isDetectingCrop && detectedCropResult && detectedCropResult.isRecognized && (
                <div
                  className={`rounded-2xl p-4 border-2 shadow-sm transition-all ${
                    detectedCropResult.isCertain
                      ? 'bg-emerald-50/80 border-emerald-300'
                      : 'bg-amber-50/80 border-amber-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {detectedCropResult.isCertain ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                          🌱
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {detectedCropResult.isCertain
                              ? t('analyzer.detectedCropLabel')
                              : t('analyzer.possibleCropLabel')}:
                          </span>
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            {cropName}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                              detectedCropResult.isCertain
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {detectedCropResult.isCertain
                              ? `${t('analyzer.confidenceHigh')} (${detectedCropResult.confidence}%)`
                              : `${t('analyzer.confidenceLow')} (${detectedCropResult.confidence}%)`}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {detectedCropResult.isCertain
                            ? t('analyzer.cropAutoDetectedSuccess')
                            : t('analyzer.uncertaintyTip')}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowManualEdit(!showManualEdit)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-agri-500 text-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all self-start sm:self-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-agri-600" />
                      <span>{t('analyzer.editCropName')}</span>
                    </button>
                  </div>
                </div>
              )}

              {!isDetectingCrop && (cropDetectionError || (detectedCropResult && !detectedCropResult.isRecognized)) && (
                <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-4 flex items-center gap-3 text-slate-800 animate-in fade-in">
                  <Info className="w-5 h-5 text-slate-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-700">
                    {cropDetectionError || t('analyzer.cropUnidentifiedError')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Crop Name Input / Manual Correction */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-agri-700 uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center font-bold">2</span>
                <span>{t('analyzer.step1')}</span>
              </div>
              {cropName && (
                <span className="text-xs font-bold text-agri-800 bg-agri-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
                  <span>{cropName}</span>
                </span>
              )}
            </div>
            <CropInput value={cropName} onChange={setCropName} />
          </div>

          {validationError && (
            <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-bold">{validationError}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || isDetectingCrop}
              className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 bg-gradient-to-r from-agri-600 via-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-agri-600/30 hover:shadow-2xl active:scale-98 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Stethoscope className="w-6 h-6" />
              <span>{t('analyzer.analyzeButton')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
