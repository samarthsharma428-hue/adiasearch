/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dart:convert';

class Source {
  final String id;
  final String title;
  final String url;
  final String summary;
  final String publishDate;
  final String sourceType;
  final int relevanceScore;
  final int trustRating;
  final String publisher;

  Source({
    required this.id,
    required this.title,
    required this.url,
    required this.summary,
    required this.publishDate,
    required this.sourceType,
    required this.relevanceScore,
    required this.trustRating,
    required this.publisher,
  });

  factory Source.fromJson(Map<String, dynamic> json) {
    return Source(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      url: json['url'] ?? '',
      summary: json['summary'] ?? '',
      publishDate: json['publishDate'] ?? '',
      sourceType: json['sourceType'] ?? 'website',
      relevanceScore: json['relevanceScore'] ?? 0,
      trustRating: json['trustRating'] ?? 0,
      publisher: json['publisher'] ?? '',
    );
  }
}

class FactCheck {
  final String verdict;
  final int confidence;
  final String explanation;

  FactCheck({
    required this.verdict,
    required this.confidence,
    required this.explanation,
  });

  factory FactCheck.fromJson(Map<String, dynamic> json) {
    return FactCheck(
      verdict: json['verdict'] ?? 'unverified',
      confidence: json['confidence'] ?? 50,
      explanation: json['explanation'] ?? '',
    );
  }
}

class AiAnswer {
  final String concise;
  final String professional;
  final String creative;
  final String absolute;

  AiAnswer({
    required this.concise,
    required this.professional,
    required this.creative,
    required this.absolute,
  });

  factory AiAnswer.fromJson(Map<String, dynamic> json) {
    return AiAnswer(
      concise: json['concise'] ?? '',
      professional: json['professional'] ?? '',
      creative: json['creative'] ?? '',
      absolute: json['absolute'] ?? '',
    );
  }
}

class TimelineEvent {
  final String date;
  final String title;
  final String description;

  TimelineEvent({
    required this.date,
    required this.title,
    required this.description,
  });

  factory TimelineEvent.fromJson(Map<String, dynamic> json) {
    return TimelineEvent(
      date: json['date'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
    );
  }
}

class SearchResult {
  final String query;
  final Map<String, dynamic> filters;
  final List<Source> sourceExplorer;
  final FactCheck factCheck;
  final AiAnswer aiAnswer;
  final List<TimelineEvent>? timeline;

  SearchResult({
    required this.query,
    required this.filters,
    required this.sourceExplorer,
    required this.factCheck,
    required this.aiAnswer,
    this.timeline,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) {
    var rawSources = json['sourceExplorer'] as List? ?? [];
    List<Source> sources = rawSources.map((s) => Source.fromJson(s)).toList();

    var rawTimeline = json['timeline'] as List? ?? [];
    List<TimelineEvent> timelineEvents = rawTimeline.map((t) => TimelineEvent.fromJson(t)).toList();

    return SearchResult(
      query: json['query'] ?? '',
      filters: json['filters'] ?? {},
      sourceExplorer: sources,
      factCheck: FactCheck.fromJson(json['factCheck'] ?? {}),
      aiAnswer: AiAnswer.fromJson(json['aiAnswer'] ?? {}),
      timeline: timelineEvents.isNotEmpty ? timelineEvents : null,
    );
  }
}

class DeepResearchReport {
  final String query;
  final String synthesis;
  final String timestamp;
  final List<String> bibliography;

  DeepResearchReport({
    required this.query,
    required this.synthesis,
    required this.timestamp,
    required this.bibliography,
  });

  factory DeepResearchReport.fromJson(Map<String, dynamic> json) {
    return DeepResearchReport(
      query: json['query'] ?? '',
      synthesis: json['synthesis'] ?? '',
      timestamp: json['timestamp'] ?? '',
      bibliography: List<String>.from(json['bibliography'] ?? []),
    );
  }
}
