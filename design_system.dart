/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';

class DesignSystem {
  static const Color mint = Color(0xFF34A853);
  static const Color mintAccent = Color(0xFF34D399);
  static const Color darkBg = Color(0xFF121214);
  static const Color darkCard = Color(0xFF1E1E22);
  static const Color lightBg = Color(0xFFF8FAFC);
  static const Color indigo = Color(0xFF4F46E5);

  static List<BoxShadow> elevation1(bool darkMode) {
    return [
      if (!darkMode)
        BoxShadow(
          color: Color(0xFFA5B4CB).withOpacity(0.15),
          offset: Offset(1, 1),
          blurRadius: 3,
        )
      else
        BoxShadow(
          color: Colors.black.withOpacity(0.4),
          offset: Offset(1, 1),
          blurRadius: 3,
        )
    ];
  }

  static List<BoxShadow> elevation3(bool darkMode) {
    return [
      if (!darkMode) ...[
        BoxShadow(
          color: Color(0xFFA5B4CB).withOpacity(0.25),
          offset: Offset(6, 6),
          blurRadius: 16,
        ),
        BoxShadow(
          color: Colors.white,
          offset: Offset(-6, -6),
          blurRadius: 16,
        )
      ] else ...[
        BoxShadow(
          color: Colors.black.withOpacity(0.5),
          offset: Offset(6, 6),
          blurRadius: 16,
        ),
        BoxShadow(
          color: Color(0xFF27272A).withOpacity(0.3),
          offset: Offset(-6, -6),
          blurRadius: 16,
        )
      ]
    ];
  }
}

class PrimaryButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isSuccess;
  final Widget? icon;
  final String variant; // 'mint', 'indigo', 'neutral'

  const PrimaryButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isSuccess = false,
    this.icon,
    this.variant = 'mint',
  }) : super(key: key);

  @override
  _PrimaryButtonState createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Color _getBgColor() {
    if (widget.variant == 'mint') return DesignSystem.mint;
    if (widget.variant == 'indigo') return DesignSystem.indigo;
    return Colors.grey.shade100;
  }

  Color _getTextColor() {
    if (widget.variant == 'neutral') return Colors.grey.shade800;
    return Colors.white;
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: (_) => _controller.forward(),
        onTapUp: (_) {
          _controller.reverse();
          if (widget.onPressed != null && !widget.isLoading) {
            widget.onPressed!();
          }
        },
        onTapCancel: () => _controller.reverse(),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: _getBgColor(),
            borderRadius: BorderRadius.circular(30),
            boxShadow: DesignSystem.elevation1(isDark),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.isLoading)
                Container(
                  width: 14,
                  height: 14,
                  margin: EdgeInsets.only(right: 8),
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(_getTextColor()),
                  ),
                )
              else if (widget.isSuccess)
                Icon(Icons.check, size: 14, color: _getTextColor())
              else if (widget.icon != null)
                Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: widget.icon!,
                ),
              Text(
                widget.isLoading
                    ? 'Aggregating...'
                    : widget.isSuccess
                        ? 'Completed'
                        : widget.text,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: _getTextColor(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class FactCheckCard extends StatelessWidget {
  final String verdict;
  final int confidence;
  final String explanation;
  final String query;
  final VoidCallback? onTimelineClick;
  final VoidCallback? onCompareClick;

  const FactCheckCard({
    Key? key,
    required this.verdict,
    required this.confidence,
    required this.explanation,
    required this.query,
    this.onTimelineClick,
    this.onCompareClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    Color bannerBg;
    Color bannerText;
    String verdictLabel;
    Color barColor;

    switch (verdict) {
      case 'true':
        bannerBg = isDark ? Colors.emerald.withOpacity(0.1) : Color(0xFFDEFFE6);
        bannerText = isDark ? DesignSystem.mintAccent : Color(0xFF065F46);
        verdictLabel = 'Verified True Statement';
        barColor = DesignSystem.mint;
        break;
      case 'false':
        bannerBg = isDark ? Colors.red.withOpacity(0.1) : Colors.red.shade50;
        bannerText = isDark ? Colors.red.shade300 : Colors.red.shade800;
        verdictLabel = 'Unsubstantiated / False';
        barColor = Colors.red;
        break;
      case 'partially_true':
        bannerBg = isDark ? Colors.amber.withOpacity(0.1) : Colors.amber.shade55;
        bannerText = isDark ? Colors.amber.shade400 : Colors.amber.shade900;
        verdictLabel = 'Partially True / Contextual';
        barColor = Colors.amber;
        break;
      default:
        bannerBg = isDark ? Colors.grey.shade900 : Colors.grey.shade50;
        bannerText = isDark ? Colors.grey.shade400 : Colors.grey.shade700;
        verdictLabel = 'Unverified Consensus';
        barColor = Colors.grey;
    }

    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? DesignSystem.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
        ),
        boxShadow: DesignSystem.elevation3(isDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Icon(Icons.book_outlined, size: 14, color: DesignSystem.indigo),
                  SizedBox(width: 4),
                  Text(
                    'INQUIRY STATUS',
                    style: GoogleFonts.jetBrainsMono(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: bannerBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: bannerText.withOpacity(0.3)),
                ),
                child: Text(
                  verdictLabel,
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: bannerText,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 14),
          Text(
            '"$query"',
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.grey.shade900,
            ),
          ),
          SizedBox(height: 12),
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? Colors.black.withOpacity(0.2) : Colors.grey.shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? Colors.transparent : Colors.grey.shade100,
              ),
            ),
            child: Text(
              explanation,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: isDark ? Colors.grey.shade300 : Colors.grey.shade700,
                height: 1.5,
              ),
            ),
          ),
          SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'CONFIDENCE MATCH',
                      style: GoogleFonts.jetBrainsMono(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                      ),
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '$confidence%',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: barColor,
                          ),
                        ),
                        SizedBox(width: 8),
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: confidence / 100.0,
                              minHeight: 6,
                              valueColor: AlwaysStoppedAnimation<Color>(barColor),
                              backgroundColor: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (onTimelineClick != null) ...[
                SizedBox(width: 12),
                InkWell(
                  onTap: onTimelineClick,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.grey.shade900 : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.withOpacity(0.2)),
                    ),
                    child: Text(
                      'Timeline',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.grey.shade750,
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class SourceCard extends StatelessWidget {
  final String title;
  final String url;
  final int trustRating;
  final int relevanceScore;
  final String publishDate;
  final String sourceType;
  final String summary;
  final String publisher;
  final bool isSupportive;

  const SourceCard({
    Key? key,
    required this.title,
    required this.url,
    required this.trustRating,
    required this.relevanceScore,
    required this.publishDate,
    required this.sourceType,
    required this.summary,
    required this.publisher,
    this.isSupportive = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? DesignSystem.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
        ),
        boxShadow: DesignSystem.elevation1(isDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            sourceType.toUpperCase(),
                            style: GoogleFonts.jetBrainsMono(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.grey.shade300 : Colors.grey.shade600,
                            ),
                          ),
                        ),
                        SizedBox(width: 8),
                        Text(
                          publishDate,
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.grey.shade900,
                      ),
                    ),
                    if (publisher.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4.0),
                        child: Text(
                          publisher,
                          style: GoogleFonts.jetBrainsMono(
                            fontSize: 10,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Row(
                    children: [
                      Text(
                        'Trust ',
                        style: GoogleFonts.inter(fontSize: 9, color: Colors.grey),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: trustRating >= 80
                              ? (isDark ? Colors.emerald.withOpacity(0.15) : Color(0xFFDEFFE6))
                              : (isDark ? Colors.amber.withOpacity(0.15) : Color(0xFFFEF3C7)),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '$trustRating',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: trustRating >= 80
                                ? (isDark ? DesignSystem.mintAccent : Color(0xFF065F46))
                                : (isDark ? Colors.amber.shade400 : Colors.amber.shade900),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Relevance: $relevanceScore%',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            '"$summary"',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontStyle: FontStyle.italic,
              color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
            ),
          ),
          SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Icon(
                    isSupportive ? Icons.thumb_up_alt_outlined : Icons.thumb_down_alt_outlined,
                    size: 13,
                    color: isSupportive ? DesignSystem.mint : Colors.red,
                  ),
                  SizedBox(width: 4),
                  Text(
                    isSupportive ? 'Supportive Source' : 'Contradicting Source',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: isSupportive ? DesignSystem.mint : Colors.red,
                    ),
                  ),
                ],
              ),
              Icon(Icons.arrow_outward, size: 12, color: DesignSystem.indigo),
            ],
          ),
        ],
      ),
    );
  }
}

class ResearchCard extends StatelessWidget {
  final String concise;
  final String detailed;
  final String modelName;
  final String agreementLevel;
  final int sourcesCount;

  const ResearchCard({
    Key? key,
    required this.concise,
    required this.detailed,
    required this.modelName,
    required this.agreementLevel,
    required this.sourcesCount,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? DesignSystem.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
        ),
        boxShadow: DesignSystem.elevation3(isDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 12,
                    backgroundColor: DesignSystem.indigo.withOpacity(0.1),
                    child: Icon(Icons.explore_outlined, size: 12, color: DesignSystem.indigo),
                  ),
                  SizedBox(width: 8),
                  Text(
                    '$modelName Summary',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.grey.shade800,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Text(
                    'Active Sources: ',
                    style: GoogleFonts.inter(fontSize: 10, color: Colors.grey),
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '$sourcesCount',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.grey.shade800,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'CONCISE SYNTHESIS',
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: DesignSystem.indigo,
                ),
              ),
              SizedBox(height: 6),
              Container(
                padding: EdgeInsets.only(left: 12),
                decoration: BoxDecoration(
                  border: Border(
                    left: BorderSide(color: DesignSystem.indigo, width: 3),
                  ),
                ),
                child: Text(
                  concise,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.grey.shade100 : Colors.grey.shade800,
                    height: 1.5,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'DEEP INDEXED EXPLANATION',
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
              SizedBox(height: 6),
              Text(
                detailed,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: isDark ? Colors.grey.shade400 : Colors.grey.shade650,
                  height: 1.5,
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          Divider(color: Colors.grey.withOpacity(0.2)),
          SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                'Consensus Agreement',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: agreementLevel == 'High'
                      ? (isDark ? Colors.emerald.withOpacity(0.15) : Color(0xFFDEFFE6))
                      : (isDark ? Colors.amber.withOpacity(0.15) : Color(0xFFFEF3C7)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$agreementLevel Level',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: agreementLevel == 'High'
                        ? (isDark ? DesignSystem.mintAccent : Color(0xFF065F46))
                        : (isDark ? Colors.amber.shade400 : Colors.amber.shade900),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class TimelineCard extends StatelessWidget {
  final String date;
  final String title;
  final String description;
  final bool isFirst;

  const TimelineCard({
    Key? key,
    required this.date,
    required this.title,
    required this.description,
    this.isFirst = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isFirst
                    ? (isDark ? Colors.emerald.withOpacity(0.2) : Color(0xFFDEFFE6))
                    : (isDark ? Colors.grey.shade800 : Colors.grey.shade100),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isFirst ? DesignSystem.mint : Colors.grey.withOpacity(0.3),
                ),
              ),
              child: Icon(
                Icons.access_time_filled,
                size: 12,
                color: isFirst ? DesignSystem.mint : Colors.grey,
              ),
            ),
            Container(
              width: 2,
              height: 48,
              color: Colors.grey.withOpacity(0.2),
            ),
          ],
        ),
        SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  date,
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: DesignSystem.indigo,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.grey.shade900,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  description,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
