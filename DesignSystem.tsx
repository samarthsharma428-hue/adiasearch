/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Search, 
  Mic, 
  Image, 
  Loader2, 
  Sparkles, 
  ArrowUpRight, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldAlert, 
  BookOpen, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  RotateCw
} from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  variant?: 'mint' | 'indigo' | 'cyan' | 'neutral' | 'danger' | 'ghost';
  state?: 'default' | 'loading' | 'disabled' | 'success';
  className?: string;
  icon?: React.ReactNode;
  id?: string;
}

/**
 * 1. Reusable PrimaryButton component with spring scale, glow, and rumble/haptic tactile states.
 */
export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  variant = 'mint',
  state = 'default',
  className = '',
  icon,
  id
}: PrimaryButtonProps) {
  const [ripple, setRipple] = useState(false);

  const handlePress = (e: React.MouseEvent) => {
    if (state === 'disabled' || state === 'loading') return;
    setRipple(true);
    setTimeout(() => setRipple(false), 300);

    // Simulate subtle device vibration Haptics
    if ('vibrate' in navigator) {
      try { navigator.vibrate(8); } catch {}
    }
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'mint':
        return 'bg-[#34A853] hover:bg-[#2e9549] text-white shadow-[0_4px_12px_rgba(52,168,83,0.25)] dark:shadow-[0_4px_12px_rgba(52,168,83,0.15)]';
      case 'indigo':
        return 'bg-[#4f46e5] hover:bg-[#3b35be] text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]';
      case 'cyan':
        return 'bg-[#06b6d4] hover:bg-[#0891b2] text-white shadow-[0_4px_12px_rgba(6,182,212,0.25)]';
      case 'danger':
        return 'bg-[#f87171] hover:bg-[#ef4444] text-white shadow-[0_4px_12px_rgba(239,68,68,0.2)]';
      case 'neutral':
      default:
        return 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700';
    }
  };

  const isDisabled = state === 'disabled' || state === 'loading';

  return (
    <motion.button
      id={id}
      type={type}
      disabled={isDisabled}
      onClick={handlePress}
      whileHover={isDisabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.96 }}
      className={`relative overflow-hidden cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold select-none flex items-center justify-center gap-1.5 transition-colors duration-200 ${getVariantStyles()} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Dynamic tactile ripple element */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute h-8 w-8 bg-white/20 rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      <span className="flex items-center gap-1.5 z-10">
        {state === 'loading' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
        ) : state === 'success' ? (
          <Check className="h-3.5 w-3.5 text-current animate-bounce" />
        ) : (
          icon
        )}
        {state === 'loading' ? 'Aggregating...' : state === 'success' ? 'Completed' : children}
      </span>
    </motion.button>
  );
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

/**
 * 2. Signature SearchBar: Floating, claymorphic 3D shadow, expandable, glowing border with AI icons.
 */
export function SearchBar({
  onSearch,
  placeholder = 'Scan claims or query details...',
  className = '',
  initialValue = ''
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`w-full relative transition-all duration-300 ${className}`}
    >
      <div 
        className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-300 ${
          isFocused 
            ? 'bg-emerald-500/10 dark:bg-[#34d399]/5 opacity-100' 
            : 'bg-transparent opacity-0'
        }`} 
      />

      <div 
        className={`clay-card rounded-2xl p-1 flex items-center gap-2 duration-300 transition-all ${
          isFocused 
            ? 'scale-[1.015] border-emerald-400 dark:border-[#34d399]/40 ring-1 ring-emerald-400/20' 
            : ''
        }`}
      >
        <div className="pl-3.5 p-2 text-[#4f46e5] dark:text-[#34d399] shrink-0">
          <Search className="h-4.5 w-4.5" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-sans outline-hidden border-none focus:ring-0"
        />

        {value.trim() && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full"
          >
            ×
          </button>
        )}

        <div className="flex items-center gap-1.5 pr-2 shrink-0">
          <button
            type="button"
            className="p-1 px-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-md transition-colors"
            title="Image Query Search"
          >
            <Image className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 px-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-md transition-colors"
            title="Voice Search"
          >
            <Mic className="h-3.5 w-3.5" />
          </button>

          <PrimaryButton
            type="submit"
            variant="mint"
            className="py-1.5 px-3 rounded-xl font-bold"
            id="searchSubmitBtn"
          >
            <Sparkles className="h-3 w-3 shrink-0" />
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}

interface FactCheckCardProps {
  verdict: 'true' | 'false' | 'partially_true' | 'unverified';
  confidence: number;
  explanation: string;
  query: string;
  onTimelineClick?: () => void;
  onCompareClick?: () => void;
}

/**
 * 3. Premium FactCheckCard: Claymorphic soft container showing interactive trust ratings.
 */
export function FactCheckCard({
  verdict,
  confidence,
  explanation,
  query,
  onTimelineClick,
  onCompareClick
}: FactCheckCardProps) {
  const getVerdictDetails = () => {
    switch (verdict) {
      case 'true':
        return {
          banner: 'bg-[#deffe6]/60 text-[#065f46] border-[#a7f3d0]',
          darkBanner: 'dark:bg-emerald-950/20 dark:text-[#34d399] dark:border-emerald-800/40',
          label: 'Verified True Statement',
          details: 'Verified against general scientific consensus & multiple high index portals.',
          color: 'text-[#10b981]'
        };
      case 'false':
        return {
          banner: 'bg-rose-50 text-rose-800 border-rose-205',
          darkBanner: 'dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/40',
          label: 'Unsubstantiated / False',
          details: 'Contains high deviations or contradictions in official repositories.',
          color: 'text-rose-500'
        };
      case 'partially_true':
        return {
          banner: 'bg-[#fffbeb]/90 text-[#92400e] border-[#fde68a]',
          darkBanner: 'dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40',
          label: 'Partially True / Contextual',
          details: 'Depends on location, context, or definitions. See timeline insights.',
          color: 'text-amber-500'
        };
      case 'unverified':
      default:
        return {
          banner: 'bg-slate-50 text-slate-750 border-slate-200',
          darkBanner: 'dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800',
          label: 'Unverified Consensus',
          details: 'Inconclusive research or emerging discussion. Subject to revision.',
          color: 'text-slate-400'
        };
    }
  };

  const current = getVerdictDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="clay-card rounded-2xl p-5 border border-slate-200 dark:border-zinc-800/80 elevation-3 select-text"
    >
      <div className="flex items-center justify-between gap-2.5 border-b border-slate-100 dark:border-zinc-805/60 pb-3 mb-3.5">
        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 dark:text-zinc-500 flex items-center gap-1">
          <BookOpen className="h-3 w-3 text-[#4f46e5]" /> Inquiry Status
        </span>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${current.banner} ${current.darkBanner}`}>
          {current.label}
        </div>
      </div>

      <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug mb-3">
        "{query}"
      </h3>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 text-xs text-slate-650 dark:text-zinc-405 mb-4 leading-relaxed">
        {explanation}
      </div>

      <div className="grid grid-cols-2 gap-4 items-center mb-1">
        <div>
          <span className="text-[9px] font-extrabold uppercase font-mono text-slate-400">Confidence Match</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-base font-black ${current.color}`}>{confidence}%</span>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-[#34A853] h-full rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {onTimelineClick && (
            <button
              onClick={onTimelineClick}
              className="clay-button py-2 px-3 text-[10px] font-bold bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer flex items-center gap-1 text-slate-700 dark:text-zinc-300 shadow-sm"
            >
              <span>Timeline</span>
            </button>
          )}
          {onCompareClick && (
            <button
              onClick={onCompareClick}
              className="clay-button py-2 px-3 text-[10px] font-bold bg-[#deffe6] dark:bg-emerald-950/20 text-[#065f46] dark:text-[#34d399] rounded-xl cursor-pointer"
            >
              <span>Compare</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface SourceCardProps {
  key?: any;
  title: string;
  url: string;
  trustRating: number;
  relevanceScore: number;
  publishDate: string;
  sourceType: string;
  summary: string;
  publisher?: string;
  isSupportive?: boolean;
}

/**
 * 4. High-End SourceCard: Multi-layered soft cards with trust metrics & custom icon.
 */
export function SourceCard({
  title,
  url,
  trustRating,
  relevanceScore,
  publishDate,
  sourceType,
  summary,
  publisher,
  isSupportive = true
}: SourceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      className="clay-card rounded-2xl p-4.5 elevation-2 border border-slate-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 hover:shadow-lg transition-transform"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 mr-2">
            {sourceType}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">{publishDate}</span>
          <h4 className="font-display font-extrabold text-xs text-slate-900 dark:text-white mt-1.5 hover:text-[#4f46e5] cursor-pointer max-w-[245px] truncate">
            <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
          </h4>
          {publisher && (
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{publisher}</p>
          )}
        </div>

        <div className="flex flex-col items-end shrink-0 gap-1">
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-400">Trust</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${
              trustRating >= 80 
                ? 'bg-[#deffe6] text-[#065f46] dark:bg-emerald-950/30 dark:text-[#34d399]' 
                : 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400'
            }`}>
              {trustRating}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-400">Relevance</span>
            <span className="text-[10px] font-semibold text-slate-650 dark:text-zinc-300">
              {relevanceScore}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-normal line-clamp-2 italic mb-2.5">
        "{summary}"
      </p>

      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1">
          {isSupportive ? (
            <span className="flex items-center gap-1 text-emerald-650 dark:text-[#34d399] font-bold">
              <ThumbsUp className="h-3 w-3" /> Supportive Source
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
              <ThumbsDown className="h-3 w-3" /> Contradicting Source
            </span>
          )}
        </div>

        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#4f46e5] dark:text-[#34d399] font-bold flex items-center gap-0.5 hover:underline"
        >
          <span>Raw Logs</span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}

interface ResearchCardProps {
  concise: string;
  detailed: string;
  modelName?: string;
  agreementLevel: string;
  sourcesCount: number;
}

/**
 * 5. Analytical ResearchCard: Comprehensive detailed analytics with glassmorphism visual accent.
 */
export function ResearchCard({
  concise,
  detailed,
  modelName = 'AdiaSearch Factual Model',
  agreementLevel,
  sourcesCount
}: ResearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="clay-card rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/45 backdrop-blur-md elevation-2 select-text"
    >
      <div className="flex items-center justify-between border-b border-indigo-100 dark:border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5.5 w-5.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-xs text-[#4f46e5] dark:text-indigo-400">
            <Compass className="h-3 w-3" />
          </div>
          <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{modelName} Summary</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span>Active Sources:</span>
          <span className="bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-extrabold px-1.5 py-0.5 rounded-md">
            {sourcesCount}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-[10px] uppercase font-mono tracking-wider text-indigo-500 font-extrabold mb-1">
          Concise Synthesis
        </h4>
        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-150 leading-relaxed border-l-2 border-indigo-500 pl-3">
          {concise}
        </p>
      </div>

      <div>
        <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
          Deep Indexed Explanation
        </h4>
        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
          {detailed}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4.5 pt-3.5 border-t border-slate-100 dark:border-zinc-805/85">
        <span className="text-[10px] text-slate-400 select-none">Consensus Agreement</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          agreementLevel === 'High' 
            ? 'bg-[#deffe6] text-[#065f46] dark:bg-emerald-950/20 dark:text-[#34d399]'
            : 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400'
        }`}>
          {agreementLevel} Level
        </span>
      </div>
    </motion.div>
  );
}

interface ConfidenceMeterProps {
  score: number;
  label?: string;
}

/**
 * 6. High-Grade ConfidenceMeter: Playful circular physical gauge utilizing mint green accents.
 */
export function ConfidenceMeter({
  score,
  label = 'Inquiry Trust Factor'
}: ConfidenceMeterProps) {
  // SVG Stroke logic
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="clay-card rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-200 dark:border-zinc-800">
      <div className="flex-1">
        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">{label}</p>
        <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white mt-1">
          {score >= 80 ? 'Robust Authenticity' : score >= 60 ? 'Moderate Consensus' : 'Disputed Assertion'}
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Calculated based on index frequency, peer evaluation, and authority scores.
        </p>
      </div>

      <div className="relative h-18 w-18 flex items-center justify-center shrink-0">
        <svg className="h-full w-full transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            className="stroke-slate-100 dark:stroke-zinc-800 fill-none"
            strokeWidth="5"
          />
          {/* Accent progress dash */}
          <motion.circle
            cx="36"
            cy="36"
            r={radius}
            className="stroke-[#34d399] fill-none"
            strokeWidth="5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        <span className="absolute text-xs font-black font-mono text-slate-800 dark:text-white">
          {score}%
        </span>
      </div>
    </div>
  );
}

interface TimelineCardProps {
  key?: any;
  date: string;
  title: string;
  description: string;
  isFirst?: boolean;
}

/**
 * 7. Sleek TimelineCard: High fidelity milestones detailing step assertions.
 */
export function TimelineCard({
  date,
  title,
  description,
  isFirst = false
}: TimelineCardProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center shrink-0">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center z-10 border ${
          isFirst 
            ? 'bg-[#deffe6] text-[#065f46] border-[#a7f3d0] dark:bg-emerald-950/40 dark:text-[#34d399] dark:border-emerald-700/50' 
            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
        }`}>
          <Clock className="h-3 w-3" />
        </div>
        <div className="w-0.5 bg-slate-205 dark:bg-zinc-800 flex-1 my-1" />
      </div>

      <div className="flex-1 pb-5">
        <span className="text-[9px] uppercase font-mono text-[#4f46e5] dark:text-[#34d399] font-bold">
          {date}
        </span>
        <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white mt-0.5">
          {title}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-normal select-text">
          {description}
        </p>
      </div>
    </div>
  );
}
