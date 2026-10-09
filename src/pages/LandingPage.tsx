import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ArrowRight } from 'lucide-react';
import { CROP_DATABASE } from '../services/cropDatabase';

interface LandingPageProps {
  setActivePage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActivePage }) => {
  const { currentLanguage, t } = useLanguage();

  const previewCrops = CROP_DATABASE.slice(0, 6);

  const personaCards = [
    {
      id: 'grower',
      title: t('landing.personaGrowerTitle'),
      subtitle: t('landing.personaGrowerDesc'),
      page: 'analyze',
      badge: t('landing.startAnalysis'),
      svg: (
        <svg className="w-36 h-48 mx-auto" viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 55 C40 35 120 35 120 55 C140 55 145 65 135 68 C115 70 45 70 25 68 C15 65 20 55 40 55 Z" fill="#b45309" />
          <path d="M50 52 C50 32 110 32 110 52 Z" fill="#92400e" />
          <circle cx="80" cy="80" r="22" fill="#fbcfe8" />
          <path d="M70 78 C70 78 75 84 80 84 C85 84 90 78 90 78" stroke="#9d174d" strokeWidth="2" strokeLinecap="round" />
          <circle cx="72" cy="74" r="3" fill="#831843" />
          <circle cx="88" cy="74" r="3" fill="#831843" />
          <path d="M45 105 L115 105 L125 170 L35 170 Z" fill="#15803d" />
          <path d="M60 105 L60 170 M80 105 L80 170 M100 105 L100 170" stroke="#166534" strokeWidth="3" />
          <path d="M40 125 L120 125 M38 145 L122 145" stroke="#166534" strokeWidth="3" />
          <path d="M45 105 C30 120 50 145 80 140 C110 145 130 120 115 105 C95 135 65 135 45 105 Z" fill="#166534" />
          <path d="M50 170 L75 170 L73 210 L52 210 Z" fill="#1e3a8a" />
          <path d="M85 170 L110 170 L108 210 L87 210 Z" fill="#1e3a8a" />
          <path d="M48 205 L77 205 L75 220 L45 220 Z" fill="#78350f" />
          <path d="M83 205 L112 205 L115 220 L85 220 Z" fill="#78350f" />
        </svg>
      )
    },
    {
      id: 'harvester',
      title: t('landing.personaHarvesterTitle'),
      subtitle: t('landing.personaHarvesterDesc'),
      page: 'library',
      badge: t('nav.library'),
      svg: (
        <svg className="w-40 h-48 mx-auto" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 45 C60 25 120 25 120 45 C130 65 125 90 120 110 C100 115 80 115 60 110 C55 90 50 65 60 45 Z" fill="#fef3c7" />
          <path d="M65 50 C65 35 115 35 115 50 Z" fill="#fde68a" />
          <circle cx="90" cy="70" r="20" fill="#fed7aa" />
          <circle cx="82" cy="67" r="2.5" fill="#7c2d12" />
          <circle cx="98" cy="67" r="2.5" fill="#7c2d12" />
          <path d="M84 76 C84 76 88 80 92 80 C96 80 100 76 100 76" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
          <path d="M55 100 C50 130 55 180 80 190 C105 190 125 170 125 130 C125 100 115 95 55 100 Z" fill="#9a3412" />
          <path d="M65 105 L115 105 L110 165 L60 165 Z" fill="#ffedd5" />
          <path d="M95 125 C95 110 155 110 155 125 L145 160 C145 170 105 170 105 160 Z" fill="#b45309" />
          <path d="M90 120 C100 100 120 90 130 110" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
          <path d="M120 115 C130 95 150 105 145 120" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
          <path d="M110 110 C115 90 135 95 130 115" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'cultivator',
      title: t('landing.personaCultivatorTitle'),
      subtitle: t('landing.personaCultivatorDesc'),
      page: 'dashboard',
      badge: t('nav.dashboard'),
      svg: (
        <svg className="w-36 h-48 mx-auto" viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 50 C50 35 110 35 110 50 C125 52 130 60 120 62 C100 62 60 62 40 62 C30 60 35 52 50 50 Z" fill="#a16207" />
          <circle cx="80" cy="72" r="20" fill="#fde68a" />
          <path d="M65 72 C65 92 95 92 95 72 Z" fill="#78350f" />
          <circle cx="73" cy="68" r="2.5" fill="#451a03" />
          <circle cx="87" cy="68" r="2.5" fill="#451a03" />
          <path d="M30 100 L140 65" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
          <path d="M130 60 L150 55 L145 75 L125 70 Z" fill="#64748b" />
          <path d="M45 95 L115 95 L120 165 L40 165 Z" fill="#854d0e" />
          <path d="M50 165 L75 165 L73 210 L52 210 Z" fill="#713f12" />
          <path d="M85 165 L110 165 L108 210 L87 210 Z" fill="#713f12" />
          <path d="M48 205 L77 205 L75 220 L45 220 Z" fill="#451a03" />
          <path d="M83 205 L112 205 L115 220 L85 220 Z" fill="#451a03" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3f8f0] text-[#1a3a24] flex flex-col justify-between relative overflow-hidden">
      {/* Top Main Hero Section */}
      <div className="pt-10 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-agri-600 text-agri-700 text-xs sm:text-sm font-bold shadow-sm">
          <Sprout className="w-4 h-4 text-agri-600" />
          <span className="uppercase tracking-wider">{t('landing.personaBadge')}</span>
        </div>

        {/* Serif Stylish Welcome Header */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#1a3a24] tracking-tight leading-tight">
            {t('landing.personaTitleWelcome')}{' '}
            <span className="text-agri-600">{t('landing.personaTitleHighlight')}</span>
            <br />
            <span className="text-agri-600">{t('landing.personaTitleAssistant')}</span>
          </h1>
          <p className="text-base sm:text-xl text-[#3a5d44] font-medium max-w-2xl mx-auto">
            {t('landing.personaSubtitle')}
          </p>
        </div>
      </div>

      {/* Lower Half: Rolling Hills Field & 3 Persona Cards */}
      <div className="relative pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d8ebd2]/60 to-[#a3d498]/90 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 z-10">
          {personaCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActivePage(card.page)}
              className="group bg-white/85 hover:bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center flex flex-col justify-between items-center min-h-[360px]"
            >
              <div className="py-2 group-hover:scale-105 transition-transform duration-300">
                {card.svg}
              </div>

              <div className="space-y-1 mt-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1a3a24]">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4a6e53] font-medium">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100/80 w-full flex items-center justify-center gap-2 text-xs font-bold text-[#226838] group-hover:text-emerald-800">
                <span>{card.badge}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Indian Crops Quick Bar */}
        <div className="relative max-w-6xl mx-auto mt-12 bg-white/90 backdrop-blur-md border border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
          <div className="text-left">
            <span className="text-xs font-bold text-[#226838] uppercase tracking-wider">
              {t('dashboard.cropLibraryQuick')}
            </span>
            <h4 className="text-lg font-bold text-[#1a3a24]">
              {t('dashboard.viewAllCrops')}
            </h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            {previewCrops.map((c) => (
              <button
                key={c.id}
                onClick={() => setActivePage('library')}
                className="px-3 py-1.5 bg-[#f0f7ed] hover:bg-emerald-100 text-[#1a3a24] text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
              >
                {c.localNames[currentLanguage] || c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
