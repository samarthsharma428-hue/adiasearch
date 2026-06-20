/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../models/search_result.dart';
import '../components/design_system.dart';

class HomeScreen extends StatefulWidget {
  final Function(SearchResult) onSaveHistory;

  const HomeScreen({Key? key, required this.onSaveHistory}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _queryController = TextEditingController();
  bool _isLoading = false;
  String _activeModel = 'gemini';
  SearchResult? _currentResult;
  bool _isDetailedView = false;
  String _activeSourcesTab = 'all';

  // Filters state
  String _selectedRegion = 'Global';
  int _relevanceFilter = 0;
  bool _academicOnly = false;

  void _triggerSearch() {
    if (_queryController.text.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
      _currentResult = null;
    });

    // Simulate backend network API payload delivery
    Future.delayed(Duration(milliseconds: 1800), () {
      final query = _queryController.text.trim();
      final List<Source> mockSources = [
        Source(
          id: 's1',
          title: 'Direct Temperature Anomalies & Global Mean Saturation 2026 Report',
          url: 'https://nasa.gov/climate/emissions-trends',
          summary: 'Global warming temperatures increased by 1.15C above benchmarks. Solid correlation with industrial fossil emission records corroborates the main scientific consensus.',
          publishDate: '2026-03-12',
          sourceType: 'official',
          relevanceScore: 98,
          trustRating: 98,
          publisher: 'NASA Goddard Institute',
        ),
        Source(
          id: 's2',
          title: 'IPCC Climate Change Assessment: Stabilizing Global Target Ceilings',
          url: 'https://ipcc.ch/report/2025/carbon-footprints',
          summary: 'To sustain stable environmental levels, net-zero greenhouse gases must converge by 2050. Modeling confirms human activity correlates with active melting speeds.',
          publishDate: '2025-11-20',
          sourceType: 'official',
          relevanceScore: 95,
          trustRating: 99,
          publisher: 'IPCC secretariat',
        ),
        Source(
          id: 's3',
          title: 'Solar Insolation Cycles and Atmosphere Interaction Analysis',
          url: 'https://academic.oup.com/astrophysics/article/solar-cycles',
          summary: 'Examines orbital changes showing greenhouse trapping is the primary positive feedback loop forcing current anomalies. Solar cycles are purely secondary markers.',
          publishDate: '2026-01-05',
          sourceType: 'paper',
          relevanceScore: 91,
          trustRating: 96,
          publisher: 'Journal of Planetary Science',
        ),
        Source(
          id: 's4',
          title: 'Climate Emission Skepticism and the Multi-Decade Solar Irradiance Debate',
          url: 'https://reddit.com/r/climatescience/comments/solar-debate',
          summary: 'Amateur forums showing high narrative variance. Supportive technical breakdowns contrast with baseless claims that solar expansion is the exclusive driver.',
          publishDate: '2026-05-18',
          sourceType: 'reddit',
          relevanceScore: 65,
          trustRating: 58,
          publisher: 'Reddit Community Index',
        ),
      ];

      final SearchResult result = SearchResult(
        query: query,
        filters: {
          'region': _selectedRegion,
          'relevance': _relevanceFilter,
          'academic': _academicOnly,
        },
        sourceExplorer: mockSources,
        factCheck: FactCheck(
          verdict: query.toLowerCase().contains('hoax') ? 'false' : 'true',
          confidence: query.toLowerCase().contains('hoax') ? 95 : 88,
          explanation: query.toLowerCase().contains('hoax')
              ? 'Multi-cluster verification conclusively disproves emission hoax claims. NASA and international scientific academies hold a 99.8% consensus confirming human industrial factors.'
              : 'The query matches official NASA, IPCC, and peer-reviewed journals. Temperature records show extreme upward bounds strictly indexing human industrial carbon emission surges.',
        ),
        aiAnswer: AiAnswer(
          concise: 'Scientific consensus universally verifies that human greenhouse emissions force active climate anomalies. Claims of solar cycles or hoaxes fail standard reproducibility audits.',
          professional: 'Extensive datasets compiled by NASA, the IPCC, and NOAA confirm that anthropogenic carbon emissions are the primary driver of current temperature increases. Solar cycles operate as low-frequency factors and cannot account for the rapid modern delta.',
          creative: 'We are active cartographers of our own planetary warming. Vetted facts paint a clear canvas: our industrial metabolism is actively trapping thermal energy, outlasting solar cycles and writing a new geologic chapter.',
          absolute: 'ANTHROPOGENIC EMISSIONS VERIFIED AT 99% CONFIDENCE. FOSSIL COMBUSTION TRAPS INFRARED SPECTRUM IRRADIATING ANOMALOUS TEMPERATURE ANGLE PATHWAYS.',
        ),
        timeline: [
          TimelineEvent(
            date: '2026-06',
            title: 'Anomalous Melting Boundaries Measured',
            description: 'Thermal buoys record abnormal temperature peaks in polar water rings, forcing swift revision of immediate sea-level projections.',
          ),
          TimelineEvent(
            date: '2025-12',
            title: 'IPCC Climate Accord Signed',
            description: 'Global coalition formalizes rigorous emission ceiling rules to enforce Net Zero 2050 targets.',
          ),
          TimelineEvent(
            date: '1995-10',
            title: 'First Major consensus milestone',
            description: 'Academic networks agree that human atmospheric accumulation triggers anomalous thermal delta indicators.',
          ),
        ],
      );

      _currentResult = result;
      widget.onSaveHistory(result);
      _isLoading = false;
      if (mounted) setState(() {});
    });
  }

  void _showFiltersDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).cardColor,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            bool isDark = Theme.of(context).brightness == Brightness.dark;
            return Container(
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              margin: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        'Audit Custom Filter Desk',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : Colors.grey.shade900,
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.close, size: 20),
                        onPressed: () => Navigator.pop(context),
                      )
                    ],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Geographic Target region',
                    style: GoogleFonts.jetBrainsMono(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  SizedBox(height: 8),
                  DropdownButton<String>(
                    value: _selectedRegion,
                    isExpanded: true,
                    underline: Container(
                      height: 1,
                      color: DesignSystem.mint,
                    ),
                    items: ['Global', 'North America', 'Europe', 'Asia Pacific']
                        .map((String value) => DropdownMenuItem<String>(
                              value: value,
                              child: Text(value, style: GoogleFonts.inter(fontSize: 12)),
                            ))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedRegion = val);
                        setModalState(() {});
                      }
                    },
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        'Academic Peer-Review Only',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: isDark ? Colors.white : Colors.grey.shade800,
                        ),
                      ),
                      Switch(
                        value: _academicOnly,
                        activeColor: DesignSystem.mint,
                        onChanged: (val) {
                          setState(() => _academicOnly = val);
                          setModalState(() {});
                        },
                      ),
                    ],
                  ),
                  SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: PrimaryButton(
                      text: 'Apply Settings',
                      onPressed: () => Navigator.pop(context),
                    ),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: DesignSystem.mint.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'BETA COGNITIVE DESK',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                    color: DesignSystem.mintAccent,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            'Inquiry Dashboard',
            style: GoogleFonts.inter(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.5,
              color: isDark ? Colors.white : Colors.grey.shade900,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Investigate claims, cross-verify across academic registries, and filter source accuracy seamlessly.',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: Colors.grey.shade500,
              height: 1.4,
            ),
          ),
          SizedBox(height: 20),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: isDark ? DesignSystem.darkCard : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
              ),
              boxShadow: DesignSystem.elevation1(isDark),
            ),
            child: Row(
              children: [
                Icon(Icons.search, color: Colors.grey, size: 18),
                SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _queryController,
                    onSubmitted: (_) => _triggerSearch(),
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: isDark ? Colors.white : Colors.grey.shade900,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Enter inquiry (e.g. Climate Emission Hoax)...',
                      hintStyle: GoogleFonts.inter(fontSize: 12, color: Colors.grey.shade400),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.tune, color: Colors.grey, size: 18),
                  onPressed: _showFiltersDialog,
                )
              ],
            ),
          ),
          SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              PrimaryButton(
                text: 'Verify Claims',
                onPressed: _triggerSearch,
                isLoading: _isLoading,
              ),
            ],
          ),
          if (_isLoading) ...[
            SizedBox(height: 40),
            Center(
              child: Column(
                children: [
                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(DesignSystem.mint),
                    strokeWidth: 3,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Querying neural verification registries...',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            )
          ],
          if (_currentResult != null) ...[
            SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Text(
                  'MULTI-MODEL RESPONSE',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: ['gemini', 'chatgpt', 'claude'].map((model) {
                      bool isSel = _activeModel == model;
                      return GestureDetector(
                        onTap: () => setState(() => _activeModel = model),
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: isSel ? DesignSystem.mint : Colors.transparent,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            model.toUpperCase(),
                            style: GoogleFonts.jetBrainsMono(
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                              color: isSel ? Colors.white : Colors.grey,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                )
              ],
            ),
            SizedBox(height: 12),
            ResearchCard(
              concise: _activeModel == 'gemini'
                  ? _currentResult!.aiAnswer.concise
                  : 'Alternative concise model verification delta. Scientific consensus remains consistent.',
              detailed: _activeModel == 'gemini'
                  ? _currentResult!.aiAnswer.professional
                  : 'Expanded detailed reporting on model weights confirming exact emissions data matching typical standards.',
              modelName: _activeModel.toUpperCase(),
              agreementLevel: _currentResult!.factCheck.confidence >= 80 ? 'High' : 'Moderate',
              sourcesCount: _currentResult!.sourceExplorer.length,
            ),
            SizedBox(height: 20),
            Text(
              'CONSENSUS AUDIT ANALYSIS',
              style: GoogleFonts.jetBrainsMono(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
            SizedBox(height: 12),
            FactCheckCard(
              verdict: _currentResult!.factCheck.verdict,
              confidence: _currentResult!.factCheck.confidence,
              explanation: _currentResult!.factCheck.explanation,
              query: _currentResult!.query,
            ),
            SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Text(
                  'SOURCE EXPLORER INDEX',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                Text(
                  '${_currentResult!.sourceExplorer.length} sources matched',
                  style: GoogleFonts.inter(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
            SizedBox(height: 12),
            ..._currentResult!.sourceExplorer.map((src) => SourceCard(
                  title: src.title,
                  url: src.url,
                  trustRating: src.trustRating,
                  relevanceScore: src.relevanceScore,
                  publishDate: src.publishDate,
                  sourceType: src.sourceType,
                  summary: src.summary,
                  publisher: src.publisher,
                )),
            if (_currentResult!.timeline != null) ...[
              SizedBox(height: 24),
              Text(
                'CHRONOLOGICAL INSIGHTS',
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
              SizedBox(height: 16),
              ..._currentResult!.timeline!.asMap().entries.map((arg) => TimelineCard(
                    date: arg.value.date,
                    title: arg.value.title,
                    description: arg.value.description,
                    isFirst: arg.key == 0,
                  )),
            ],
          ]
        ],
      ),
    );
  }
}
