import 'package:pumper_mobile_app/core/services/api_service.dart';
import 'package:pumper_mobile_app/domain/repositories/user_repository.dart';
import 'package:flutter/foundation.dart';

class UserRepositoryImpl implements UserRepository {
  final ApiService _apiService = ApiService();

  @override
  Future<Map<String,dynamic>?> getUser() async{
    try {
      final response = await _apiService.get('/employee/me');
      print("getUser response: $response");
      
      if (response != null && response['status'] == 200 && response['data'] != null) {
        return response['data'];
      }
      
      if (response != null && response['status'] != 200) {
        print("getUser error status: ${response['status']}, message: ${response['message']}");
      }
      
      return null;
    } catch (e) {
      print("getUser exception: $e");
      return null;
    }
  }
  
  @override
  Future<Map<String,dynamic>?> signInWithEmailAndPassword(String phoneNumber, String password) async{
    try {
      // Try with simple structure first
      final simplePayload = {
        'phone': phoneNumber,
        'password': password,
      };
      
      if (kDebugMode) {
        print("🟢 Attempting login with simple payload: $simplePayload");
      }
      
      final response = await _apiService.post('/employee/login', simplePayload);
      print("signIn response: $response");
      
      if (kDebugMode) {
        print("signIn response: $response");
      }
      
      if (response != null && response['status'] == 200 && response['data'] != null) {
        return response['data'];
      }
      
      if (response != null && response['status'] != 200) {
        print("signIn error status: ${response['status']}, message: ${response['message']}");
      }
      
      return null;
    } catch (e) {
      print("signIn exception: $e");
      return null;
    }
  }
}
