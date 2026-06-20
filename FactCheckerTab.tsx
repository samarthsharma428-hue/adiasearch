/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, Plus } from 'lucide-react';
import { SearchResult } from '../types';
import { PrimaryButton, FactCheckCard } from './DesignSystem';

interface FactCheckerTabProps {
  onCheckClaim: (claim: string) => void;
  isLoading: boolean;
  activeResult?: SearchResult;
}

export default function FactCheckerTab({ onCheckClaim, isLoading, activeResult }: FactCheckerTabProps) {
  const [claim, setClaim] = useState('');

  const claimPresets = [
    "Eating carrots gives humans night vision capabilities.",
    "Water boils at 90°C under high-altitude conditions.",
    "Did Messi score 10 goals in the 2026 World Cup?",
    "Sharks do not get cancer due to special cartilage."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim() !== '') {
      onCheckClaim(claim);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-6 flex flex-col gap-6 select-text animate-fade-in">
      <div>
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-[#4f46e5] dark:text-[#34d399]" />
          <span>Factual Core Auditor</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Enter any viral rumor, physical claim, or public statement. We will isolate the assertion, crosscheck primary records, and yield an objective verdict.
        </p>
      </div>

      {/* Claim input box - claymorphic elevation */}
      <form onSubmit={handleSubmit} className="clay-card rounded-2xl p-5 flex flex-col gap-3 group focus-within:ring-2 focus-within:ring-[#34d399]/15 transition-all duration-300 elevation-3">
        <label className="text-[10px] font-mono tracking-widest text-[#4f46e5] dark:text-[#34d399] uppercase font-bold">
          Claim Statement
        </label>
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g. 'Eating carrots improves night vision.'"
          className="flex-1 min-h-[90px] bg-transparent border-none outline-hidden focus:ring-0 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 resize-none text-xs leading-relaxed"
        />

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-zinc-805/60">
          <PrimaryButton
            type="submit"
            state={isLoading ? 'loading' : 'default'}
            variant="mint"
            icon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Audit Assertion
          </PrimaryButton>
        </div>
      </form>

      {/* Display Active Fact Audit Verdict if present */}
      {isLoading ? (
        <div className="clay-card rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center elevation-2">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <ShieldCheck className="h-5 w-5 text-indigo-500 absolute animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Querying multi-layered network consensus...</h4>
            <p className="text-[11px] text-slate-450 mt-1">Isolating variables & factoring index biases</p>
          </div>
        </div>
      ) : activeResult ? (
        /* Render high-fidelity design system FactCheckCard */
        <FactCheckCard
          verdict={activeResult.factCheck.verdict}
          confidence={activeResult.factCheck.confidence}
          explanation={activeResult.factCheck.explanation}
          query={activeResult.query}
        />
      ) : (
        /* Empty states Claim presets selection slider */
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
            Emergent claims checklist
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {claimPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setClaim(preset);
                  onCheckClaim(preset);
                }}
                className="clay-button p-4 bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all duration-200 select-none group"
              >
                <div className="flex gap-3 items-center min-w-0 pr-3">
                  <span className="text-xs font-bold text-[#4f46e5] dark:text-[#34d399] shrink-0">0{idx + 1}</span>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 font-medium truncate">{preset}</p>
                </div>
                <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 leading-none shrink-0 group-hover:scale-105 transition-transform">
                  <Plus className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
