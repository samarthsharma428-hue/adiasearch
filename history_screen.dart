/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../models/search_result.dart';
import '../components/design_system.dart';

class HistoryScreen extends StatelessWidget {
  final List<SearchResult> history;
  final VoidCallback onClearAll;
  final Function(SearchResult) onSelectResult;

  const HistoryScreen({
    Key? key,
    required this.history,
    required this.onClearAll,
    required this.onSelectResult,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Icon(Icons.history_outlined, color: DesignSystem.mint, size: 24),
                  SizedBox(width: 8),
                  Text(
                    'Audit Vault',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: isDark ? Colors.white : Colors.grey.shade900,
                    ),
                  ),
                ],
              ),
              if (history.isNotEmpty)
                TextButton.icon(
                  onPressed: onClearAll,
                  icon: Icon(Icons.delete_sweep_outlined, size: 16, color: Colors.red),
                  label: Text(
                    'Clear All',
                    style: GoogleFonts.inter(fontSize: 11, color: Colors.red, fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
          SizedBox(height: 4),
          Text(
            'Secure device-localized secure cache holding historic audits, indices, speed logs.',
            style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
          ),
          SizedBox(height: 20),
          Expanded(
            child: history.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.folder_shared_outlined, size: 48, color: Colors.grey.shade400),
                        SizedBox(height: 12),
                        Text(
                          'No historical audits indexed yet',
                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Active inquiries will be cached inside this vault.',
                          style: GoogleFonts.inter(fontSize: 10, color: Colors.grey.shade500),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    physics: BouncingScrollPhysics(),
                    itemCount: history.length,
                    itemBuilder: (context, idx) {
                      final item = history[idx];
                      Color badgeText;
                      Color badgeBg;
                      
                      if (item.factCheck.verdict == 'true') {
                        badgeBg = isDark ? Colors.emerald.withOpacity(0.1) : Color(0xFFDEFFE6);
                        badgeText = isDark ? DesignSystem.mintAccent : Color(0xFF065F46);
                      } else if (item.factCheck.verdict == 'false') {
                        badgeBg = isDark ? Colors.red.withOpacity(0.1) : Colors.red.shade50;
                        badgeText = isDark ? Colors.red.shade300 : Colors.red.shade800;
                      } else {
                        badgeBg = isDark ? Colors.amber.withOpacity(0.1) : Colors.amber.shade50;
                        badgeText = isDark ? Colors.amber.shade400 : Colors.amber.shade900;
                      }

                      return InkWell(
                        onTap: () => onSelectResult(item),
                        child: Container(
                          margin: EdgeInsets.only(bottom: 12),
                          padding: EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isDark ? DesignSystem.darkCard : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '"${item.query}"',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                    SizedBox(height: 6),
                                    Row(
                                      children: [
                                        Container(
                                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: badgeBg,
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            item.factCheck.verdict.toUpperCase(),
                                            style: GoogleFonts.inter(fontSize: 8, color: badgeText, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        Text(
                                          'Confidence: ${item.factCheck.confidence}%',
                                          style: GoogleFonts.inter(fontSize: 10, color: Colors.grey),
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              Icon(Icons.arrow_forward_ios, size: 12, color: Colors.grey),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
