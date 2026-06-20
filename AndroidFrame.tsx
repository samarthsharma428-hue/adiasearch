/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Battery, 
  Wifi, 
  Signal, 
  ArrowLeft, 
  ArrowRight,
  RotateCw, 
  Home,
  Lock, 
  Plus, 
  Star,
  X,
  ShieldCheck,
  Circle, 
  Square 
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isDeviceMode: boolean;
  setIsDeviceMode: (mode: boolean) => void;
  onBackPress?: () => void;
}

export default function AndroidFrame({
  children,
  isDeviceMode,
  setIsDeviceMode,
  onBackPress,
}: AndroidFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Top Universal Control Rail */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-display font-medium tracking-wide">
            A
          </div>
          <div>
            <h1 className="font-display font-bold text-base leading-none text-slate-900 dark:text-white">
              AdiaSearch
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Universal Factual Aggregation System
            </p>
          </div>
        </div>

        {/* View mode controllers */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setIsDeviceMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              isDeviceMode
                ? 'bg-white dark:bg-zinc-700 text-[#34A853] dark:text-[#34d399] shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Simulated Flutter Canvas"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Flutter App Core</span>
          </button>
          <button
            onClick={() => setIsDeviceMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              !isDeviceMode
                ? 'bg-white dark:bg-zinc-700 text-[#34A853] dark:text-[#34d399] shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Responsive Full Screen Layout"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Flutter Desktop Web</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-0 md:p-6 overflow-hidden">
        {isDeviceMode ? (
          /* Simulated High-End Android Device */
          <div className="relative w-full max-w-[420px] h-[860px] bg-zinc-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-zinc-800 ring-1 ring-zinc-700 flex flex-col overflow-hidden animate-fade-in">
            {/* Front Camera Notch Hole */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-3xl z-30 flex items-center justify-end px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 border-2 border-zinc-900 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-slate-400 opacity-50" />
              </div>
            </div>

            {/* Ear Speaker line */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-zinc-800 rounded-full z-30" />

            {/* App Internal Body with screen edges */}
            <div className="flex-1 w-full bg-slate-50 dark:bg-zinc-950 rounded-[38px] flex flex-col overflow-hidden relative border border-zinc-800">
              {/* Android Custom Status Bar */}
              <div className="h-10 bg-slate-100 dark:bg-zinc-900/90 backdrop-blur-md px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-zinc-300 select-none z-20 shrink-0">
                <span className="font-mono mt-1">{time}</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="h-3 w-3" />
                  <Wifi className="h-3 w-3" />
                  <div className="flex items-center gap-0.5">
                    <Battery className="h-3.5 w-3.5 rotate-90" />
                    <span>94%</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Viewport Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
                {children}
              </div>

              {/* Android Dynamic Bottom Action Navigation Bar */}
              <div className="h-12 bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 px-12 flex items-center justify-between text-slate-500 dark:text-zinc-400 select-none shrink-0 z-20">
                <button
                  onClick={onBackPress}
                  className="p-1 px-4 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full cursor-pointer active:scale-95 transition-transform"
                  title="Android Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="p-1 px-4 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full cursor-pointer active:scale-95 transition-transform flex items-center justify-center">
                  <Circle className="h-3.5 w-3.5 text-slate-600 dark:text-zinc-300 fill-slate-600 dark:fill-zinc-300" />
                </div>
                <div className="p-1 px-4 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full cursor-pointer active:scale-95 transition-transform flex items-center justify-center">
                  <Square className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Fluid Full Screen Desktop Responsive Layout - Styled like Chrome browser */
          <div className="w-full max-w-6xl h-[820px] bg-white dark:bg-zinc-950 rounded-2xl border border-slate-350 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-fade-in select-none">
            {/* Chrome-Style Window Header tabs top row */}
            <div className="bg-slate-200 dark:bg-zinc-900 px-4 pt-2.5 flex items-end justify-between border-b border-slate-300 dark:border-zinc-800 shrink-0 select-none">
              <div className="flex items-end gap-1.5 overflow-hidden">
                {/* Active Tab */}
                <div className="bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex items-center gap-2 px-4 py-2 text-[11px] font-semibold rounded-t-xl border-t border-x border-slate-300 dark:border-zinc-800/85 shadow-xs max-w-[170px] truncate">
                  <div className="h-3 w-3 rounded-full bg-linear-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-[7px] text-white font-black">
                    A
                  </div>
                  <span className="truncate">AdiaSearch: AI Fact Hub</span>
                  <X className="h-3 w-3 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer ml-1" />
                </div>

                {/* New Tab Button */}
                <button className="p-1 px-1.5 mb-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Standard Window Control buttons */}
              <div className="flex items-center gap-2 pb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              </div>
            </div>

            {/* Chrome-Style Address bar and Action Buttons row */}
            <div className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-850 px-3 py-2 flex items-center justify-between gap-3 shrink-0 select-none">
              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onBackPress}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-850 rounded-lg cursor-pointer transition-colors active:scale-95"
                  title="Chrome Back Button"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled
                  className="p-1.5 text-slate-305 dark:text-zinc-700 rounded-lg cursor-default"
                  title="Chrome Forward Button"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-850 rounded-lg cursor-pointer transition-colors"
                  title="Refresh Chrome Bar"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onBackPress}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-850 rounded-lg cursor-pointer"
                  title="Chrome Home"
                >
                  <Home className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Address Field */}
              <div className="flex-1 relative flex items-center bg-white dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 rounded-full px-4 py-1.5 text-xs text-slate-500 dark:text-zinc-400">
                <Lock className="h-3 w-3 text-emerald-500 dark:text-emerald-400 shrink-0 mr-1.5" />
                <span className="text-slate-450 shrink-0">https://</span>
                <span className="text-slate-800 dark:text-zinc-200 font-semibold">adiasearch.ai</span>
                <span className="text-slate-450 select-text">/factual_hub</span>
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none">
                  <Star className="h-3 w-3 text-amber-500 hover:scale-105 cursor-pointer" />
                </div>
              </div>

              {/* Extensions and profile */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-14 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-1.5 flex items-center justify-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  <span>SECURE</span>
                </div>
                <div className="h-6.5 w-6.5 rounded-full bg-indigo-650 flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm shrink-0">
                  U
                </div>
              </div>
            </div>

            {/* Scrollable Chrome Inner Viewport Content */}
            <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50 dark:bg-zinc-950 select-text">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
