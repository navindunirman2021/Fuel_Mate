import 'package:dio/dio.dart';
import 'package:pumper_mobile_app/core/services/storage_service.dart';
import 'package:pumper_mobile_app/core/utils/http_client.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  final StorageService _storageService = StorageService();

  static final ApiService _instance = ApiService._internal();
  static String token = '';

  // Multiple base URL options to try
  static const List<String> _baseUrlOptions = [
    // 'http://172.19.43.243:8080/api/v1',
    'http://10.0.2.2:8080/api/v1', // Android emulator special IP for localhost
    // 'http://10.0.2.2:8080',            // Try without /api/v1
    // 'http://192.168.56.1:8080/api/v1',  // IP address from ipconfig
    // 'http://localhost:8080/api/v1', // Local testing
    // 'https://api-fuel-master-fbc37438737d.herokuapp.com/api/v1', // Production/deployed option
  ];

  static int _currentUrlIndex = 0;
  static String get baseUrl => _baseUrlOptions[_currentUrlIndex];

  // Method to try next URL if current one fails
  static void tryNextUrl() {
    if (_currentUrlIndex < _baseUrlOptions.length - 1) {
      _currentUrlIndex++;
      print("Switching to next URL: ${baseUrl}");
      // Recreate dio instance with new URL
      _instance._createDio();
    } else {
      print("All URL options tried without success");
    }
  }

  late Dio _dio;

  Map<String, String> _getHeaders(String endpoint) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (!endpoint.contains('/employee/login')) {
      headers['Authorization'] = 'Bearer $token';
    }
    // Add CORS headers
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return headers;
  }

  void _createDio() {
    _dio = HttpClient.createDio(baseUrl);
  }

  ApiService._internal() {
    _createDio();
    token = _storageService.getString('token') ?? '';
  }

  factory ApiService() {
    return _instance;
  }

  static void setToken(String token) {
    _instance._storageService.setString('token', token);
    ApiService.token = token;
  }

  // Generic GET request
  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      if (kDebugMode) {
        print("🟢 GET REQUEST: ${baseUrl}${endpoint}");
      }

      final response = await _dio.get(
        endpoint,
        options: Options(headers: _getHeaders(endpoint)),
      );

      if (kDebugMode) {
        print("🟢 GET RESPONSE: ${response.statusCode}");
        print("🟢 GET DATA: ${response.data}");
      }

      return response.data;
    } on DioException catch (e) {
      print("=================== Error ===================");
      print("URL: ${baseUrl}${endpoint}");
      print("Status code: ${e.response?.statusCode}");
      print("Error type: ${e.type}");
      print("Error message: ${e.message}");
      print("Response data: ${e.response?.data}");

      // If connection error, try next URL
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.unknown) {
        tryNextUrl();
        // Try again with new URL if available
        if (_currentUrlIndex < _baseUrlOptions.length) {
          return get(endpoint);
        }
      }

      return e.response?.data ??
          {"status": 500, "message": "Network error: ${e.message}"};
    }
  }

  // Generic POST request
  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      if (kDebugMode) {
        print("🟢 POST REQUEST: ${baseUrl}${endpoint}");
        print("🟢 POST BODY: $body");
      }

      // Special handling for login endpoint
      if (endpoint.contains('/employee/login')) {
        return await _handleLogin(endpoint, body);
      }

      final response = await _dio.post(
        endpoint,
        data: body,
        options: Options(headers: _getHeaders(endpoint)),
      );

      if (kDebugMode) {
        print("🟢 POST RESPONSE: ${response.statusCode}");
        print("🟢 POST DATA: ${response.data}");
      }

      return response.data;
    } on DioException catch (e) {
      print("=================== Error ===================");
      print("URL: ${baseUrl}${endpoint}");
      print("Status code: ${e.response?.statusCode}");
      print("Error type: ${e.type}");
      print("Error message: ${e.message}");
      print("Response data: ${e.response?.data}");

      // If connection error, try next URL
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.unknown) {
        tryNextUrl();
        // Try again with new URL if available
        if (_currentUrlIndex < _baseUrlOptions.length) {
          return post(endpoint, body);
        }
      }

      return e.response?.data ??
          {"status": 500, "message": "Network error: ${e.message}"};
    }
  }

  // Special handler for login
  Future<Map<String, dynamic>> _handleLogin(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      // Try different content types and formats
      final options = [
        // Standard JSON
        Options(
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ),
        // Form URL encoded
        Options(
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        ),
        // Multipart form data
        Options(
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        ),
      ];

      DioException? lastError;

      // Try each option
      for (var option in options) {
        try {
          if (kDebugMode) {
            print(
              "🟢 Trying login with content type: ${option.headers?['Content-Type']}",
            );
          }

          final response = await _dio.post(
            endpoint,
            data: body,
            options: option,
          );

          if (kDebugMode) {
            print("🟢 LOGIN SUCCESS with ${option.headers?['Content-Type']}");
            print("🟢 RESPONSE: ${response.data}");
          }

          return response.data;
        } on DioException catch (e) {
          if (kDebugMode) {
            print("🔴 LOGIN FAILED with ${option.headers?['Content-Type']}");
            print("🔴 ERROR: ${e.message}");
          }
          lastError = e;
        }
      }

      // All options failed
      if (lastError != null) {
        throw lastError;
      }

      return {"status": 500, "message": "All login attempts failed"};
    } catch (e) {
      if (kDebugMode) {
        print("🔴 CRITICAL LOGIN ERROR: $e");
      }
      return {"status": 500, "message": "Login error: $e"};
    }
  }

  // Generic PUT request
  Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final response = await _dio.put(
        endpoint,
        data: body,
        options: Options(headers: _getHeaders(endpoint)),
      );
      return response.data;
    } on DioException catch (e) {
      return e.response?.data ??
          {"status": 500, "message": "Network error: ${e.message}"};
    }
  }

  // Generic DELETE request
  Future<Map<String, dynamic>> delete(String endpoint) async {
    try {
      final response = await _dio.delete(
        endpoint,
        options: Options(headers: _getHeaders(endpoint)),
      );
      return response.data;
    } on DioException catch (e) {
      return e.response?.data ??
          {"status": 500, "message": "Network error: ${e.message}"};
    }
  }
}
