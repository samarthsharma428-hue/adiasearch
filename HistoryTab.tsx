/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Pin, Heart, Trash2, ShieldAlert, Sparkles, PinOff, HelpCircle } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryTabProps {
  history: HistoryItem[];
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onSelect: (item: HistoryItem) => void;
  onClearAll: () => void;
}

export default function HistoryTab({
  history,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onSelect,
  onClearAll,
}: HistoryTabProps) {
  // Split history into pinned vs other
  const pinnedItems = history.filter((h) => h.pinned);
  const otherItems = history.filter((h) => !h.pinned);

  const getVerdictLabel = (verdict?: string) => {
    switch (verdict) {
      case 'true':
        return 'True';
      case 'false':
        return 'False';
      case 'partially_true':
        return 'Partially True';
      case 'unverified':
      default:
        return 'Unverified';
    }
  };

  const getVerdictBadgeStyle = (verdict?: string) => {
    switch (verdict) {
      case 'true':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
      case 'false':
        return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900';
      case 'partially_true':
        return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
      case 'unverified':
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-6 flex flex-col gap-6 select-none animate-fade-in text-xs">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 pb-3">
        <div>
          <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
            <Clock className="h-7 w-7 text-indigo-500" />
            <span>Search Vault</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Browse and pin historic factual queries or claim evaluations registered on this device.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg cursor-pointer transition-transform active:scale-95 text-[10px]"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400 dark:text-zinc-500">
          <Clock className="h-12 w-12 text-slate-300 dark:text-zinc-700 mb-3" />
          <h4 className="font-bold">Your vault is empty</h4>
          <p className="max-w-xs mt-1 text-[11px] leading-relaxed">
            Resolved claims, search timelines, and comparative indexes will populate here for local offline caching.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pinned Section */}
          {pinnedItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-indigo-500 font-bold uppercase flex items-center gap-1.5">
                <Pin className="h-3.5 w-3.5 fill-current" />
                <span>Pinned Audits</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {pinnedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="p-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850/60 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-center justify-between cursor-pointer transition-colors relative"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-12">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate pr-2">
                          {item.query}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{item.timestamp}</span>
                          {item.verdict && (
                            <span className={`px-1.5 py-0.5 border text-[8px] font-mono uppercase font-bold rounded-sm ${getVerdictBadgeStyle(item.verdict)}`}>
                              {getVerdictLabel(item.verdict)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 select-none">
                      <button
                        onClick={(e) => onTogglePin(item.id, e)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg cursor-pointer max-xs:p-1"
                        title="Unpin"
                      >
                        <Pin className="h-4 w-4 fill-current" />
                      </button>
                      <button
                        onClick={(e) => onToggleFavorite(item.id, e)}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          item.favorite
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                            : 'text-slate-400 hover:text-rose-500'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`h-4 w-4 ${item.favorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => onDelete(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Items */}
          {otherItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
                Historical Log
              </span>
              <div className="grid grid-cols-1 gap-2">
                {otherItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="p-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850/60 border border-slate-150 dark:border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-12">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate pr-2 font-display">
                          {item.query}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{item.timestamp}</span>
                          {item.verdict && (
                            <span className={`px-1.5 py-0.5 border text-[8px] font-mono uppercase font-semibold rounded-sm ${getVerdictBadgeStyle(item.verdict)}`}>
                              {getVerdictLabel(item.verdict)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      <button
                        onClick={(e) => onTogglePin(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg cursor-pointer"
                        title="Pin Search"
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => onToggleFavorite(item.id, e)}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          item.favorite
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                            : 'text-slate-400 hover:text-rose-500'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`h-4 w-4 ${item.favorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => onDelete(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
