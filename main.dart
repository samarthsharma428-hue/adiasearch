/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';
import 'screens/compare_screen.dart';
import 'screens/fact_check_screen.dart';
import 'screens/history_screen.dart';
import 'screens/profile_screen.dart';
import 'models/search_result.dart';
import 'components/design_system.dart';

void main() {
  runApp(const AdiaSearchApp());
}

class AdiaSearchApp extends StatefulWidget {
  const AdiaSearchApp({Key? key}) : super(key: key);

  @override
  State<AdiaSearchApp> createState() => _AdiaSearchAppState();
}

class _AdiaSearchAppState extends State<AdiaSearchApp> {
  bool _darkMode = true;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AdiaSearch',
      debugShowCheckedModeBanner: false,
      themeMode: _darkMode ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: DesignSystem.lightBg,
        primaryColor: DesignSystem.mint,
        cardColor: Colors.white,
        colorScheme: const ColorScheme.light(
          primary: DesignSystem.mint,
          secondary: DesignSystem.indigo,
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: DesignSystem.darkBg,
        primaryColor: DesignSystem.mint,
        cardColor: DesignSystem.darkCard,
        colorScheme: const ColorScheme.dark(
          primary: DesignSystem.mint,
          secondary: DesignSystem.indigo,
          background: DesignSystem.darkBg,
          surface: DesignSystem.darkCard,
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        useMaterial3: true,
      ),
      home: MainNavigationContainer(
        darkMode: _darkMode,
        onDarkModeChanged: (val) {
          setState(() {
            _darkMode = val;
          });
        },
      ),
    );
  }
}

class MainNavigationContainer extends StatefulWidget {
  final bool darkMode;
  final ValueChanged<bool> onDarkModeChanged;

  const MainNavigationContainer({
    Key? key,
    required this.darkMode,
    required this.onDarkModeChanged,
  }) : super(key: key);

  @override
  State<MainNavigationContainer> createState() => _MainNavigationContainerState();
}

class _MainNavigationContainerState extends State<MainNavigationContainer> {
  int _currentIndex = 0;
  final List<SearchResult> _history = [];

  void _addHistoryItem(SearchResult result) {
    setState(() {
      // Avoid duplicated query inserts
      _history.removeWhere((item) => item.query.toLowerCase() == result.query.toLowerCase());
      _history.insert(0, result);
    });
  }

  void _clearHistory() {
    setState(() {
      _history.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Widget> screens = [
      HomeScreen(onSaveHistory: _addHistoryItem),
      const CompareScreen(),
      const FactCheckScreen(),
      HistoryScreen(
        history: _history,
        onClearAll: _clearHistory,
        onSelectResult: (res) {
          // Can redirect or display query feedback in logs
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Restored query: "${res.query}"'),
              backgroundColor: DesignSystem.mint,
            ),
          );
        },
      ),
      ProfileScreen(
        userEmail: "meenudeepak2006@gmail.com",
        historyCount: _history.length,
        darkMode: widget.darkMode,
        onDarkModeChanged: widget.onDarkModeChanged,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: const BoxDecoration(
                color: DesignSystem.mint,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'AdiaSearch',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w950,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        actions: [
          Row(
            children: [
              Container(
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  border: Border.all(color: DesignSystem.mint.withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'FLUTTER ENGINE',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 7,
                    fontWeight: FontWeight.bold,
                    color: DesignSystem.mintAccent,
                  ),
                ),
              ),
            ],
          )
        ],
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: screens[_currentIndex],
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(
              color: isDark ? Colors.grey.shade905 : Colors.grey.shade200,
              width: 1,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          elevation: 0,
          backgroundColor: isDark ? DesignSystem.darkBg : Colors.white,
          selectedItemColor: DesignSystem.mint,
          unselectedItemColor: Colors.grey.shade500,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.bold),
          unselectedLabelStyle: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.medium),
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.compare_arrows),
              activeIcon: Icon(Icons.compare_arrows_rounded),
              label: 'Research',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.gavel_outlined),
              activeIcon: Icon(Icons.gavel),
              label: 'Fact Check',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history_outlined),
              activeIcon: Icon(Icons.history_rounded),
              label: 'History',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_pin_outlined),
              activeIcon: Icon(Icons.person_pin),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
