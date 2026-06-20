/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GitCompare, BookOpen, Newspaper, Award, Users, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface SourceComparisonMetric {
  name: string;
  accuracy: number; // 0-100
  bias: 'neutral' | 'moderate' | 'skewed' | 'unreliable';
  latency: string; // speed
  thesis: string;
}

interface ComparisonResult {
  topic: string;
  wikipedia: SourceComparisonMetric;
  news: SourceComparisonMetric;
  papers: SourceComparisonMetric;
  forums: SourceComparisonMetric;
  official: SourceComparisonMetric;
  verdict: string;
}

export default function CompareSourcesTab() {
  const [topic, setTopic] = useState('');
  const [activeComparison, setActiveComparison] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const presets: ComparisonResult[] = [
    {
      topic: "Climate Emissions & Global Temperature Rises",
      wikipedia: {
        name: "Wikipedia",
        accuracy: 94,
        bias: 'neutral',
        latency: 'Days / Weeks',
        thesis: "Comprehensive encyclopedia detailing peer-reviewed climate reports. Humans are greenhouse warning catalysts."
      },
      news: {
        name: "Journalism / News",
        accuracy: 82,
        bias: 'moderate',
        latency: 'Minutes / Hours',
        thesis: "Focuses on immediate impacts (fires, floods) with sensationalist headlines. High noise range depending on publisher political lines."
      },
      papers: {
        name: "Academic Papers",
        accuracy: 99,
        bias: 'neutral',
        latency: 'Months',
        thesis: "Highly mathematical equations modeling thermal cycles. Absolute agreement regarding human carbon footprints."
      },
      forums: {
        name: "Forums & Reddit",
        accuracy: 55,
        bias: 'skewed',
        latency: 'Instantaneous',
        thesis: "Extreme narrative variance. Populated by supportive peer commentary vs conspiracy theories claiming solar cycles."
      },
      official: {
        name: "Official Sources (IPCC / NASA)",
        accuracy: 98,
        bias: 'neutral',
        latency: 'Annual / Bi-annual',
        thesis: "Rigorous global summaries tracking temperature anomalies directly. Defines target emission thresholds officially."
      },
      verdict: "Academic papers and Official agencies show 100% agreement. Discord exists inside informal forums (Reddit/Twitter) due to lack of academic review, and in populist News outlets aiming for political sentiment polarization."
    },
    {
      topic: "AI Capabilities & Benchmarks Convergence 2026",
      wikipedia: {
        name: "Wikipedia",
        accuracy: 85,
        bias: 'neutral',
        latency: 'Weeks / Months',
        thesis: "Tracks historical timelines of model releases and standard MMLU benchmarks. Broad overview which lags in frontier details."
      },
      news: {
        name: "Journalism / News",
        accuracy: 75,
        bias: 'skewed',
        latency: 'Hours / Days',
        thesis: "Claims models are reaching a 'plateau' or human-level sentience. Recycles developer marketing releases with hyperbole."
      },
      papers: {
        name: "Academic Papers",
        accuracy: 96,
        bias: 'neutral',
        latency: 'Months',
        thesis: "Evaluates out-of-distribution math anomalies and architectural bounds. Focuses tightly on logic gaps rather than general answers."
      },
      forums: {
        name: "Forums & Reddit",
        accuracy: 88,
        bias: 'moderate',
        latency: 'Real-time',
        thesis: "High-density practical tests from developer communities. Tracks real-world coding speed, API costs, and context fatigue."
      },
      official: {
        name: "Official Sources (OpenAI / Anthropic)",
        accuracy: 92,
        bias: 'moderate',
        latency: 'Irregular',
        thesis: "Promotes perfect bench scores on complex system benchmarks. Highlights corporate safety, alignment audits, and developer roadmaps."
      },
      verdict: "Technical developers on Reddit forums and Academic researchers show high alignment on quantitative model limitations, while general News bodies sensationalize outputs, lagging behind technical realities."
    }
  ];

  const handleSearchCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() === '') return;

    setIsLoading(true);
    setTimeout(() => {
      // Find matching preset or generate a dynamic comparative mockup
      const match = presets.find(p => p.topic.toLowerCase().includes(topic.toLowerCase())) || {
        topic: topic,
        wikipedia: {
          name: "Wikipedia",
          accuracy: 90,
          bias: 'neutral',
          latency: 'Days / Weeks',
          thesis: `A clean, verified overview of "${topic}". Broad introductory summaries balancing historical definitions.`
        },
        news: {
          name: "Journalism / News",
          accuracy: 80,
          bias: 'moderate',
          latency: 'Minutes / Hours',
          thesis: `Dynamic real-time reporting on the immediate events. Can prioritize headline clicks over deep chemical or historical context.`
        },
        papers: {
          name: "Academic Papers",
          accuracy: 97,
          bias: 'neutral',
          latency: 'Months',
          thesis: `Highly focused, peer-reviewed study analyzing control variables. Extreme physical depth, but high reading difficulty.`
        },
        forums: {
          name: "Forums & Reddit",
          accuracy: 62,
          bias: 'skewed',
          latency: 'Instantaneous',
          thesis: `High variety of anecdotal feedback, individual case files, and speculation. Good for real-world user perspective.`
        },
        official: {
          name: "Official Sources",
          accuracy: 95,
          bias: 'neutral',
          latency: 'Months',
          thesis: `Administrative reports, legal compliance notes, or executive summaries issuing formal guidance on core topics.`
        },
        verdict: `Sources overall demonstrate standard agreement for "${topic}". Academic and official indices present solid, vetted claims, whereas immediate news indices show minor sensationalized noise, and forums host raw anecdotal narratives.`
      };

      setActiveComparison(match);
      setIsLoading(false);
    }, 1200);
  };

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case 'neutral':
        return <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 px-1.5 py-0.5 rounded-sm font-semibold uppercase text-[8px]">Neutral</span>;
      case 'moderate':
        return <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-450 border border-blue-100 dark:border-blue-900 px-1.5 py-0.5 rounded-sm font-semibold uppercase text-[8px]">Moderate</span>;
      case 'skewed':
        return <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900 px-1.5 py-0.5 rounded-sm font-semibold uppercase text-[8px]">Skewed</span>;
      case 'unreliable':
      default:
        return <span className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900 px-1.5 py-0.5 rounded-sm font-semibold uppercase text-[8px]">Unreliable</span>;
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-6 flex flex-col gap-6 select-none">
      <div>
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
          <GitCompare className="h-7 w-7 text-indigo-500" />
          <span>Source Comparator</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Analyze and contrast thesis statements, reliability indices, reporting latency, and inherent agendas across disparate publication clusters.
        </p>
      </div>

      {/* Input query form */}
      <form onSubmit={handleSearchCompare} className="relative group">
        <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl filter blur-sm group-focus-within:blur-md transition-all" />
        <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3.5 shadow-3xs group-focus-within:border-indigo-500 transition-all">
          <GitCompare className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Compare climate, AI plateau, medical studies..."
            className="flex-1 min-w-0 bg-transparent border-0 outline-hidden focus:ring-0 text-xs pl-3 pr-2 text-slate-800 dark:text-zinc-100 placeholder-slate-450"
          />
          <button
            type="submit"
            disabled={topic.trim() === '' || isLoading}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer active:scale-95 shrink-0"
          >
            Compare
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">Evaluating reliability metrics across indices...</p>
        </div>
      ) : activeComparison ? (
        /* Render Visual Comparative Dashboards */
        <div className="space-y-4 animate-fade-in text-xs">
          {/* Comparison Cards Matrix Grid */}
          <div className="space-y-3">
            {[
              { metric: activeComparison.wikipedia, icon: <BookOpen className="h-4 w-4 text-slate-650" />, color: 'border-l-indigo-500' },
              { metric: activeComparison.news, icon: <Newspaper className="h-4 w-4 text-blue-500" />, color: 'border-l-blue-500' },
              { metric: activeComparison.papers, icon: <Award className="h-4 w-4 text-emerald-500" />, color: 'border-l-emerald-500' },
              { metric: activeComparison.forums, icon: <Users className="h-4 w-4 text-purple-500" />, color: 'border-l-purple-500' },
              { metric: activeComparison.official, icon: <GitCompare className="h-4 w-4 text-teal-500" />, color: 'border-l-teal-500' },
            ].map(({ metric, icon, color }) => (
              <div
                key={metric.name}
                className={`bg-white dark:bg-zinc-900/80 border border-slate-150 dark:border-zinc-800 rounded-xl p-4 shadow-3xs flex flex-col gap-2 border-l-4 ${color}`}
              >
                <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 px-2.5 py-1.5 rounded-lg">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-display font-bold text-slate-900 dark:text-white leading-none">
                      {metric.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-slate-400">Bias:</span>
                    {getBiasLabel(metric.bias)}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center mt-1">
                  {/* Accuracy dial */}
                  <div className="col-span-3 flex flex-col">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Trust Index</span>
                    <span className="text-sm font-mono font-bold text-slate-800 dark:text-white">{metric.accuracy}%</span>
                  </div>
                  {/* Latency dial */}
                  <div className="col-span-4 flex flex-col">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Latency</span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 truncate">{metric.latency}</span>
                  </div>
                  {/* Primary Thesis */}
                  <div className="col-span-5 flex flex-col">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Primary Thesis</span>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal line-clamp-2">
                      {metric.thesis}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Expert consensus synthesis verdict */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-150/80 dark:border-indigo-900/80 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse-slow" />
            </div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-display font-extrabold text-xs">Adia Synthesis Verdict</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-semibold">
              {activeComparison.verdict}
            </p>
          </div>
        </div>
      ) : (
        /* Empty states comparison suggestions list */
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
            Suggested Compositions
          </p>
          <div className="grid grid-cols-1 gap-2">
            {presets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setTopic(preset.topic);
                  setActiveComparison(preset);
                }}
                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-850/80 border border-slate-200/50 dark:border-zinc-800/50 rounded-xl flex items-center justify-between cursor-pointer transition select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <GiCompare className="h-4 w-4 text-indigo-500 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-zinc-300 font-bold truncate">
                    {preset.topic}
                  </p>
                </div>
                <span className="text-[9px] font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full select-none">
                  Vetted
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline custom icon components to bridge names accurately if needed
const GiCompare = GitCompare;
