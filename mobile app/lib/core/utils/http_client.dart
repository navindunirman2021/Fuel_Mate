import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class HttpClient {
  static Dio createDio(String baseUrl) {
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        connectTimeout: const Duration(seconds: 50),
        receiveTimeout: const Duration(seconds: 50),
        sendTimeout: const Duration(seconds: 50),
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // Add CORS headers
          options.headers['Access-Control-Allow-Origin'] = '*';
          return handler.next(options);
        },
        onResponse: (response, handler) {
          return handler.next(response);
        },
        onError: (DioException error, handler) {
          if (kDebugMode) {
            print("🔴 API Error: ${error.message}");
            if (error.response != null) {
              print("Status code: ${error.response?.statusCode}");
              print("Data: ${error.response?.data}");
            }
          }
          return handler.next(error);
        },
      ),
    );

    return dio;
  }
}
