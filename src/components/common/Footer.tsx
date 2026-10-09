import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-500 text-white flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AI Crop</span>
                <span className="text-agri-400">Assistant</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {t('brand.description')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-950/80 border border-agri-500/30 text-agri-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-agri-400" />
                <span>13 Indian Languages Supported</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Voice Enabled</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="hover:text-agri-400 transition-colors"
                >
                  {t('nav.dashboard')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('analyze')}
                  className="hover:text-agri-400 transition-colors text-agri-400 font-semibold"
                >
                  {t('nav.analyze')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('library')}
                  className="hover:text-agri-400 transition-colors"
                >
                  {t('nav.library')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('history')}
                  className="hover:text-agri-400 transition-colors"
                >
                  {t('nav.history')}
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Crops */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Supported Crops
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              {['Tomato', 'Rice', 'Cotton', 'Chilli', 'Wheat', 'Maize', 'Groundnut', 'Potato', 'Onion', 'Mango', 'Banana', 'Coconut', 'Turmeric', 'Soybean'].map((c) => (
                <span key={c} className="bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} AI Crop Assistant. Dedicated to the farmers of India.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian Agriculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
