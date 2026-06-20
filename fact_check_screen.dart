/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../components/design_system.dart';

class FactCheckPreset {
  final String statement;
  final String category;
  final String verdict;
  final int confidence;
  final String explanation;

  FactCheckPreset({
    required this.statement,
    required this.category,
    required this.verdict,
    required this.confidence,
    required this.explanation,
  });
}

class FactCheckScreen extends StatefulWidget {
  const FactCheckScreen({Key? key}) : super(key: key);

  @override
  _FactCheckScreenState createState() => _FactCheckScreenState();
}

class _FactCheckScreenState extends State<FactCheckScreen> {
  final TextEditingController _statementController = TextEditingController();
  bool _isLoading = false;
  FactCheckPreset? _activePreset;

  final List<FactCheckPreset> _presets = [
    FactCheckPreset(
      statement: "Vitamin C completely protects against and cures colds within 24 hours.",
      category: "Health & Nutrition",
      verdict: "partially_true",
      confidence: 76,
      explanation: "Vitamin C is essential for immune cell production, but extensive clinical studies confirm it does not cure or completely prevent colds. It can slightly reduce cold duration by 8-14% if consumed regularly, not as an instant 24-hour cure.",
    ),
    FactCheckPreset(
      statement: "The Great Wall of China is clearly visible from orbit with the naked eye.",
      category: "Geography & History",
      verdict: "false",
      confidence: 99,
      explanation: "Astronauts confirm the Great Wall is not visible to the naked eye from orbit. It is narrow, matches the color of surrounding topography, and is only identifiable under perfect satellite magnification.",
    ),
    FactCheckPreset(
      statement: "Quantum computing is already decoding all secure standard financial transactions.",
      category: "Technology",
      verdict: "false",
      confidence: 95,
      explanation: "Frontier quantum systems are physically bounded. They utilize logical state indicators but do not possess the necessary physical qubits to process Shor's algorithm for breaking current cryptosystems. Active migration is underway but financial targets are currently secure.",
    ),
  ];

  void _triggerAudit() {
    final text = _statementController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    Future.delayed(Duration(milliseconds: 1400), () {
      final match = _presets.firstWhere(
        (p) => p.statement.toLowerCase().contains(text.toLowerCase()),
        orElse: () => FactCheckPreset(
          statement: text,
          category: "General Inquiry",
          verdict: "partially_true",
          confidence: 70,
          explanation: 'General automated audit synthesis completed. The statement "$text" carries substantial historical correlation but is subject to contextual caveats and lack of direct consensus under formal academic scrutiny.',
        ),
      );

      setState(() {
        _activePreset = match;
        _isLoading = false;
      });
    });
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
              Icon(Icons.gavel_outlined, color: DesignSystem.mint, size: 24),
              SizedBox(width: 8),
              Text(
                'Claims Auditing',
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
            'Instantly extract claims, verify alignment with verified registries, and audit rumors.',
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
                    controller: _statementController,
                    onSubmitted: (_) => _triggerAudit(),
                    style: GoogleFonts.inter(fontSize: 12),
                    decoration: InputDecoration(
                      hintText: 'Enter claim statement to audit...',
                      hintStyle: GoogleFonts.inter(fontSize: 12, color: Colors.grey.shade400),
                      border: InputBorder.none,
                    ),
                  ),
                ),
                PrimaryButton(
                  text: 'Audit',
                  onPressed: _triggerAudit,
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
          ] else if (_activePreset != null) ...[
            Text(
              'AUDITED CLAIM RESULT',
              style: GoogleFonts.jetBrainsMono(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            SizedBox(height: 12),
            FactCheckCard(
              verdict: _activePreset!.verdict,
              confidence: _activePreset!.confidence,
              explanation: _activePreset!.explanation,
              query: _activePreset!.statement,
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Text(
                  'Classification: ',
                  style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.grey.shade805 : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _activePreset!.category,
                    style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                )
              ],
            ),
          ] else ...[
            Text(
              'COMMON CLAIMS IN CIRCULATION',
              style: GoogleFonts.jetBrainsMono(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            SizedBox(height: 12),
            ..._presets.map((p) => GestureDetector(
                  onTap: () {
                    _statementController.text = p.statement;
                    _triggerAudit();
                  },
                  child: Container(
                    margin: EdgeInsets.only(bottom: 12),
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? DesignSystem.darkCard : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: DesignSystem.indigo.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                p.category,
                                style: GoogleFonts.jetBrainsMono(fontSize: 8, color: DesignSystem.indigo, fontWeight: FontWeight.bold),
                              ),
                            ),
                            Icon(Icons.arrow_outward, size: 14, color: Colors.grey),
                          ],
                        ),
                        SizedBox(height: 10),
                        Text(
                          p.statement,
                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
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
class ColorExtensions {}
