import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:pumper_mobile_app/core/services/api_service.dart';

class NetworkUtil {
  static Future<bool> isServerReachable(String url) async {
    try {
      print("Testing connection to: $url");
      final dio = Dio();
      dio.options.connectTimeout = const Duration(seconds: 5);
      dio.options.receiveTimeout = const Duration(seconds: 5);

      // First try with OPTIONS method to check CORS
      try {
        print("Testing OPTIONS request to: $url");
        final optionsResponse = await dio.fetch(
          RequestOptions(
            path: url,
            method: 'OPTIONS',
            headers: {
              'Accept': '*/*',
              'Access-Control-Request-Method': 'GET',
              'Access-Control-Request-Headers': 'content-type',
            },
          ),
        );
        print("OPTIONS response: ${optionsResponse.statusCode}");
      } catch (e) {
        print("OPTIONS request failed: $e");
        // Continue anyway since some servers don't handle OPTIONS correctly
      }

      // Now try a regular GET request
      final response = await dio.get(url);
      print("Connection successful: ${response.statusCode}");
      return response.statusCode == 200;
    } catch (e) {
      print("Connection failed: $e");
      return false;
    }
  }

  static Future<bool> testAllEndpoints() async {
    // List of URLs to test
    final List<String> urlsToTest = [
      // 'http://172.19.43.243:8080/api/v1',
      'http://10.0.2.2:8080/api/v1',
      // 'http://10.0.2.2:8080',
      // 'http://192.168.56.1:8080/api/v1',
      // 'http://localhost:8080/api/v1'
    ];

    for (var url in urlsToTest) {
      try {
        print("Testing endpoint: $url");
        final dio = Dio();
        dio.options.connectTimeout = const Duration(seconds: 5);
        dio.options.receiveTimeout = const Duration(seconds: 5);

        // Try a simple GET request first
        try {
          final response = await dio.get(url);
          print("Connection to $url successful: ${response.statusCode}");
          return true;
        } catch (e) {
          print("GET to $url failed: $e");
        }

        // Try login endpoint next
        try {
          final loginUrl = url.endsWith('/api/v1')
              ? '$url/employee/login'
              : '$url/api/v1/employee/login';

          print("Testing login endpoint: $loginUrl");
          await dio.fetch(
            RequestOptions(
              path: loginUrl,
              method: 'OPTIONS',
              headers: {
                'Accept': '*/*',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'content-type',
              },
            ),
          );
          print("Connection to login endpoint successful");
          return true;
        } catch (e) {
          print("OPTIONS to login endpoint failed: $e");
        }
      } catch (e) {
        print("Testing endpoint $url failed: $e");
      }
    }
    return false;
  }

  static void showConnectionError(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Connection Error'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message),
            const SizedBox(height: 16),
            const Text('Try these steps:'),
            const SizedBox(height: 8),
            const Text('1. Make sure your backend server is running'),
            const Text('2. Check firewall settings'),
            const Text(
              '3. Verify your device can access the server network',
            ),
            const Text('4. Try restarting the app and server'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              testAllEndpoints(); // Test endpoints when dialog is dismissed
            },
            child: const Text('Test All Endpoints'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
