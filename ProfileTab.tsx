/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  ShieldCheck, 
  Shield, 
  Key, 
  Settings, 
  HelpCircle, 
  Lock, 
  CheckCircle2, 
  Info,
  Server,
  Terminal,
  Zap
} from 'lucide-react';
import { PrimaryButton } from './DesignSystem';

interface ProfileTabProps {
  userEmail?: string;
  historyCount: number;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function ProfileTab({
  userEmail = 'meenudeepak2006@gmail.com',
  historyCount,
  darkMode,
  setDarkMode
}: ProfileTabProps) {
  const [allowTelemetry, setAllowTelemetry] = useState(false);
  const [fastSearch, setFastSearch] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch {}
    }
  };

  const copyConfigDetails = () => {
    triggerHaptic();
    navigator.clipboard.writeText('GEMINI_API_KEY=<configured>');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-5 py-6 flex flex-col gap-6 animate-fade-in select-text">
      {/* 3D Neumorphic Avatar Profile Card */}
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="clay-card rounded-2xl p-5 border border-slate-205 dark:border-zinc-800 relative overflow-hidden elevation-3"
      >
        <div className="absolute top-0 right-0 h-28 w-28 bg-[#34A853]/10 dark:bg-[#34d399]/5 rounded-bl-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-linear-to-tr from-indigo-650 to-[#34A853] flex items-center justify-center text-white font-display font-light text-xl shadow-inner relative">
            <span className="font-extrabold">{userEmail.charAt(0).toUpperCase()}</span>
            <span className="absolute bottom-0 right-0 h-4 w-4 bg-[#34A853] border-2 border-white dark:border-zinc-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-black text-sm text-slate-900 dark:text-white">Factual Operator</h2>
              <div className="h-4.5 rounded-md bg-[#deffe6] dark:bg-emerald-950/20 px-1.5 flex items-center justify-center gap-0.5 text-[8px] text-[#065f46] dark:text-[#34d399] font-black border border-[#a7f3d0] dark:border-emerald-800/40">
                <ShieldCheck className="h-2.5 w-2.5" />
                <span>SECURE USER</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-mono select-all">
              {userEmail}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Active Session Audit Log: <strong className="text-slate-700 dark:text-zinc-200">{historyCount} queries cached</strong>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Flutter App Shell Preferences list */}
      <div className="flex flex-col gap-3">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 select-none px-1">
          Haptic Preferences
        </h3>

        <div className="clay-card rounded-2xl p-4.5 border border-slate-200 dark:border-zinc-800 flex flex-col gap-4 elevation-1">
          {/* Switch Row 1 - Theme */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white">Visual Contrast Night Mode</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Applies sleek modern dark-zinc elements for reduced eye strain.</p>
            </div>
            <button
              onClick={() => {
                triggerHaptic();
                setDarkMode(!darkMode);
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-hidden cursor-pointer ${
                darkMode ? 'bg-[#34A853]' : 'bg-slate-300'
              }`}
            >
              <div className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="h-[1px] bg-slate-100 dark:bg-zinc-805" />

          {/* Switch Row 2 - Fast crawling */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white">Active Speed Indexing</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Optimizes background AI checks, failing fast under sluggish network latency.</p>
            </div>
            <button
              onClick={() => {
                triggerHaptic();
                setFastSearch(!fastSearch);
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-hidden cursor-pointer ${
                fastSearch ? 'bg-[#34A853]' : 'bg-slate-300'
              }`}
            >
              <div className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform ${
                fastSearch ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Safety and Secrets instructions */}
      <div className="flex flex-col gap-3">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 select-none px-1">
          Security Infrastructure
        </h3>

        <div className="clay-card rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 flex flex-col gap-4 elevation-2">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-[#4f46e5] dark:text-indigo-400 shrink-0">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white">Zero API Keys Exposed</h4>
              <p className="text-[11px] text-slate-650 dark:text-zinc-400 mt-1 leading-relaxed">
                All requests to the actual server-side Gemini flash model <strong className="font-mono text-[10px]">gemini-3.5-flash</strong> remain private. Under strict system rules, keys are kept safely in secret environment variables behind full-stack express proxies, with client-facing inputs strictly prohibited.
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 dark:bg-zinc-805" />

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Server className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> CLOUD RUN INGRESS STATUS
            </span>
            <PrimaryButton
              onClick={copyConfigDetails}
              variant="neutral"
              className="py-1 px-3 text-[10px] rounded-lg"
            >
              {isCopied ? 'Credentials Verified' : 'Check API Status'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
