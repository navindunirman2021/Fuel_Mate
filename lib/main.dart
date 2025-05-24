import 'package:get/get.dart';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'dart:io';
import 'presentation/theme/app_theme.dart';
import 'core/services/storage_service.dart';
import 'presentation/screens/login/login_screen.dart';
import 'package:pumper_mobile_app/core/utils/date_time_util.dart';
import 'package:pumper_mobile_app/core/services/auth_service.dart';
import 'package:pumper_mobile_app/core/utils/network_util.dart';
import 'package:pumper_mobile_app/core/services/api_service.dart';
import 'package:pumper_mobile_app/presentation/screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  DateTimeUtils.initTimeZone();

  // Initialize services
  final storageService = StorageService();
  await storageService.init();

  // Test server connectivity
  final baseUrl = ApiService.baseUrl;
  bool isServerReachable = false;
  
  try {
    // Test ping to server IP address first
    final String serverIp = '10.0.2.2'; // Android emulator for localhost
    
    try {
      final result = await InternetAddress.lookup(serverIp);
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
        print("Ping to $serverIp successful");
      }
    } on SocketException catch (e) {
      print("Ping to $serverIp failed: $e");
    }
    
    // Now test API endpoint
    isServerReachable = await NetworkUtil.isServerReachable(baseUrl);
    print("Server reachable: $isServerReachable");
    
    if (!isServerReachable) {
      print("Testing all alternative endpoints...");
      isServerReachable = await NetworkUtil.testAllEndpoints();
      print("Alternative endpoint test result: $isServerReachable");
    }
  } catch (e) {
    print("Error testing server connectivity: $e");
  }

  final token = storageService.getString('token');
  bool isLoggedIn = false;
  
  if (token != null) {
    final authService = AuthService();
    isLoggedIn = await authService.signInWithToken();
    if (!isLoggedIn) {
      storageService.remove('token');
    }
  }

  runApp(MyApp(isLoggedIn: isLoggedIn, isServerReachable: isServerReachable));
}

class MyApp extends StatelessWidget {
  final bool isLoggedIn;
  final bool isServerReachable;
  const MyApp({super.key, required this.isLoggedIn, required this.isServerReachable});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );
    return GetMaterialApp(
      title: 'Fuel Master',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      defaultTransition: Transition.rightToLeftWithFade,
      home: Builder(
        builder: (context) {
          // Show connection error dialog if server is not reachable
          if (!isServerReachable) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              NetworkUtil.showConnectionError(
                context, 
                'Could not connect to the server at ${ApiService.baseUrl}.\n\nPlease make sure your backend server is running and accessible.'
              );
            });
          }
          return isLoggedIn ? HomeScreen() : LoginScreen();
        }
      ),
    );
  }
}
