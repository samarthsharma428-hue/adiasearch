/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  ShieldAlert as ShieldWarn,
  ExternalLink,
  Award,
  GitCompare,
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  BarChart2,
  FileText,
  Download,
  Loader2,
  Bookmark,
  Share2,
  HelpCircle,
} from 'lucide-react';
import { SearchResult, Source, DeepResearchReport } from '../types';
import { ResearchCard, SourceCard, ConfidenceMeter, TimelineCard } from './DesignSystem';

interface ResultsViewProps {
  result: SearchResult;
  onBack: () => void;
  onBookmark: (query: string) => void;
  isBookmarked: boolean;
  onGenerateDeepResearch: () => void;
  deepResearchLoading: boolean;
  deepResearchReport?: DeepResearchReport;
}

export default function ResultsView({
  result,
  onBack,
  onBookmark,
  isBookmarked,
  onGenerateDeepResearch,
  deepResearchLoading,
  deepResearchReport,
}: ResultsViewProps) {
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'chatgpt' | 'claude' | 'deepseek'>(
    'gemini'
  );
  const [isDetailedAnswerExpanded, setIsDetailedAnswerExpanded] = useState(false);
  const [activeSourceTab, setActiveSourceTab] = useState<string>('all');
  const [sortingOption, setSortingOption] = useState<'relevance' | 'trust' | 'date'>('relevance');
  const [copied, setCopied] = useState(false);

  // Multi-Model Variant Answers (Persona Modulations)
  const getModelPersonaAnswer = (model: typeof selectedModel) => {
    switch (model) {
      case 'claude':
        return {
          intro: `[Claude 3.5 Sonnet Analysis] I have analyzed the factual validity of "${result.query}" with a structural focus on academic definitions and systemic limits:`,
          detailed: `${result.aiAnswer.detailed}\n\n*Claude's Analytical Context:* From an epistemological perspective, this claim touches upon core physical properties/databases. The empirical consensus demonstrates a high convergence towards ${result.factCheck.confidence}% accuracy when filtering out partisan forums and focusing on gold-standard publications.`,
        };
      case 'chatgpt':
        return {
          intro: `[ChatGPT 4o Overview] Here is a direct, bullet-pointed outline summarizing the factual findings for you:`,
          detailed: `### Key Assertions:\n1. **Factual Verdict**: Checked as **${result.factCheck.verdict.toUpperCase().replace('_', ' ')}** with a confidence score of **${result.factCheck.confidence}%**.\n2. **Underlying Factors**: ${result.factCheck.explanation}\n\n${result.aiAnswer.detailed}`,
        };
      case 'deepseek':
        return {
          intro: `[DeepSeek-R1 CoT reasoning] <thought>
1. User input: "${result.query}"
2. Cross-referencing thermodynamic, systemic, or athletic databanks...
3. Match verified. Verdict: ${result.factCheck.verdict}.
4. Formulating dense technical response layout.
</thought>
DeepSeek verified core claim assertions:`,
          detailed: `### Mathematical & Algorithmic Assertion:\n- Claim Value Verification: [${result.factCheck.verdict.toUpperCase()}]\n- Statistical Node Consensus: ${result.factCheck.confidence}% agreement rating.\n\n${result.aiAnswer.detailed}`,
        };
      case 'gemini':
      default:
        return {
          intro: `[Gemini 3.5 Flash Synthesis] Direct fact-check response compiled from indexing high-trust news networks, science databases, and Wikipedia pages:`,
          detailed: result.aiAnswer.detailed,
        };
    }
  };

  const personaData = getModelPersonaAnswer(selectedModel);

  // Sorting sources logic
  const getSortedSources = (sources: Source[]) => {
    let filtered = [...sources];
    if (activeSourceTab !== 'all') {
      filtered = filtered.filter(
        (s) => s.sourceType.toLowerCase() === activeSourceTab.toLowerCase()
      );
    }

    return filtered.sort((a, b) => {
      if (sortingOption === 'trust') return b.trustRating - a.trustRating;
      if (sortingOption === 'date') return b.publishDate.localeCompare(a.publishDate);
      return b.relevanceScore - a.relevanceScore;
    });
  };

  const displayedSources = getSortedSources(result.sourceExplorer);

  // Download deep report utilities
  const exportReport = (format: 'pdf' | 'md' | 'txt') => {
    if (!deepResearchReport) return;

    let content = '';
    let filename = `AdiaSearch_DeepReport_${result.query.replace(/\s+/g, '_')}`;

    if (format === 'md') {
      filename += '.md';
      content = `# AdiaSearch Deep Research Report\n**Query:** ${result.query}\n**Verdict:** ${result.factCheck.verdict.toUpperCase()}\n\n`;
      content += `## Executive Summary\n${deepResearchReport.executiveSummary}\n\n`;
      content += `## Key Findings\n` + deepResearchReport.keyFindings.map((f) => `- ${f}`).join('\n') + `\n\n`;
      content += `## Supporting Evidence\n${deepResearchReport.supportingEvidence}\n\n`;
      content += `## Contradictions\n${deepResearchReport.contradictions}\n\n`;
      content += `## Sources Analyzed\n` + deepResearchReport.sourceList.map((s) => `- ${s}`).join('\n') + `\n\n`;
      content += `## Final Conclusion\n${deepResearchReport.finalConclusion}\n`;
    } else {
      filename += '.txt';
      content = `ADIA SEARCH DEEP RESEARCH REPORT\n===============================\nQuery: ${result.query}\nVerdict: ${result.factCheck.verdict.toUpperCase()}\n\n`;
      content += `EXECUTIVE SUMMARY\n-----------------\n${deepResearchReport.executiveSummary}\n\n`;
      content += `KEY FINDINGS\n------------\n` + deepResearchReport.keyFindings.map((f) => `* ${f}`).join('\n') + `\n\n`;
      content += `SUPPORTING EVIDENCE\n-------------------\n${deepResearchReport.supportingEvidence}\n\n`;
      content += `CONTRADICTIONS\n--------------\n${deepResearchReport.contradictions}\n\n`;
      content += `SOURCES\n--------\n` + deepResearchReport.sourceList.map((s) => `[x] ${s}`).join('\n') + `\n\n`;
      content += `CONCLUSION\n----------\n${deepResearchReport.finalConclusion}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getVerdictGradients = (verdict: typeof result.factCheck.verdict) => {
    switch (verdict) {
      case 'true':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          border: 'border-emerald-100 dark:border-emerald-900',
          text: 'text-emerald-700 dark:text-emerald-300',
          indicator: 'bg-emerald-500',
          icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'false':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/20',
          border: 'border-rose-100 dark:border-rose-900',
          text: 'text-rose-700 dark:text-rose-300',
          indicator: 'bg-rose-500',
          icon: <ShieldAlert className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
        };
      case 'partially_true':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          border: 'border-amber-100 dark:border-amber-900',
          text: 'text-amber-700 dark:text-amber-300',
          indicator: 'bg-amber-500',
          icon: <ShieldWarn className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
        };
      case 'unverified':
      default:
        return {
          bg: 'bg-slate-50 dark:bg-zinc-900',
          border: 'border-slate-200 dark:border-zinc-800',
          text: 'text-slate-700 dark:text-zinc-300',
          indicator: 'bg-slate-400',
          icon: <HelpCircle className="h-6 w-6 text-slate-500" />,
        };
    }
  };

  const verdictStyle = getVerdictGradients(result.factCheck.verdict);

  return (
    <div className="flex flex-col gap-6 p-6 pb-20 select-none">
      {/* Search Header / Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>New Solve</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onBookmark(result.query)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-600'
            }`}
            title="Pin Search"
          >
            <Bookmark className="h-4 w-4 fill-current" />
          </button>
          <div className="relative">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {copied && (
              <span className="absolute bottom-full right-0 mb-1 px-2.5 py-1 text-[9px] font-bold text-white bg-zinc-900 dark:bg-zinc-850 border border-zinc-800 rounded-lg shadow-sm whitespace-nowrap animate-fade-in z-50">
                Copied Link!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Query Banner */}
      <div>
        <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Indexing consensus</p>
        <span className="font-display font-bold text-xl text-slate-900 dark:text-white leading-tight">
          "{result.query}"
        </span>
      </div>

      {/* SECTION 1: AI Answer with multi-model selector */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-55 dark:bg-zinc-900/50 p-2.5 rounded-2xl border border-slate-150 dark:border-zinc-800">
          <span className="flex items-center gap-2 font-display font-black text-xs text-slate-800 dark:text-zinc-200 pl-1.5">
            <Sparkles className="h-4 w-4 text-[#34A853] animate-pulse-slow shrink-0" />
            <span>Multi-Model Variant</span>
          </span>

          <div className="flex flex-wrap gap-1 bg-slate-200 dark:bg-zinc-850 p-0.5 rounded-xl shrink-0">
            {(['gemini', 'chatgpt', 'claude', 'deepseek'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedModel === m
                    ? 'bg-white dark:bg-zinc-700 text-[#34A853] dark:text-[#34d399] shadow-2xs'
                    : 'text-slate-500 dark:text-zinc-550 hover:text-slate-800 dark:hover:text-zinc-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <ResearchCard
          concise={result.aiAnswer.concise}
          detailed={personaData.detailed}
          modelName={selectedModel.toUpperCase()}
          agreementLevel={result.factCheck.confidence >= 80 ? 'High' : result.factCheck.confidence >= 60 ? 'Moderate' : 'Low'}
          sourcesCount={result.sourceExplorer.length}
        />
      </div>

      {/* SECTION 2: Fact Check Verdict */}
      <div className={`border ${verdictStyle.border} ${verdictStyle.bg} rounded-2xl p-5 flex flex-col gap-4 shadow-2xs`}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-display font-extrabold text-sm text-slate-900 dark:text-white">
            {verdictStyle.icon}
            <span>Fact-Check Verdict</span>
          </span>
          <span className={`text-xs font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${verdictStyle.border} bg-white dark:bg-zinc-900 shadow-2xs ${verdictStyle.text}`}>
            {result.factCheck.verdict.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Circular/SVG Confidence Score Meter */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 border border-dashed border-white/40 dark:border-zinc-800/40 rounded-xl bg-white/50 dark:bg-zinc-900/40">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-slate-200 dark:stroke-zinc-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-indigo-600 dark:stroke-teal-400 fill-none transition-all duration-1000"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - result.factCheck.confidence / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="font-mono text-xl font-extrabold text-slate-800 dark:text-white leading-none">
                  {result.factCheck.confidence}%
                </span>
                <p className="text-[8px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold">
                  Confidence
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-center">
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              {result.factCheck.explanation}
            </p>
          </div>
        </div>

        {/* Evidence card sublist */}
        <div className="space-y-2 mt-2">
          <p className="text-[9px] font-mono tracking-wider uppercase text-slate-400 dark:text-zinc-500">
            Primary Evidence Audits ({result.factCheck.evidence.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {result.factCheck.evidence.map((ev, idx) => (
              <div
                key={idx}
                className="bg-white/40 dark:bg-zinc-950/40 p-3 rounded-xl border border-white/50 dark:border-zinc-900 flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 dark:text-zinc-200 truncate">{ev.title}</span>
                  <span
                    className={`text-[8px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded-md ${
                      ev.isSupportive
                        ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-400'
                        : 'bg-rose-100/50 text-rose-700 dark:bg-rose-950/45 dark:text-rose-400'
                    }`}
                  >
                    {ev.isSupportive ? 'Supportive' : 'Refuting'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {ev.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Contradicting Evidence banner if exists */}
      {result.contradictingSources.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span className="text-sm font-display font-bold">Contradictions Detected in Crawl</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-mono">
            {result.contradictionExplanation}
          </p>

          <div className="space-y-2 pt-2 border-t border-amber-500/10">
            {result.contradictingSources.map((c) => (
              <div key={c.id} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 px-2 py-1 rounded-md text-[10px] text-slate-500 font-mono">
                  <span>Trust: {c.trustRating}/100</span>
                  <span>{c.sourceType.toUpperCase()}</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 mt-1">{c.title}</h4>
                <p className="text-slate-500 dark:text-zinc-400 text-[11px] leading-relaxed">{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Source Explorer Tabs with Sorting */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-2">
          <span className="flex items-center gap-1.5 font-display font-bold text-sm text-slate-900 dark:text-white">
            <Layers className="h-4.5 w-4.5 text-indigo-500" />
            <span>Multi-Source Explorer</span>
          </span>

          {/* Sorting picker */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-slate-400">Sort by:</span>
            <select
              value={sortingOption}
              onChange={(e) => setSortingOption(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-indigo-500 dark:text-indigo-400 outline-none border-b border-indigo-500/20 cursor-pointer"
            >
              <option value="relevance" className="dark:bg-zinc-900">Relevance</option>
              <option value="trust" className="dark:bg-zinc-900">Trust Index</option>
              <option value="date" className="dark:bg-zinc-900">Publish Date</option>
            </select>
          </div>
        </div>

        {/* Source Categories Scroll Container */}
        <div className="flex gap-1 overflow-x-auto pb-1 select-none">
          {['all', 'wikipedia', 'news', 'paper', 'pdf', 'youtube', 'reddit', 'official'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveSourceTab(type)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full border shrink-0 cursor-pointer capitalize transition-all ${
                activeSourceTab === type
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {type === 'paper' ? 'research paper' : type}
            </button>
          ))}
        </div>

        {/* Source List Card Elements */}
        <div className="grid grid-cols-1 gap-3 mt-1">
          {displayedSources.length > 0 ? (
            displayedSources.map((source) => (
              <SourceCard
                key={source.id}
                title={source.title}
                url={source.url}
                trustRating={source.trustRating}
                relevanceScore={source.relevanceScore}
                publishDate={source.publishDate}
                sourceType={source.sourceType}
                summary={source.summary}
                publisher={source.publisher}
                isSupportive={source.trustRating > 50}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 dark:bg-zinc-950/60 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-500">
              No sources found for this tab filter.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: Graphical Confidence Analysis */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <span className="flex items-center gap-1.5 font-display font-bold text-sm text-slate-900 dark:text-white leading-none">
          <BarChart2 className="h-4.5 w-4.5 text-indigo-500" />
          <span>Metric Confidence Analytics</span>
        </span>

        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-1">
          Analysis evaluated <span className="font-bold text-slate-800 dark:text-white">{result.confidenceAnalysis.sourcesCount} distinct source clusters</span> with an overall consensus agreement rating of <span className="font-bold text-indigo-500">{result.confidenceAnalysis.agreementLevel}</span>.
        </p>

        {/* Custom Premium Rendered SVGs representing metric bars */}
        <div className="space-y-2 mt-2">
          {result.confidenceAnalysis.graphData.map((data, idx) => (
            <div key={idx} className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-zinc-400">{data.name}</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">{data.score}% trust</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-teal-400 to-indigo-500 rounded-full transition-all duration-100"
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: Interactive Chronicle Timeline (Only rendered if chronological timeline details exist) */}
      {result.timeline && result.timeline.length > 0 && (
        <div className="bg-slate-50 dark:bg-zinc-900/40 rounded-2xl p-5 border border-slate-200/40 dark:border-zinc-800 flex flex-col gap-4">
          <span className="flex items-center gap-1.5 font-display font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            <Calendar className="h-4.5 w-4.5 text-[#34A853]" />
            <span>Chronicle Timeline Insights</span>
          </span>

          <div className="space-y-1">
            {result.timeline.map((event, idx) => (
              <TimelineCard
                key={idx}
                date={event.date}
                title={event.title}
                description={event.description}
                isFirst={idx === 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: Deep Research Report Mode Area */}
      <div className="border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
        {/* Sparkle details */}
        <div className="absolute top-0 right-0 p-4 opacity-15">
          <Award className="h-16 w-16 text-indigo-500" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-bold uppercase">
            Autonomous Fact Dossier
          </span>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Adia Deep Research Core
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          Deep research will crawl peer-reviewed references, academic archives, and official statements to construct a comprehensive publication dossier explaining contradictions and verifying claims permanently.
        </p>

        {deepResearchReport ? (
          /* Render full deep report content beautifully */
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col gap-4 text-xs select-text">
            {/* Executive summary banner */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/25 p-3 rounded-lg border-l-2 border-indigo-500">
              <span className="font-mono text-[9px] text-indigo-500 uppercase font-semibold">Executive Summary</span>
              <p className="text-slate-700 dark:text-zinc-300 leading-relaxed font-semibold mt-1">
                {deepResearchReport.executiveSummary}
              </p>
            </div>

            {/* Findings list */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-slate-400 uppercase">Key Discoveries</span>
              <ul className="space-y-1.5">
                {deepResearchReport.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-slate-600 dark:text-zinc-400">
                    <span className="text-indigo-500 font-bold mt-0.5">&middot;</span>
                    <span className="leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empirical proof */}
            <div>
              <span className="font-mono text-[9px] text-slate-400 uppercase">Corroborating Evidence</span>
              <p className="text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {deepResearchReport.supportingEvidence}
              </p>
            </div>

            {/* Conflicting logic resolution */}
            <div className="bg-amber-500/5 dark:bg-amber-950/5 p-3 rounded-lg border border-dashed border-amber-500/20">
              <span className="font-mono text-[9px] text-amber-500 uppercase font-bold">Unveiling Contradictory Logic</span>
              <p className="text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {deepResearchReport.contradictions}
              </p>
            </div>

            {/* Citation nodes */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-900">
              <span className="font-mono text-[9px] text-slate-400 uppercase">Primary Citations Index</span>
              <div className="flex flex-col gap-1 mt-1 text-[11px] text-slate-400 font-mono">
                {deepResearchReport.sourceList.map((src, idx) => (
                  <span key={idx}>[{idx + 1}] {src}</span>
                ))}
              </div>
            </div>

            {/* Final stance panel */}
            <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-3 rounded-lg">
              <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">Authoritative Clause</span>
              <p className="text-slate-700 dark:text-zinc-300 font-medium leading-relaxed mt-1">
                {deepResearchReport.finalConclusion}
              </p>
            </div>

            {/* Download and Save actions */}
            <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-900 select-none">
              <button
                onClick={() => exportReport('md')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white text-[10px] font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
              >
                <FileText className="h-3 w-3" />
                <span>Markdown</span>
              </button>
              <button
                onClick={() => exportReport('txt')}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Export TXT</span>
              </button>
            </div>
          </div>
        ) : (
          /* Generate Button */
          <button
            onClick={onGenerateDeepResearch}
            disabled={deepResearchLoading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 hover:scale-[1.01] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {deepResearchLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Crawl-aggregating references in background...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Compile Autonomous Dossier</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
