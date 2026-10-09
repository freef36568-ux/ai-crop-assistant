import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAnalysis } from '../context/AnalysisContext';
import { searchCrops } from '../services/cropDatabase';
import { CropCard } from '../components/library/CropCard';
import { CropDetailModal } from '../components/library/CropDetailModal';
import { BookOpen, Search, Filter } from 'lucide-react';
import { CropInfo } from '../types';

interface CropLibraryPageProps {
  setActivePage: (page: string) => void;
  initialSearchQuery?: string;
}

export const CropLibraryPage: React.FC<CropLibraryPageProps> = ({ setActivePage, initialSearchQuery }) => {
  const { currentLanguage, t } = useLanguage();
  const { setCropName, selectedCropDetail, setSelectedCropDetail } = useAnalysis();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const categories = [
    { id: 'All', label: t('library.allCategories') },
    { id: 'Cereals', label: t('library.cereals') },
    { id: 'Cash Crops', label: t('library.cashCrops') },
    { id: 'Vegetables', label: t('library.vegetables') },
    { id: 'Fruits', label: t('library.fruits') },
    { id: 'Spices', label: t('library.spices') },
  ];

  const filteredCrops = searchCrops(searchQuery).filter((crop) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Spices') {
      return crop.category === 'Spices' || crop.category === 'Pulses';
    }
    return crop.category === selectedCategory;
  });

  const handleStartAnalysisWithCrop = (crop: CropInfo) => {
    const locName = crop.localNames[currentLanguage] || crop.name;
    setCropName(locName);
    setActivePage('analyze');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-agri-100 border border-agri-300 text-agri-900 text-xs font-bold shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-agri-600" />
          <span>15 Indian Crops • 40+ Diseases</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('library.title')}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base font-medium">
          {t('library.subtitle')}
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('library.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-agri-600 focus:bg-white focus:ring-4 focus:ring-agri-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-agri-600 text-white shadow-md shadow-agri-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCrops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="text-4xl">🌾</div>
          <h3 className="text-lg font-bold text-slate-800">No matching crops found</h3>
          <p className="text-sm text-slate-500">
            Try searching for another crop name or clear your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-agri-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onSelect={setSelectedCropDetail}
              onAnalyze={handleStartAnalysisWithCrop}
            />
          ))}
        </div>
      )}

      {selectedCropDetail && (
        <CropDetailModal
          crop={selectedCropDetail}
          onClose={() => setSelectedCropDetail(null)}
          onAnalyze={handleStartAnalysisWithCrop}
        />
      )}
    </div>
  );
};
