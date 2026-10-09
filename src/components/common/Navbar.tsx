import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Sprout, LayoutDashboard, Stethoscope, BookOpen, History, Settings, Menu, X, MessageSquareQuote, Search, Download } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, onSearch }) => {
  const { t } = useLanguage();
  const { setIsAssistantOpen } = useAnalysis();
  const { isInstallable, installApp } = usePWAInstall();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const navLinks = [
    { id: 'landing', label: t('nav.home'), icon: Sprout },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'analyze', label: t('nav.analyze'), icon: Stethoscope, highlight: true },
    { id: 'library', label: t('nav.library'), icon: BookOpen },
    { id: 'history', label: t('nav.history'), icon: History },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
    setActivePage('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="safe-top sticky top-0 z-40 bg-gradient-to-r from-agri-600 to-agri-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16 sm:h-20">
            {/* Brand Logo */}
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-3 group focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center text-agri-600 shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>AI Crop</span>
                  <span className="text-agri-100">Assistant</span>
                </span>
                <span className="block text-[10px] sm:text-xs font-semibold text-blue-100 -mt-1 tracking-wide">
                  {t('brand.taglineShort')}
                </span>
              </div>
            </button>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('library.searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-white text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500 shadow-sm"
                />
              </div>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-agri-700 shadow-sm'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* PWA Install Button */}
              {isInstallable && (
                <button
                  onClick={installApp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  title="Install AI Crop Assistant"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Install</span>
                </button>
              )}

              {/* Language Switcher Dropdown */}
              <LanguageSelector />

              {/* Floating AI Assistant Trigger */}
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-agri-50 hover:bg-agri-100 text-agri-900 text-xs font-bold transition-colors shadow-sm"
                title={t('chat.floatingTitle')}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>{t('chat.floatingTitle')}</span>
              </button>

              {/* Mobile Hamburger Menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (below header row) */}
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('library.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-white text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500 shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-agri-700 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-left transition-colors ${
                    isActive
                      ? 'bg-white text-agri-700'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/40' : 'bg-white/10'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* PWA Install in mobile menu */}
            {isInstallable && (
              <button
                onClick={() => {
                  installApp();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-left bg-emerald-500/20 hover:bg-emerald-500/30 text-white transition-colors border border-emerald-400/30"
              >
                <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-200">
                  <Download className="w-5 h-5" />
                </div>
                <span>Install AI Crop Assistant</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for easy one-hand smartphone thumb usage */}
      <nav className="safe-bottom lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-agri-700 border-t border-white/10 py-2 px-3 flex items-center justify-around shadow-2xl">
        {[
          { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
          { id: 'analyze', label: t('nav.analyze'), icon: Stethoscope, isCenter: true },
          { id: 'library', label: t('nav.library'), icon: BookOpen },
          { id: 'history', label: t('nav.history'), icon: History },
          { id: 'settings', label: t('nav.settings'), icon: Settings },
        ].map((btn) => {
          const Icon = btn.icon;
          const isActive = activePage === btn.id;

          if (btn.isCenter) {
            return (
              <button
                key={btn.id}
                onClick={() => handleNavClick(btn.id)}
                className="flex flex-col items-center -mt-6 group focus:outline-none"
              >
                <div className="w-13 h-13 p-3 rounded-full bg-white text-agri-700 shadow-lg group-active:scale-95 transition-transform flex items-center justify-center ring-4 ring-agri-700">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1">
                  {btn.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={btn.id}
              onClick={() => handleNavClick(btn.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
                isActive ? 'text-white font-bold' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-semibold">{btn.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

