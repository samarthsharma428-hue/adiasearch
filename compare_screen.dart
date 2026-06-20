/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../components/design_system.dart';

class SourceComparisonMetric {
  final String name;
  final int accuracy;
  final String bias;
  final String latency;
  final String thesis;

  SourceComparisonMetric({
    required this.name,
    required this.accuracy,
    required this.bias,
    required this.latency,
    required this.thesis,
  });
}

class ComparisonResult {
  final String topic;
  final SourceComparisonMetric wikipedia;
  final SourceComparisonMetric news;
  final SourceComparisonMetric papers;
  final SourceComparisonMetric forums;
  final SourceComparisonMetric official;
  final String verdict;

  ComparisonResult({
    required this.topic,
    required this.wikipedia,
    required this.news,
    required this.papers,
    required this.forums,
    required this.official,
    required this.verdict,
  });
}

class CompareScreen extends StatefulWidget {
  const CompareScreen({Key? key}) : super(key: key);

  @override
  _CompareScreenState createState() => _CompareScreenState();
}

class _CompareScreenState extends State<CompareScreen> {
  final TextEditingController _topicController = TextEditingController();
  bool _isLoading = false;
  ComparisonResult? _activeComparison;

  final List<ComparisonResult> _presets = [
    ComparisonResult(
      topic: "Climate Emissions & Global Temperature Rises",
      wikipedia: SourceComparisonMetric(
        name: "Wikipedia",
        accuracy: 94,
        bias: 'neutral',
        latency: 'Days / Weeks',
        thesis: "Comprehensive encyclopedia detailing peer-reviewed climate reports. Humans are greenhouse warning catalysts.",
      ),
      news: SourceComparisonMetric(
        name: "Journalism / News",
        accuracy: 82,
        bias: 'moderate',
        latency: 'Minutes / Hours',
        thesis: "Focuses on immediate impacts (fires, floods) with sensationalist headlines. High noise range depending on publisher political lines.",
      ),
      papers: SourceComparisonMetric(
        name: "Academic Papers",
        accuracy: 99,
        bias: 'neutral',
        latency: 'Months',
        thesis: "Highly mathematical equations modeling thermal cycles. Absolute agreement regarding human carbon footprints.",
      ),
      forums: SourceComparisonMetric(
        name: "Forums & Reddit",
        accuracy: 55,
        bias: 'skewed',
        latency: 'Instantaneous',
        thesis: "Extreme narrative variance. Populated by supportive peer commentary vs conspiracy theories claiming solar cycles.",
      ),
      official: SourceComparisonMetric(
        name: "Official Sources (IPCC / NASA)",
        accuracy: 98,
        bias: 'neutral',
        latency: 'Annual / Bi-annual',
        thesis: "Rigorous global summaries tracking temperature anomalies directly. Defines target emission thresholds officially.",
      ),
      verdict: "Academic papers and Official agencies show 100% agreement. Discord exists inside informal forums (Reddit/Twitter) due to lack of academic review, and in populist News outlets aiming for political sentiment polarization.",
    ),
    ComparisonResult(
      topic: "AI Capabilities & Benchmarks Convergence 2026",
      wikipedia: SourceComparisonMetric(
        name: "Wikipedia",
        accuracy: 85,
        bias: 'neutral',
        latency: 'Weeks / Months',
        thesis: "Tracks historical timelines of model releases and standard MMLU benchmarks. Broad overview which lags in frontier details.",
      ),
      news: SourceComparisonMetric(
        name: "Journalism / News",
        accuracy: 75,
        bias: 'skewed',
        latency: 'Hours / Days',
        thesis: "Claims models are reaching a 'plateau' or human-level sentience. Recycles developer marketing releases with hyperbole.",
      ),
      papers: SourceComparisonMetric(
        name: "Academic Papers",
        accuracy: 96,
        bias: 'neutral',
        latency: 'Months',
        thesis: "Evaluates out-of-distribution math anomalies and architectural bounds. Focuses tightly on logic gaps rather than general answers.",
      ),
      forums: SourceComparisonMetric(
        name: "Forums & Reddit",
        accuracy: 88,
        bias: 'moderate',
        latency: 'Real-time',
        thesis: "High-density practical tests from developer communities. Tracks real-world coding speed, API costs, and context fatigue.",
      ),
      official: SourceComparisonMetric(
        name: "Official Sources (OpenAI / Anthropic)",
        accuracy: 92,
        bias: 'moderate',
        latency: 'Irregular',
        thesis: "Promotes perfect bench scores on complex system benchmarks. Highlights corporate safety, alignment audits, and developer roadmaps.",
      ),
      verdict: "Technical developers on Reddit forums and Academic researchers show high alignment on quantitative model limitations, while general News bodies sensationalize outputs, lagging behind technical realities.",
    ),
  ];

  void _triggerComparison() {
    final text = _topicController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    Future.delayed(Duration(milliseconds: 1400), () {
      final match = _presets.firstWhere(
        (p) => p.topic.toLowerCase().contains(text.toLowerCase()),
        orElse: () => ComparisonResult(
          topic: text,
          wikipedia: SourceComparisonMetric(
            name: "Wikipedia",
            accuracy: 90,
            bias: 'neutral',
            latency: 'Days / Weeks',
            thesis: 'A clean, verified overview of "$text". Broad introductory summaries balancing historical definitions.',
          ),
          news: SourceComparisonMetric(
            name: "Journalism / News",
            accuracy: 80,
            bias: 'moderate',
            latency: 'Minutes / Hours',
            thesis: 'Dynamic real-time reporting on immediate events. Can prioritize headline clicks over deep chemical or historical context.',
          ),
          papers: SourceComparisonMetric(
            name: "Academic Papers",
            accuracy: 97,
            bias: 'neutral',
            latency: 'Months',
            thesis: 'Highly focused, peer-reviewed study analyzing control variables. Extreme physical depth, but high reading difficulty.',
          ),
          forums: SourceComparisonMetric(
            name: "Forums & Reddit",
            accuracy: 62,
            bias: 'skewed',
            latency: 'Instantaneous',
            thesis: 'High variety of anecdotal feedback, individual case files, and speculation. Good for real-world user perspective.',
          ),
          official: SourceComparisonMetric(
            name: "Official Sources",
            accuracy: 95,
            bias: 'neutral',
            latency: 'Months',
            thesis: 'Administrative reports, legal compliance notes, or executive summaries issuing formal guidance on core topics.',
          ),
          verdict: 'Sources overall demonstrate standard agreement for "$text". Academic and official indices present solid, vetted claims, whereas immediate news indices show minor sensationalized noise, and forums host raw anecdotal narratives.',
        ),
      );

      setState(() {
        _activeComparison = match;
        _isLoading = false;
      });
    });
  }

  Widget _getBiasBadge(String bias) {
    Color bg;
    Color text;
    String label = bias.toUpperCase();

    if (bias == 'neutral') {
      bg = Colors.emerald.withOpacity(0.12);
      text = DesignSystem.mintAccent;
    } else if (bias == 'moderate') {
      bg = Colors.blue.withOpacity(0.12);
      text = Colors.blueAccent;
    } else {
      bg = Colors.amber.withOpacity(0.12);
      text = Colors.amber;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: GoogleFonts.jetBrainsMono(
          fontSize: 8,
          fontWeight: FontWeight.bold,
          color: text,
        ),
      ),
    );
  }

  Widget _buildMetricTile(SourceComparisonMetric metric, IconData icon, Color barColor) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? DesignSystem.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Icon(icon, size: 14, color: barColor),
                  SizedBox(width: 8),
                  Text(
                    metric.name,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.grey.shade800,
                    ),
                  ),
                ],
              ),
              _getBiasBadge(metric.bias),
            ],
          ),
          SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                flex: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TRUST RATING',
                      style: GoogleFonts.jetBrainsMono(fontSize: 8, color: Colors.grey),
                    ),
                    SizedBox(height: 2),
                    Text(
                      '${metric.accuracy}%',
                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: barColor),
                    ),
                  ],
                ),
              ),
              Expanded(
                flex: 4,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'LATENCY',
                      style: GoogleFonts.jetBrainsMono(fontSize: 8, color: Colors.grey),
                    ),
                    SizedBox(height: 2),
                    Text(
                      metric.latency,
                      style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              Expanded(
                flex: 5,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PRIMARY THESIS',
                      style: GoogleFonts.jetBrainsMono(fontSize: 8, color: Colors.grey),
                    ),
                    SizedBox(height: 2),
                    Text(
                      metric.thesis,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(fontSize: 10, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      padding: EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.compare_arrows_outlined, color: DesignSystem.mint, size: 24),
              SizedBox(width: 8),
              Text(
                'Source Comparator',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: isDark ? Colors.white : Colors.grey.shade900,
                ),
              ),
            ],
          ),
          SizedBox(height: 4),
          Text(
            'Critically model narratives, tracking consensus agreement across publications.',
            style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
          ),
          SizedBox(height: 16),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: isDark ? DesignSystem.darkCard : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _topicController,
                    onSubmitted: (_) => _triggerComparison(),
                    style: GoogleFonts.inter(fontSize: 12),
                    decoration: InputDecoration(
                      hintText: 'Topic comparison target...',
                      hintStyle: GoogleFonts.inter(fontSize: 12, color: Colors.grey.shade400),
                      border: InputBorder.none,
                    ),
                  ),
                ),
                PrimaryButton(
                  text: 'Compare',
                  onPressed: _triggerComparison,
                  isLoading: _isLoading,
                ),
              ],
            ),
          ),
          SizedBox(height: 24),
          if (_isLoading) ...[
            Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(DesignSystem.mint),
              ),
            )
          ] else if (_activeComparison != null) ...[
            Text(
              'COMPARABLE MATRIX',
              style: GoogleFonts.jetBrainsMono(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            SizedBox(height: 12),
            _buildMetricTile(_activeComparison!.wikipedia, Icons.library_books_outlined, Colors.indigo),
            _buildMetricTile(_activeComparison!.news, Icons.article_outlined, Colors.blue),
            _buildMetricTile(_activeComparison!.papers, Icons.workspace_premium_outlined, Colors.emerald),
            _buildMetricTile(_activeComparison!.forums, Icons.forum_outlined, Colors.purple),
            _buildMetricTile(_activeComparison!.official, Icons.gavel_outlined, Colors.teal),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: DesignSystem.indigo.withOpacity(0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: DesignSystem.indigo.withOpacity(0.2)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.analytics_outlined, color: DesignSystem.indigo, size: 14),
                      SizedBox(width: 6),
                      Text(
                        'Synthesis Verdict',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12, color: DesignSystem.indigo),
                      )
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    _activeComparison!.verdict,
                    style: GoogleFonts.inter(fontSize: 11, height: 1.4, color: isDark ? Colors.grey.shade300 : Colors.grey.shade700),
                  ),
                ],
              ),
            ),
          ] else ...[
            Text(
              'SUGGESTED COMPARISONS',
              style: GoogleFonts.jetBrainsMono(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            SizedBox(height: 12),
            ..._presets.map((p) => GestureDetector(
                  onTap: () {
                    _topicController.text = p.topic;
                    _triggerComparison();
                  },
                  child: Container(
                    margin: EdgeInsets.only(bottom: 8),
                    padding: EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isDark ? DesignSystem.darkCard : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text(
                          p.topic,
                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                        Icon(Icons.chevron_right, size: 16, color: Colors.grey),
                      ],
                    ),
                  ),
                ))
          ]
        ],
      ),
    );
  }
}
