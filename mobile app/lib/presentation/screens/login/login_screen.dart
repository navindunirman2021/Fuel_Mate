import 'login_controller.dart';
import 'widgets/login_form.dart';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_assets.dart';
import '../../../core/constants/app_text_styles.dart';

class LoginScreen extends StatelessWidget {
  final LoginController controller = LoginController();
  // Create an instance of LoginController to manage login state and logic
  LoginScreen({super.key});
  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBackground, // Set background color from app constants
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 48),
              Image.asset(
                'assets/fuelmate.png',
                height: 120,
              ),
              const SizedBox(height: 24),

              const SizedBox(height: 48),
               // Pass the controller instance to handle login logic and state
              LoginForm(controller: controller),
            ],
          ),
        ),
      ),
    );
  }
} 
