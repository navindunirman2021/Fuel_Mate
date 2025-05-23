import 'package:get/get.dart';
import 'dart:io';
import 'package:flutter/material.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/services/api_service.dart';

class LoginController extends GetxController {
  final AuthService _authService = AuthService();
  final StorageService _storageService = StorageService();
  
  final phoneNumberController = TextEditingController();
  final passwordController = TextEditingController();
  
  final _isLoading = false.obs;
  bool get isLoading => _isLoading.value;
  
  final _error = Rx<String?>(null);
  String? get error => _error.value;
  set error(String? value) => _error.value = value;

  // For testing - fill with known credentials
  void prefillTestCredentials() {
    phoneNumberController.text = "0702476615";
    passwordController.text = "12345"; // Try a very simple password
  }

  // Try different password encodings
  Future<bool> tryAllPasswordVariants() async {
    _isLoading.value = true;
    error = null;
    
    final phoneNumber = phoneNumberController.text.trim();
    final password = passwordController.text.trim();
    
    // List of different ways the password might be expected
    final passwordVariants = [
      password,                         // As-is
      password.toLowerCase(),           // Lowercase
      password.toUpperCase(),           // Uppercase
    ];
    
    for (var variant in passwordVariants) {
      print("Trying password variant: ${variant.replaceAll(RegExp(r'.'), '*')}");
      
      try {
        final success = await _authService.signInWithEmailAndPassword(
          phoneNumber,
          variant,
        );
        
        if (success) {
          _isLoading.value = false;
          return true;
        }
      } catch (e) {
        print("Error with variant: $e");
      }
    }
    
    error = 'All login attempts failed. Please check your credentials or contact support.';
    _isLoading.value = false;
    return false;
  }

  Future<bool> login() async {
    if (!_validateInput()) return false;

    _isLoading.value = true;
    error = null;

    try {
      final phoneNumber = phoneNumberController.text.trim();
      final password = passwordController.text.trim();
      
      print("Attempting login with phone: $phoneNumber, password: ${password.replaceAll(RegExp(r'.'), '*')}");
      
      final success = await _authService.signInWithEmailAndPassword(
        phoneNumber,
        password,
      );

      if (!success) {
        error = 'Invalid phone number or password. Please check your credentials.';
        print("Login failed: Invalid credentials");
      } else {
        print("Login successful");
      }
      
      _isLoading.value = false;
      return success;
    } on SocketException catch (e) {
      _isLoading.value = false;
      error = 'Network error: Could not connect to the server. Please check your internet connection.';
      print("Login socket exception: ${e.message}");
      return false;
    } catch (e) {
      _isLoading.value = false;
      error = 'An error occurred: ${e.toString()}';
      print("Login exception: $e");
      return false;
    }
  }

  bool _validateInput() {
    if (phoneNumberController.text.isEmpty || passwordController.text.isEmpty) {
      error = 'Please fill in all fields';
      return false;
    }
    
    if (phoneNumberController.text.length < 10) {
      error = 'Please enter a valid phone number';
      return false;
    }
    
    if (passwordController.text.length < 6) {
      error = 'Password must be at least 6 characters';
      return false;
    }
    
    return true;
  }

  // Show network connectivity dialog
  void showNetworkError(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Connection Error'),
        content: Text('Could not connect to server at ${ApiService.baseUrl}.\n\nPlease check:\n1. Your internet connection\n2. The backend server is running\n3. Server address is correct'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void onClose() {
    phoneNumberController.dispose();
    passwordController.dispose();
    super.onClose();
  }
} 