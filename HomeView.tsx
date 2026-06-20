/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Mic,
  Image as ImageIcon,
  ShieldAlert,
  BookOpen,
  TrendingUp,
  GitCompare,
  History,
  X,
  Volume2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { HistoryItem } from '../types';

interface HomeViewProps {
  onSearch: (query: string, mode: 'search' | 'factcheck' | 'compare') => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

export default function HomeView({ onSearch, history, onSelectHistory }: HomeViewProps) {
  const [query, setQuery] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [voiceStep, setVoiceStep] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [selectedImageFile, setSelectedImageFile] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent, customMode?: 'search' | 'factcheck' | 'compare') => {
    e.preventDefault();
    if (query.trim() !== '') {
      onSearch(query, customMode || 'search');
    }
  };

  const trendingTopics = [
    {
      text: 'Did Messi score 10 goals in the 2026 World Cup?',
      badge: 'Factual Audit',
      type: 'factcheck',
    },
    {
      text: 'Water boils at 90°C',
      badge: 'Thermodynamics',
      type: 'factcheck',
    },
    {
      text: 'Scientific consensus on climate change',
      badge: 'Earth Science',
      type: 'compare',
    },
    {
      text: 'AI model capability convergence rates in 2026',
      badge: 'Tech Forecast',
      type: 'search',
    },
  ];

  // Simulated Speech-to-Text Loop
  const triggerSimulatedVoice = () => {
    setIsVoiceOpen(true);
    setVoiceStep('listening');

    // After 2.5s, simulate processing
    setTimeout(() => {
      setVoiceStep('processing');
      // After another 1.5s, update query and search
      setTimeout(() => {
        const spokenQuery = 'Did Messi score 10 goals in the 2026 World Cup?';
        setQuery(spokenQuery);
        setIsVoiceOpen(false);
        onSearch(spokenQuery, 'factcheck');
        setVoiceStep('idle');
      }, 1500);
    }, 2500);
  };

  // Simulated Optical Image Scanner
  const triggerImageScanning = (preset: string, fakeImgUrl: string) => {
    setSelectedImageFile(fakeImgUrl);
    setTimeout(() => {
      setQuery(preset);
      setIsImageOpen(false);
      setSelectedImageFile(null);
      onSearch(preset, 'factcheck');
    }, 1800);
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 flex flex-col justify-between min-h-[700px]">      {/* Search Module Hero Branding */}
      <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
        {/* Animated Icon Ring */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse-slow" />
          <div className="relative h-16 w-16 rounded-full bg-linear-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center shadow-lg border border-white/20">
            <Search className="h-8 w-8 text-white animate-bounce-short" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
          </span>
        </div>

        {/* Beautiful Google-colored original brand style */}
        <h1 className="font-display font-black text-4.5xl tracking-tighter mb-1.5 select-none flex items-center justify-center gap-[1px]">
          <span className="text-[#4285F4]">A</span>
          <span className="text-[#EA4335]">d</span>
          <span className="text-[#FBBC05]">i</span>
          <span className="text-[#34A853]">a</span>
          <span className="text-[#4285F4] ml-1">S</span>
          <span className="text-[#EA4335]">e</span>
          <span className="text-[#FBBC05]">a</span>
          <span className="text-[#4285F4]">r</span>
          <span className="text-[#34A853]">c</span>
          <span className="text-[#EA4335]">h</span>
          <span className="text-zinc-400 dark:text-zinc-600 text-2xl font-light font-sans tracking-wide ml-2">&#946;</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
          The autonomous factual synthesis search engine. Search once, crawl everywhere, fact-check instantly.
        </p>

        {/* Input Bar */}
        <form onSubmit={(e) => handleSearchSubmit(e)} className="w-full relative group">
          <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/2 rounded-full filter blur-md group-focus-within:blur-lg transition-all duration-300" />
          <div className="clay-card relative flex items-center rounded-full px-5 py-3.5 hover:scale-[1.01] focus-within:scale-[1.015] duration-300 transition-all">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query any statement, stat, or news claim..."
              className="flex-1 min-w-0 bg-transparent border-0 outline-hidden focus:ring-0 text-sm pl-3 pr-2 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center gap-1 shrink-0 border-l border-slate-100 dark:border-zinc-800 pl-2 ml-1">
              <button
                type="button"
                onClick={triggerSimulatedVoice}
                className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Voice Claim Search"
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsImageOpen(true)}
                className="p-1.5 text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Visual Evidence Scanner"
              >
                <ImageIcon className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
          
          {/* Dual adjacent Chrome/Google searching buttons with claymorphic elevation */}
          <div className="flex items-center justify-center gap-3 mt-4 w-full">
            <button
              type="submit"
              className="clay-button flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold py-3 px-5 rounded-full cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 shadow-sm"
            >
              <span>Execute Aggregation</span>
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
            </button>
            
            <button
              type="button"
              onClick={() => {
                const randomClaim = trendingTopics[Math.floor(Math.random() * trendingTopics.length)].text;
                setQuery(randomClaim);
                onSearch(randomClaim, 'factcheck');
              }}
              className="clay-button flex-1 bg-slate-50 dark:bg-zinc-850 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-750 text-xs font-semibold py-3 px-5 rounded-full cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 shadow-sm"
            >
              <span>I'm Feeling Factual</span>
              <Search className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
            </button>
          </div>
        </form>

        {/* Quick Launchpad Buttons */}
        <div className="w-full mt-8">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase mb-3 text-left">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onSearch('Is water boiling at 90°C true?', 'factcheck')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-300 transition-all group shrink-0 cursor-pointer text-center"
            >
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">Fact Check</span>
            </button>

            <button
              onClick={() => onSearch('Climate emissions consensus meta-analysis', 'compare')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-300 transition-all group shrink-0 cursor-pointer text-center"
            >
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">Deep Research</span>
            </button>

            <button
              onClick={() => onSearch('AI capability convergence metrics', 'compare')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-300 transition-all group shrink-0 cursor-pointer text-center"
            >
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <GitCompare className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">Compare</span>
            </button>

            <button
              onClick={() => {
                if (history.length > 0) {
                  onSelectHistory(history[0]);
                } else {
                  onSearch('Did Messi score 10 goals in 2026?', 'factcheck');
                }
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-300 transition-all group shrink-0 cursor-pointer text-center"
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <History className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trending & Recent Section */}
      <div className="mt-6 flex flex-col gap-6 pt-6 border-t border-slate-100 dark:border-zinc-800/60 w-full">
        {/* Trending Searches Grid */}
        <div>
          <h2 className="flex items-center gap-1.5 font-display font-bold text-sm text-slate-900 dark:text-white mb-2.5">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span>Trending Solves</span>
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {trendingTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => onSearch(topic.text, topic.type as any)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[11px] font-medium py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer text-left shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <span>{topic.badge}</span>
                <span className="text-slate-400 dark:text-zinc-500">&middot;</span>
                <span className="truncate max-w-[200px]">{topic.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Search Activity */}
        {history.length > 0 && (
          <div>
            <h2 className="flex items-center gap-1.5 font-display font-bold text-sm text-slate-900 dark:text-white mb-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Recent Activity</span>
            </h2>
            <div className="grid grid-cols-1 select-none gap-2">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHistory(item)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50 dark:hover:bg-zinc-900/60 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium truncate">
                      {item.query}
                    </span>
                  </div>
                  {item.verdict && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider font-semibold border ${
                        item.verdict === 'true'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900'
                          : item.verdict === 'false'
                          ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900'
                          : item.verdict === 'partially_true'
                          ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900'
                          : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                      }`}
                    >
                      {item.verdict.replace('_', ' ')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mic Animation Overlay */}
      {isVoiceOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col justify-end p-8 z-50 animate-fade-in rounded-[38px] overflow-hidden">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 flex flex-col items-center gap-6 shadow-2xl border border-slate-100 dark:border-zinc-800">
            <div className="flex w-full justify-between items-center text-slate-500">
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                Adia Speech engine
              </span>
              <button
                onClick={() => setIsVoiceOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-6 text-center">
              {voiceStep === 'listening' ? (
                <>
                  {/* Listening Waves */}
                  <div className="flex items-end justify-center gap-1.5 h-16 mb-4">
                    <span className="w-1.5 bg-indigo-500 rounded-full h-8 animate-pulse" />
                    <span className="w-1.5 bg-blue-500 rounded-full h-14 animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1.5 bg-teal-500 rounded-full h-10 animate-pulse [animation-delay:0.4s]" />
                    <span className="w-1.5 bg-blue-500 rounded-full h-16 animate-pulse [animation-delay:0.1s]" />
                    <span className="w-1.5 bg-indigo-500 rounded-full h-6 animate-pulse [animation-delay:0.3s]" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white">Listening to voice statement...</h3>
                  <p className="text-xs text-slate-400 mt-1">"Did Messi score 10 goals in..."</p>
                </>
              ) : (
                <>
                  {/* Processing Animation */}
                  <div className="h-16 w-16 mb-4 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                  <h3 className="text-base font-bold dark:text-white">Aligning factual context...</h3>
                  <p className="text-xs text-slate-400 mt-1">Parsing acoustics to query blocks</p>
                </>
              )}
            </div>

            <button
              onClick={() => setIsVoiceOpen(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Scanner Overlay */}
      {isImageOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col justify-end p-8 z-50 animate-fade-in rounded-[38px] overflow-hidden">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 flex flex-col items-center gap-6 shadow-2xl border border-slate-100 dark:border-zinc-800 max-h-[85%] overflow-y-auto">
            <div className="flex w-full justify-between items-center text-slate-500">
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                Visual Evidence Scanner
              </span>
              <button
                onClick={() => setIsImageOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedImageFile ? (
              <div className="flex flex-col items-center justify-center py-6 text-center w-full">
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-indigo-500 mb-4 shadow-md bg-zinc-950">
                  <img
                    src={selectedImageFile}
                    alt="Scanning source"
                    className="w-full h-full object-cover opacity-75"
                  />
                  {/* Scanning active neon line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 animate-bounce" />
                </div>
                <h3 className="text-base font-bold dark:text-white">Running Optical Character Check...</h3>
                <p className="text-xs text-slate-400 mt-1">Structuring claims matched in raw imagery</p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select a document screenshot or visual ledger claim to run OCR verification.
                </p>

                <div className="space-y-2">
                  <div
                    onClick={() =>
                      triggerSimulatedVoice() // Trigger simulation
                    }
                    className="p-3 border border-dashed border-slate-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-zinc-800/40 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer group transition-all"
                  >
                    <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Upload from phone filesystem
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Supports JPEG, PNG, or RAW</span>
                  </div>

                  <p className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase mt-4">
                    Sample Evidence Cases
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        triggerImageScanning(
                          'Did Messi score 10 goals in the 2026 World Cup?',
                          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200'
                        )
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-800/60 flex items-center gap-3 cursor-pointer text-left transition-colors"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=80"
                        alt="Messi"
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border dark:border-zinc-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                          Messi World Cup Claims Snapshot
                        </p>
                        <p className="text-[10px] text-slate-400 max-w-xs truncate">
                          Check image containing text stats regarding World Cup 2026.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        triggerImageScanning(
                          'Water boiling point altitude table',
                          'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=200'
                        )
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-800/60 flex items-center gap-3 cursor-pointer text-left transition-colors"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=80"
                        alt="Water boil"
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border dark:border-zinc-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                          Physical Elevation Table OCR
                        </p>
                        <p className="text-[10px] text-slate-400 max-w-xs truncate">
                          Thermocouple measurement logs at high altitudes.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsImageOpen(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
