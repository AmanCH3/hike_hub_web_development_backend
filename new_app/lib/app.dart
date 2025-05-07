
import 'package:flutter/material.dart';
import 'package:new_app/view/dashboard_view.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: DashboardView());
  }
}