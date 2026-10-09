import React, { useState } from 'react';
import { CropInfo, CropDisease } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Calendar,
  Droplets,
  Thermometer,
  Layers,
  ShieldAlert,
  Leaf,
  FlaskConical,
  Stethoscope,
  Lightbulb,
} from 'lucide-react';

interface CropDetailModalProps {
  crop: CropInfo | null;
  onClose: () => void;
  onAnalyze: (crop: CropInfo) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({ crop, onClose, onAnalyze }) => {
  const { currentLanguage, t } = useLanguage();
  const [selectedDisease, setSelectedDisease] = useState<CropDisease | null>(null);

  if (!crop) return null;

  const localizedName = crop.localNames[currentLanguage] || crop.name;
  const activeDisease = selectedDisease || crop.commonDiseases[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Hero Banner */}
        <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
          <img
            src={crop.imageUrl}
            alt={localizedName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-agri-600/90 text-white mb-2 inline-block">
                {crop.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">{localizedName}</h2>
              <p className="text-xs sm:text-sm text-slate-300 italic font-serif">
                {crop.scientificName}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onAnalyze(crop);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-agri-600/30 active:scale-95 transition-all shrink-0"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Diagnose {localizedName}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Agronomy Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-agri-600" />
                <span>{t('library.season')}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{crop.season}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                <span>Optimal Temp</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{crop.optimalTemperature}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('library.water')}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{crop.waterRequirement}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>{t('library.duration')}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{crop.durationDays}</div>
            </div>
          </div>

          {/* Soil Type */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-1">
            <strong className="font-bold flex items-center gap-1.5 text-amber-900">
              <span>🌾 Soil Requirement:</span>
            </strong>
            <p>{crop.soilType}</p>
          </div>

          {/* Diseases Tab System */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{t('library.majorDiseasesTitle')} ({crop.commonDiseases.length})</span>
            </h3>

            {/* Disease tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {crop.commonDiseases.map((d) => {
                const isSelected = activeDisease?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDisease(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Disease Details */}
            {activeDisease && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{activeDisease.name}</h4>
                    <p className="text-xs italic text-slate-500">{activeDisease.scientificName}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    {activeDisease.severity} Risk
                  </span>
                </div>

                {/* Symptoms */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Symptoms:</div>
                  <ul className="space-y-1">
                    {activeDisease.symptoms.map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Organic Solution</span>
                    </div>
                    <ul className="space-y-1">
                      {activeDisease.organicTreatment.map((ot, idx) => (
                        <li key={idx} className="text-xs text-emerald-950 font-medium">
                          • {ot}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-amber-600" />
                      <span>Chemical Spray</span>
                    </div>
                    <ul className="space-y-1">
                      {activeDisease.chemicalTreatment.map((ct, idx) => (
                        <li key={idx} className="text-xs text-amber-950 font-medium">
                          • {ct}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Growth & Agronomy Tips */}
          <div className="bg-agri-50/80 border border-agri-200 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs font-bold text-agri-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-agri-700" />
              <span>{t('library.growthTips')}</span>
            </h4>
            <ul className="space-y-1.5">
              {crop.growthTips.map((tip, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-agri-950 font-medium flex items-start gap-2">
                  <span className="text-agri-600 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
