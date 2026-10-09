import React from 'react';
import { CropInfo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, Droplets, Thermometer, Calendar, ChevronRight, Stethoscope } from 'lucide-react';

interface CropCardProps {
  crop: CropInfo;
  onSelect: (crop: CropInfo) => void;
  onAnalyze: (crop: CropInfo) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop, onSelect, onAnalyze }) => {
  const { currentLanguage, t } = useLanguage();
  const localizedName = crop.localNames[currentLanguage] || crop.name;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-agri-400 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Crop Hero Thumbnail */}
        <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
          <img
            src={crop.imageUrl}
            alt={localizedName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
            {crop.category}
          </div>

          {/* Disease count badge */}
          <div className="absolute top-3 right-3 bg-rose-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{crop.commonDiseases.length} {t('library.diseasesCount')}</span>
          </div>

          {/* Crop Title Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-xl font-black leading-tight drop-shadow-sm">
              {localizedName}
            </h3>
            <p className="text-xs text-slate-200 italic font-serif">
              {crop.scientificName}
            </p>
          </div>
        </div>

        {/* Quick agronomic metrics */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-agri-600 shrink-0" />
              <span className="truncate">{crop.durationDays}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{crop.waterRequirement} Water</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 col-span-2">
              <Thermometer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{crop.optimalTemperature}</span>
            </div>
          </div>

          {/* Common diseases list chips */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('library.majorDiseasesTitle')}:
            </div>
            <div className="flex flex-wrap gap-1">
              {crop.commonDiseases.slice(0, 2).map((d) => (
                <span
                  key={d.id}
                  className="text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200/60 px-2 py-0.5 rounded-md"
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          onClick={() => onSelect(crop)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
        >
          <span>{t('library.viewDetails')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onAnalyze(crop)}
          className="p-2.5 rounded-xl bg-agri-600 hover:bg-agri-700 text-white shadow-md shadow-agri-600/20 active:scale-95 transition-transform"
          title="Analyze this crop"
        >
          <Stethoscope className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
