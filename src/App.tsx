import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoBanner } from './components/common/DemoBanner';
import { AssistantDrawer } from './components/chat/AssistantDrawer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { AnalysisResult } from './types';
import { Loader2 } from 'lucide-react';
import { finishNativeStartup, registerBackButtonHandler } from './lib/nativeBootstrap';

// Lazy load pages for fast initial bundle loading
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage').then(m => ({ default: m.AnalyzePage })));
const CropLibraryPage = lazy(() => import('./pages/CropLibraryPage').then(m => ({ default: m.CropLibraryPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-agri-600">
    <Loader2 className="w-8 h-8 animate-spin" />
    <span className="text-xs font-bold text-slate-500">Loading AI Crop Assistant...</span>
  </div>
);

// Both the landing page and the dashboard count as "home" — Android back
// should exit the app from either, not just the very first page visited.
const HOME_PAGES = ['landing', 'dashboard'];

const MainLayout: React.FC = () => {
  const [activePage, setActivePageState] = useState<string>('landing');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const { setAnalysisResult } = useAnalysis();

  // Simple in-app navigation history so the Android hardware/gesture back
  // button steps back through AI Crop Assistant pages instead of just closing the
  // app, while still exiting normally from the home/dashboard screens.
  const historyStackRef = useRef<string[]>(['landing']);

  const navigate = useCallback((page: string) => {
    setActivePageState(page);
    const stack = historyStackRef.current;
    if (stack[stack.length - 1] !== page) {
      stack.push(page);
    }
  }, []);

  const handleBack = useCallback((): boolean => {
    const stack = historyStackRef.current;
    const current = stack[stack.length - 1];
    if (HOME_PAGES.includes(current) || stack.length <= 1) {
      return false; // on a home screen — let Android exit normally
    }
    stack.pop();
    setActivePageState(stack[stack.length - 1]);
    return true; // handled in-app — Android should not exit
  }, []);

  useEffect(() => {
    finishNativeStartup();
    let cleanup: (() => void) | undefined;
    registerBackButtonHandler(handleBack).then((fn) => {
      cleanup = fn;
    });
    return () => cleanup?.();
  }, [handleBack]);

  const handleViewAnalysisResult = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={navigate} />;
      case 'dashboard':
        return (
          <DashboardPage
            setActivePage={navigate}
            onViewAnalysisResult={handleViewAnalysisResult}
          />
        );
      case 'analyze':
        return <AnalyzePage />;
      case 'library':
        return <CropLibraryPage setActivePage={navigate} initialSearchQuery={librarySearchQuery} />;
      case 'history':
        return (
          <HistoryPage
            setActivePage={navigate}
            onViewAnalysisResult={handleViewAnalysisResult}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage setActivePage={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-agri-200 selection:text-agri-950">
      {/* Offline connectivity banner */}
      <OfflineBanner />

      {/* Top Demo/Cloud status banner */}
      <DemoBanner onNavigateToSettings={() => navigate('settings')} />

      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={navigate} onSearch={setLibrarySearchQuery} />

      {/* Main Content Area with Suspense Lazy Loading */}
      {/* Reserves space for the fixed mobile bottom nav (plus its safe-area
          inset on devices with gesture nav bars) so content never hides behind it */}
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <Suspense fallback={<PageLoader />}>
          {renderCurrentPage()}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer setActivePage={navigate} />

      {/* Slide-out AI Assistant drawer */}
      <AssistantDrawer />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AnalysisProvider>
          <MainLayout />
        </AnalysisProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
