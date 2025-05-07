
import 'package:flutter/material.dart';
import 'package:new_app/view/first_view.dart';
import 'package:new_app/view/si_view.dart';

class DashboardView extends StatelessWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard'), centerTitle: true),
      body: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) {
                      return const FirstView();
                    },
                  ),
                );
              },
              child: const Text('Arithmetic'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) {
                      return const SIView();
                    },
                  ),
                );
              },
              child: const Text('SI'),
            ),
          ],
        ),
      ),
    );
  }
}