/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Source {
  id: string;
  title: string;
  url: string;
  summary: string;
  trustRating: number; // 0 to 100
  sourceType: 'website' | 'youtube' | 'news' | 'wikipedia' | 'pdf' | 'paper' | 'forum' | 'reddit' | 'official';
  publishDate: string;
  relevanceScore: number; // 0 to 100
  publisher?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface DeepResearchReport {
  executiveSummary: string;
  keyFindings: string[];
  supportingEvidence: string;
  contradictions: string;
  sourceList: string[];
  finalConclusion: string;
}

export interface FactCheckVerdict {
  verdict: 'true' | 'false' | 'partially_true' | 'unverified';
  confidence: number; // 0 to 100
  explanation: string;
  evidence: Array<{
    title: string;
    description: string;
    sourceType: string;
    isSupportive: boolean;
  }>;
}

export interface SearchResult {
  query: string;
  aiAnswer: {
    concise: string;
    detailed: string;
    model: 'gemini' | 'chatgpt' | 'claude' | 'deepseek';
  };
  factCheck: FactCheckVerdict;
  supportingSources: Source[];
  contradictingSources: Source[];
  contradictionExplanation?: string;
  sourceExplorer: Source[];
  confidenceAnalysis: {
    overallScore: number;
    sourcesCount: number;
    diversityScore: number;
    agreementLevel: 'High' | 'Moderate' | 'Low';
    graphData: Array<{ name: string; score: number }>;
  };
  timeline?: TimelineEvent[];
  deepResearchReport?: DeepResearchReport;
}

export interface SearchFilters {
  timeRange: 'all' | '24h' | 'week' | 'month' | 'year';
  sourceType: 'all' | 'scholarly' | 'news' | 'forums' | 'official';
  region: 'global' | 'us' | 'eu' | 'as';
  language: 'all' | 'en' | 'es' | 'zh' | 'fr';
  minTrustScore: number; // 0 to 100
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: string;
  pinned: boolean;
  favorite: boolean;
  verdict?: 'true' | 'false' | 'partially_true' | 'unverified';
  confidence?: number;
}
