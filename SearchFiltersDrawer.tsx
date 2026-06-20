/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlidersHorizontal, X, Shield, Globe, Languages, Calendar, Cpu } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChangeFilters: (filters: SearchFilters) => void;
}

export default function SearchFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
}: SearchFiltersDrawerProps) {
  if (!isOpen) return null;

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChangeFilters({
      ...filters,
      [key]: value,
    });
  };

  const timeRanges = [
    { value: 'all', label: 'All History' },
    { value: '24h', label: 'Past 24 Hours' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: 'year', label: 'Past Year' },
  ] as const;

  const sourceTypes = [
    { value: 'all', label: 'All Indicated' },
    { value: 'scholarly', label: 'Academic / Scholarly' },
    { value: 'news', label: 'Vetted Journalism' },
    { value: 'forums', label: 'Forums & Reddit' },
    { value: 'official', label: 'Official Gov / Org Agencies' },
  ] as const;

  const regions = [
    { value: 'global', label: 'Global (Any)' },
    { value: 'us', label: 'North America (US/CA)' },
    { value: 'eu', label: 'European Union (EU)' },
    { value: 'as', label: 'Asia Pacific (APAC)' },
  ] as const;

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: 'English (EN)' },
    { value: 'es', label: 'Spanish (ES)' },
    { value: 'zh', label: 'Chinese (ZH)' },
    { value: 'fr', label: 'French (FR)' },
  ] as const;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-8 z-40 animate-fade-in rounded-[38px] overflow-hidden select-none">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 flex flex-col gap-5 shadow-2xl border border-slate-150 dark:border-zinc-800 max-h-[85%] overflow-y-auto">
        <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-850">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
            <span className="font-display font-extrabold text-slate-900 dark:text-white text-xs">
              Crawler Parameters
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full cursor-pointer leading-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filters contents */}
        <div className="space-y-4 text-xs">
          {/* Time Limit */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Crawl Back Depth</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {timeRanges.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateFilter('timeRange', t.value)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                    filters.timeRange === t.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-850 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <span>Target Source Categories</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sourceTypes.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateFilter('sourceType', s.value)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                    filters.sourceType === s.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-855 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Region Select */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>Harvest Region</span>
              </span>
              <select
                value={filters.region}
                onChange={(e) => updateFilter('region', e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-slate-700 dark:text-zinc-300 font-bold text-[11px]"
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                <Languages className="h-3 w-3" />
                <span>Target Language</span>
              </span>
              <select
                value={filters.language}
                onChange={(e) => updateFilter('language', e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-slate-700 dark:text-zinc-300 font-bold text-[11px]"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Minimum Trust Score Slider */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                <span>Minimum Trust Threshold</span>
              </span>
              <span className="font-mono font-extrabold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                {filters.minTrustScore}% Trust Score
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={filters.minTrustScore}
              onChange={(e) => updateFilter('minTrustScore', parseInt(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
              Only index sources validated by global fact checking standards above this threshold score.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer text-center mt-2"
        >
          Apply Parameters
        </button>
      </div>
    </div>
  );
}
