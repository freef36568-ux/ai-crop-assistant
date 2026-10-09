import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAnalysis } from '../context/AnalysisContext';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { WeatherAlertCard } from '../components/dashboard/WeatherAlertCard';
import { RecentAnalysesWidget } from '../components/dashboard/RecentAnalysesWidget';
import { SeasonalTips } from '../components/dashboard/SeasonalTips';
import { CropInput } from '../components/analyzer/CropInput';
import { ImageUploader } from '../components/analyzer/ImageUploader';
import { Stethoscope, ArrowRight, MessageSquareQuote, Sparkles, BookOpen } from 'lucide-react';
import { CROP_DATABASE } from '../services/cropDatabase';
import { AnalysisResult, CropInfo } from '../types';

interface DashboardPageProps {
  setActivePage: (page: string) => void;
  onViewAnalysisResult: (result: AnalysisResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActivePage,
  onViewAnalysisResult,
}) => {
  const { currentLanguage, t } = useLanguage();
  const {
    cropName,
    setCropName,
    imageDataUrl,
    setImageDataUrl,
    runAnalysis,
    isAnalyzing,
    setIsAssistantOpen,
    setSelectedCropDetail,
  } = useAnalysis();

  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickAnalyze = async () => {
    if (!imageDataUrl) {
      setQuickError(t('errors.missingImage'));
      return;
    }

    setQuickError(null);
    setActivePage('analyze');
    await runAnalysis();
  };

  const handleSelectCrop = (crop: CropInfo) => {
    setSelectedCropDetail(crop);
    setActivePage('library');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agri-600 via-agri-700 to-agri-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-agri-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('brand.name')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">{t('dashboard.welcome')}</h1>
          <p className="text-agri-100 text-sm sm:text-base max-w-xl font-medium">
            {t('dashboard.welcomeSub')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => setActivePage('analyze')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-agri-800 font-extrabold text-sm shadow-md hover:bg-agri-50 active:scale-95 transition-all"
          >
            <Stethoscope className="w-5 h-5 text-agri-600" />
            <span>{t('nav.analyze')}</span>
          </button>

          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
          >
            <MessageSquareQuote className="w-5 h-5" />
            <span>{t('chat.floatingTitle')}</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border-2 border-agri-200/90 rounded-3xl p-6 sm:p-7 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-agri-600" />
                  <span>{t('dashboard.quickAnalysisTitle')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t('dashboard.quickAnalysisDesc')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CropInput value={cropName} onChange={setCropName} />
              <ImageUploader
                imageDataUrl={imageDataUrl}
                onImageSelected={setImageDataUrl}
              />
            </div>

            {quickError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm p-3.5 rounded-xl font-semibold">
                {quickError}
              </div>
            )}

            <button
              onClick={handleQuickAnalyze}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 text-white font-black text-base rounded-2xl shadow-lg shadow-agri-600/20 active:scale-98 transition-all"
            >
              <Stethoscope className="w-5 h-5" />
              <span>{t('analyzer.analyzeButton')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <RecentAnalysesWidget
            onViewDetails={(item: AnalysisResult) => {
              onViewAnalysisResult(item);
              setActivePage('analyze');
            }}
            onNavigateToAnalyze={() => setActivePage('analyze')}
            onNavigateToHistory={() => setActivePage('history')}
          />
        </div>

        <div className="space-y-8">
          <WeatherAlertCard />

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-agri-600" />
                <span>{t('dashboard.cropLibraryQuick')}</span>
              </h3>
              <button
                onClick={() => setActivePage('library')}
                className="text-xs font-bold text-agri-700 hover:underline flex items-center gap-1"
              >
                <span>{t('dashboard.all15')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CROP_DATABASE.slice(0, 6).map((crop: CropInfo) => {
                const locName = crop.localNames[currentLanguage] || crop.name;
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleSelectCrop(crop)}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-agri-50 border border-slate-100 hover:border-agri-300 transition-all text-left flex items-center gap-2.5 group"
                  >
                    <img
                      src={crop.imageUrl}
                      alt={locName}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-agri-700 truncate">
                        {locName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {crop.commonDiseases.length} {t('dashboard.diseasesLabel')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <SeasonalTips />
    </div>
  );
};
