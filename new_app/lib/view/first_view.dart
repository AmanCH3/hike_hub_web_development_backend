import 'package:flutter/material.dart';

class FirstView extends StatefulWidget {
  const FirstView({super.key});

  @override
  State<FirstView> createState() => _FirstViewState();
}

class _FirstViewState extends State<FirstView> {
  // int first = 0;
  // int second = 0;
  int result = 0;

  // textEditiingController
  final firstContoller = TextEditingController();
  final secondContoller = TextEditingController();

  // step 1. key
  final myKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Arithmetic View"),
        centerTitle: true,
        backgroundColor: Colors.amber,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Form(
          key: myKey,
          child: Column(
            children: [
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Enter first no',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: Colors.amber, width: 2),
                  ),
                ),
                keyboardType: TextInputType.number,
                controller: firstContoller,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter first number';
                  }
                  return null;
                },
              ),
              SizedBox(height: 8),
              TextFormField(
                decoration: InputDecoration(
                  hintText: 'Enter second no',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: Colors.amber, width: 2),
                  ),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter second number';
                  }
                  return null;
                },
                controller: secondContoller,
              ),
              SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    if (myKey.currentState!.validate()) {
                      // Logic
                      int first = int.parse(firstContoller.text);
                      int second = int.parse(secondContoller.text);
                      setState(() {
                        result = first + second;
                      });
                    }
                  },
                  child: Text("Add"),
                ),
              ),
              SizedBox(height: 8),
              Text(
                "Result : $result",
                style: TextStyle(fontSize: 20, color: Colors.black),
              ),
            ],
          ),
        ),
      ),
    );
  }
}