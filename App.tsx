/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  GitCompare,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Moon,
  Sun,
  Loader2,
  Trash2,
  Home,
  User,
  Compass
} from 'lucide-react';
import AndroidFrame from './components/AndroidFrame';
import HomeView from './components/HomeView';
import ResultsView from './components/ResultsView';
import FactCheckerTab from './components/FactCheckerTab';
import CompareSourcesTab from './components/CompareSourcesTab';
import HistoryTab from './components/HistoryTab';
import ProfileTab from './components/ProfileTab';
import SearchFiltersDrawer from './components/SearchFiltersDrawer';
import { SearchResult, SearchFilters, HistoryItem, DeepResearchReport } from './types';

export default function App() {
  // Navigation & Frame Modes
  const [isDeviceMode, setIsDeviceMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'research' | 'factcheck' | 'history' | 'profile'>('home');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adiasearch_theme_preference');
      return saved !== null ? saved === 'dark' : true;
    }
    return true;
  });

  // Sync Dark Mode class on Document Root & Persist Preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adiasearch_theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adiasearch_theme_preference', 'light');
    }
  }, [darkMode]);

  // Search Parameter States
  const [filters, setFilters] = useState<SearchFilters>({
    timeRange: 'all',
    sourceType: 'all',
    region: 'global',
    language: 'all',
    minTrustScore: 60,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Search Results States
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Deep Research States
  const [deepResearchLoading, setDeepResearchLoading] = useState(false);
  const [deepResearchReport, setDeepResearchReport] = useState<DeepResearchReport | undefined>(undefined);

  // Local storage history states
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Sound Haptic Feedback simulation
  const simulateHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Safe to ignore in sandbox iFrame context
      }
    }
  };

  // Sync History on Mount
  useEffect(() => {
    const cachedHistory = localStorage.getItem('adiasearch_history_cache');
    if (cachedHistory) {
      try {
        setHistory(JSON.parse(cachedHistory));
      } catch (e) {
        console.error('History sync failing, cleaning cache.', e);
      }
    } else {
      // Seed initial trending searches as history reference for beautiful preview
      const initialSeed: HistoryItem[] = [
        {
          id: 'seed-1',
          query: 'Did Messi score 10 goals in the 2026 World Cup?',
          timestamp: '2 hours ago',
          pinned: true,
          favorite: true,
          verdict: 'false',
          confidence: 98,
        },
        {
          id: 'seed-2',
          query: 'Does water boil at 90 degrees celsius?',
          timestamp: 'Yesterday',
          pinned: false,
          favorite: true,
          verdict: 'partially_true',
          confidence: 94,
        },
      ];
      setHistory(initialSeed);
      localStorage.setItem('adiasearch_history_cache', JSON.stringify(initialSeed));
    }
  }, []);

  const saveHistory = (updated: HistoryItem[]) => {
    setHistory(updated);
    localStorage.setItem('adiasearch_history_cache', JSON.stringify(updated));
  };

  // Main Google GenAI Factual Search Trigger
  const handleFactualSearch = async (query: string, mode: 'search' | 'factcheck' | 'compare' = 'search') => {
    simulateHaptic();
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);
    setDeepResearchReport(undefined);

    // Direct active navigation tab selection to correspond with visual expectations
    if (mode === 'factcheck') setActiveTab('factcheck');
    else if (mode === 'compare') setActiveTab('research');
    else setActiveTab('home');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters,
          mode,
          model: 'gemini',
        }),
      });

      if (!response.ok) {
        throw new Error('Index server error. Check connection parameters.');
      }

      const data: SearchResult = await response.json();
      setSearchResults(data);

      // Append to local history list
      const duplicateIndex = history.findIndex((h) => h.query.toLowerCase() === query.toLowerCase());
      let updatedHistory = [...history];

      if (duplicateIndex !== -1) {
        // Move to top of log lists
        const duplicateItem = updatedHistory[duplicateIndex];
        updatedHistory.splice(duplicateIndex, 1);
        updatedHistory.unshift({
          ...duplicateItem,
          timestamp: 'Just now',
          verdict: data.factCheck.verdict,
          confidence: data.factCheck.confidence,
        });
      } else {
        const newItem: HistoryItem = {
          id: `hist-${Date.now()}`,
          query,
          timestamp: 'Just now',
          pinned: false,
          favorite: false,
          verdict: data.factCheck.verdict,
          confidence: data.factCheck.confidence,
        };
        updatedHistory.unshift(newItem);
      }

      saveHistory(updatedHistory);
    } catch (err: any) {
      console.error(err);
      setSearchError('Search failed to compile. Standard factual indices down. Retry.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Compile Autonomous Deep Research Report
  const handleCompileDeepResearch = async () => {
    if (!searchResults) return;
    simulateHaptic();
    setDeepResearchLoading(true);

    try {
      const response = await fetch('/api/deep-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchResults.query,
          searchResult: searchResults,
        }),
      });

      if (!response.ok) throw new Error('Failed to align deep research network.');

      const data: DeepResearchReport = await response.json();
      setDeepResearchReport(data);
    } catch (err) {
      console.error(err);
      alert('Failed to formulate autonomous dossier. Please retry.');
    } finally {
      setDeepResearchLoading(false);
    }
  };

  // Bookmark specific search
  const handleToggleBookmark = (query: string) => {
    simulateHaptic();
    const updated = history.map((item) => {
      if (item.query.toLowerCase() === query.toLowerCase()) {
        return { ...item, pinned: !item.pinned };
      }
      return item;
    });
    saveHistory(updated);
  };

  const isQueryBookmarked = (query: string) => {
    const item = history.find((h) => h.query.toLowerCase() === query.toLowerCase());
    return item ? item.pinned : false;
  };

  // History operations
  const handleToggleHistoryPin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    simulateHaptic();
    const updated = history.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item));
    saveHistory(updated);
  };

  const handleToggleHistoryFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    simulateHaptic();
    const updated = history.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item));
    saveHistory(updated);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    simulateHaptic();
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    handleFactualSearch(item.query, 'search');
  };

  const handleClearHistory = () => {
    simulateHaptic();
    if (confirm('Permanently delete local audit history logs?')) {
      saveHistory([]);
    }
  };

  // Render content depending on selected tab configuration or active search result
  const renderViewportContent = () => {
    if (searchLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center select-none animate-pulse-slow">
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg border border-white/10">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
          <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
            Aggregating Information Consensus
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs leading-normal">
            AdiaSearch crawler indexers are crosschecking Wikipedia, news indices, and peer journals for matching assertions...
          </p>
        </div>
      );
    }

    if (searchError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 mb-4">
            <Trash2 className="h-5 w-5" />
          </div>
          <h4 className="font-bold dark:text-white">Factual aggregation failed</h4>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1 max-w-xs">{searchError}</p>
          <button
            onClick={() => setSearchError(null)}
            className="mt-4 px-4 py-2 bg-indigo-650 hover:bg-slate-200 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Retry Search
          </button>
        </div>
      );
    }

    if (searchResults) {
      return (
        <ResultsView
          result={searchResults}
          onBack={() => {
            setSearchResults(null);
            setDeepResearchReport(undefined);
          }}
          onBookmark={handleToggleBookmark}
          isBookmarked={isQueryBookmarked(searchResults.query)}
          onGenerateDeepResearch={handleCompileDeepResearch}
          deepResearchLoading={deepResearchLoading}
          deepResearchReport={deepResearchReport}
        />
      );
    }

    switch (activeTab) {
      case 'factcheck':
        return (
          <FactCheckerTab
            onCheckClaim={(claim) => handleFactualSearch(claim, 'factcheck')}
            isLoading={searchLoading}
            activeResult={searchResults || undefined}
          />
        );
      case 'research':
        return <CompareSourcesTab />;
      case 'history':
        return (
          <HistoryTab
            history={history}
            onTogglePin={handleToggleHistoryPin}
            onToggleFavorite={handleToggleHistoryFavorite}
            onDelete={handleDeleteHistoryItem}
            onSelect={handleSelectHistoryItem}
            onClearAll={handleClearHistory}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            userEmail="meenudeepak2006@gmail.com"
            historyCount={history.length}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      case 'home':
      default:
        return (
          <HomeView
            onSearch={handleFactualSearch}
            history={history}
            onSelectHistory={handleSelectHistoryItem}
          />
        );
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <AndroidFrame
        isDeviceMode={isDeviceMode}
        setIsDeviceMode={setIsDeviceMode}
        onBackPress={() => {
          simulateHaptic();
          if (searchResults) {
            setSearchResults(null);
            setDeepResearchReport(undefined);
          } else if (activeTab !== 'home') {
            setActiveTab('home');
          }
        }}
      >
        {/* Adia Mobile App Wrapper Area */}
        <div className="flex-1 flex flex-col justify-between min-h-60 h-full relative text-slate-800 dark:text-zinc-100 dark:bg-zinc-950 transition-colors">
          {/* Simulated App Header */}
          <div className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 border-b border-slate-100 dark:border-zinc-800/80 shrink-0 z-30 select-none">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                simulateHaptic();
                setActiveTab('home');
                setSearchResults(null);
                setDeepResearchReport(undefined);
              }}
            >
              <div className="h-6.5 w-6.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-display font-medium text-xs shadow-xs">
                A
              </div>
              <h1 className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                AdiaSearch<span className="text-teal-400 font-bold">.</span>
              </h1>
            </div>

            {/* Utility settings icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  simulateHaptic();
                  setIsFiltersOpen(true);
                }}
                className="p-1.5 text-slate-450 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {(filters.timeRange !== 'all' || filters.sourceType !== 'all' || filters.minTrustScore > 60) && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-teal-450" />
                )}
              </button>
              <button
                onClick={() => {
                  simulateHaptic();
                  setDarkMode(!darkMode);
                }}
                className="p-1.5 text-slate-450 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Sub-viewport render content */}
          <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
            {renderViewportContent()}
          </div>

          {/* Core Navigation Dock (Mobile Bottom Navigation Dock style) */}
          <nav className="border-t border-slate-150 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-2.5 flex items-center justify-between sticky bottom-0 shrink-0 z-35 select-none text-[10px]">
            {[
              { id: 'home', label: 'Home', icon: <Home className="h-4.5 w-4.5" /> },
              { id: 'research', label: 'Research', icon: <Compass className="h-4.5 w-4.5" /> },
              { id: 'factcheck', label: 'Fact Check', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
              { id: 'history', label: 'History', icon: <Clock className="h-4.5 w-4.5" /> },
              { id: 'profile', label: 'Profile', icon: <User className="h-4.5 w-4.5" /> },
            ].map((tab) => {
              const active = activeTab === tab.id && !searchResults;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    simulateHaptic();
                    setActiveTab(tab.id as any);
                    setSearchResults(null);
                    setDeepResearchReport(undefined);
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl cursor-pointer transition-all ${
                    active
                      ? 'text-[#34A853] dark:text-[#34d399] font-bold bg-[#deffe6]/40 dark:bg-emerald-950/20'
                      : 'text-slate-400 dark:text-zinc-500 hover:text-slate-650 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[9px] font-semibold tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Crawler Search Filters Settings overlay */}
          <SearchFiltersDrawer
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            onChangeFilters={(updatedFilters) => {
              setFilters(updatedFilters);
            }}
          />
        </div>
      </AndroidFrame>
    </div>
  );
}
