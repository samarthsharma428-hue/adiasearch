/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import '../components/design_system.dart';

class ProfileScreen extends StatefulWidget {
  final String userEmail;
  final int historyCount;
  final bool darkMode;
  final ValueChanged<bool> onDarkModeChanged;

  const ProfileScreen({
    Key? key,
    required this.userEmail,
    required this.historyCount,
    required this.darkMode,
    required this.onDarkModeChanged,
  }) : super(key: key);

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _crawlSpeed = 'Deep Research';
  bool _telemetryEnabled = false;
  bool _pinLockEnabled = true;

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
              Icon(Icons.person_outline, color: DesignSystem.mint, size: 24),
              SizedBox(width: 8),
              Text(
                'Observer Profile',
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
            'Configure active crawlers, secure indices, local preferences.',
            style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
          ),
          SizedBox(height: 24),
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? DesignSystem.darkCard : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: DesignSystem.mint.withOpacity(0.12),
                  child: Text(
                    widget.userEmail.isNotEmpty ? widget.userEmail[0].toUpperCase() : 'M',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: DesignSystem.mintAccent,
                    ),
                  ),
                ),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Verified Professional Observer',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 2),
                      Text(
                        widget.userEmail,
                        style: GoogleFonts.jetBrainsMono(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: DesignSystem.mint.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'PRO',
                    style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: DesignSystem.mintAccent),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 24),
          Text(
            'WEB RUNTIME PREFERENCES',
            style: GoogleFonts.jetBrainsMono(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
          ),
          SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(
              color: isDark ? DesignSystem.darkCard : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
            ),
            child: Column(
              children: [
                ListTile(
                  title: Text('Interface Theme Mode', style: GoogleFonts.inter(fontSize: 12)),
                  trailing: Switch(
                    value: widget.darkMode,
                    activeColor: DesignSystem.mint,
                    onChanged: widget.onDarkModeChanged,
                  ),
                ),
                Divider(height: 1, color: Colors.grey.withOpacity(0.1)),
                ListTile(
                  title: Text('Crawler Speed Density', style: GoogleFonts.inter(fontSize: 12)),
                  trailing: DropdownButton<String>(
                    value: _crawlSpeed,
                    underline: SizedBox(),
                    items: ['Eco', 'Standard', 'Deep Research']
                        .map((String val) => DropdownMenuItem(
                              value: val,
                              child: Text(val, style: GoogleFonts.inter(fontSize: 12)),
                            ))
                        .toList(),
                    onChanged: (String? val) {
                      if (val != null) setState(() => _crawlSpeed = val);
                    },
                  ),
                ),
                Divider(height: 1, color: Colors.grey.withOpacity(0.1)),
                SwitchListTile(
                  title: Text('Anonymous Secure Telemetry', style: GoogleFonts.inter(fontSize: 12)),
                  value: _telemetryEnabled,
                  activeColor: DesignSystem.mint,
                  onChanged: (val) => setState(() => _telemetryEnabled = val),
                ),
                Divider(height: 1, color: Colors.grey.withOpacity(0.1)),
                SwitchListTile(
                  title: Text('System Index Pin-Lock', style: GoogleFonts.inter(fontSize: 12)),
                  value: _pinLockEnabled,
                  activeColor: DesignSystem.mint,
                  onChanged: (val) => setState(() => _pinLockEnabled = val),
                ),
              ],
            ),
          ),
          SizedBox(height: 20),
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? Colors.grey.shade900.withOpacity(0.4) : Colors.grey.shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.withOpacity(0.1)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text('Total Audits Hosted', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                    Text('${widget.historyCount}', style: GoogleFonts.jetBrainsMono(fontSize: 12, fontWeight: FontWeight.bold)),
                  ],
                ),
                SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text('Consensus Rating Delta', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
                    Text('+14.2%', style: GoogleFonts.jetBrainsMono(fontSize: 11, color: DesignSystem.mintAccent, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
