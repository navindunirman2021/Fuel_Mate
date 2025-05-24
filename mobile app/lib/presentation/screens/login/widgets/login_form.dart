import 'package:get/get.dart';
import '../login_controller.dart';
import '../../home/home_screen.dart';
import '../../shared/app_dialog.dart';
import 'package:flutter/material.dart';
import '../../shared/primary_button.dart';
import '../../../../core/constants/app_colors.dart';

// LoginForm widget that displays a login form with phone number and password inputs
class LoginForm extends StatefulWidget {
   // Injecting the LoginController instance for managing login logic
  final LoginController controller;

  const LoginForm({
    super.key,
    required this.controller,
  });

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  // validate the form inputs
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;
  
  Future<void> _handleLogin() async {
    // Validate the form fields (phone number and password)
    if (_formKey.currentState?.validate() ?? false) {
      try {
        final result = await widget.controller.login();
        print("Login result: $result");
        
        if (result) {
          if (mounted) {
            Get.offAll(() => HomeScreen());
            AppDialog.showSuccess(
              message: 'Login successful!',
              onConfirm: () {
                Get.back();
              },
            );
          }
        } else if (widget.controller.error != null && mounted) {
          // Show error message if login failed
          AppDialog.showError(
            message: widget.controller.error!,
          );
        }
      } catch (e) {
        // Catch unexpected errors during login
        print("Error during login: $e");
        if (mounted) {
          AppDialog.showError(
            message: 'An unexpected error occurred. Please try again later.',
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextFormField(
            controller: widget.controller.phoneNumberController,// Controlled by GetX controller
            decoration: InputDecoration(
              labelText: 'Phone Number',
              hintText: 'Enter your phone number',
              prefixIcon: Icon(Icons.phone_outlined, color: AppColors.accent),
              labelStyle: TextStyle(color: AppColors.accent),
              hintStyle: TextStyle(color: Colors.grey),
              filled: true,
              fillColor: AppColors.darkSurface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide(color: AppColors.accent, width: 1),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide(color: Colors.red, width: 1),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide(color: Colors.red, width: 1),
              ),
              errorStyle: TextStyle(color: Colors.red[300]),
            ),
            style: TextStyle(color: Colors.white),
            keyboardType: TextInputType.number,
            textInputAction: TextInputAction.next,
            validator: (value) {
              if (value?.isEmpty ?? true) return 'Phone number is required';
              if (value!.length < 10)
                return 'Phone number must be at least 10 characters';
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: widget.controller.passwordController,
            obscureText: _obscurePassword,
            decoration: InputDecoration(
              labelText: 'Password',
              hintText: 'Enter your password',
              prefixIcon: Icon(Icons.lock_outline, color: AppColors.accent),
              labelStyle: TextStyle(color: AppColors.accent),
              hintStyle: TextStyle(color: Colors.grey),
              filled: true,
              fillColor: AppColors.darkSurface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide(color: AppColors.accent, width: 1),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide(color: Colors.red, width: 1),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide(color: Colors.red, width: 1),
              ),
              errorStyle: TextStyle(color: Colors.red[300]),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility : Icons.visibility_off,
                  color: AppColors.accent,
                ),
                onPressed: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
              ),
            ),
            style: TextStyle(color: Colors.white),
            textInputAction: TextInputAction.done,
            validator: (value) {
              if (value?.isEmpty ?? true) return 'Password is required';
              if (value!.length < 6) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: 24),
          Theme(
            data: Theme.of(context).copyWith(
              elevatedButtonTheme: ElevatedButtonThemeData(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  foregroundColor: Colors.black,
                  padding: EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
              ),
            ),
            child: Obx(() => PrimaryButton(
              text: 'Login',
              onPressed: _handleLogin,
              isLoading: widget.controller.isLoading,
            )),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    // Do not dispose controllers here because they are managed by GetX lifecycle
    super.dispose();
  }
}
