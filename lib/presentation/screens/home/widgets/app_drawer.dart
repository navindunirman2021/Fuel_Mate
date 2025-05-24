import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:pumper_mobile_app/core/constants/app_colors.dart';
import 'package:pumper_mobile_app/core/services/auth_service.dart';
import 'package:pumper_mobile_app/presentation/screens/login/login_screen.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authService = AuthService();
    final user = authService.currentUser;

    // If no user is logged in, show a basic drawer
    if (user == null) {
      return Drawer(
        backgroundColor: AppColors.darkBackground,
        child: Center(
          child: Text(
            'No user logged in',
            style: TextStyle(color: Colors.white),
          ),
        ),
      );
    }

    return Drawer(
      backgroundColor: AppColors.darkBackground,
      child: Column(
        children: [
          // Drawer Header with gradient background
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.darkSurface,
              border: Border(
                bottom: BorderSide(
                  color: AppColors.accent.withOpacity(0.2),
                  width: 1,
                ),
              ),
            ),
            child: SafeArea(
              bottom: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 35,
                    backgroundColor: AppColors.accent.withOpacity(0.2),
                    child: Icon(
                      Icons.person,
                      size: 40,
                      color: AppColors.accent,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Text(
                    user.name.capitalizeFirst ?? '',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Row(
                    children: [
                      Text(
                        '${user.fuelStationLocation.capitalizeFirst ?? ''} Station',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Operator',
                          style: TextStyle(
                            color: AppColors.accent,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          // User Details
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _buildDetailItem(
                  icon: Icons.phone_outlined,
                  label: 'Phone',
                  value: user.phone,
                ),
                const SizedBox(height: 16),
                _buildDetailItem(
                  icon: Icons.credit_card_outlined,
                  label: 'NIC',
                  value: user.nic,
                ),
                const SizedBox(height: 16),
                _buildDetailItem(
                  icon: Icons.location_on_outlined,
                  label: 'Station',
                  value: user.fuelStationLocation,
                ),
              ],
            ),
          ),
          const Spacer(),
          // Logout Button
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Divider(color: Colors.grey.withOpacity(0.3)),
                ListTile(
                  leading: Icon(
                    Icons.logout_rounded,
                    color: Colors.red[300],
                  ),
                  title: Text(
                    'Logout',
                    style: TextStyle(
                      color: Colors.red[300],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  onTap: () {
                    authService.signOut();
                    Get.offAll(() => LoginScreen());
                  },
                ),
                const SizedBox(height: 8),
                Text(
                  'Version 1.0.0',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailItem({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 20,
          color: AppColors.accent,
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(
                color: Colors.grey[500],
                fontSize: 12,
              ),
            ),
            Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ],
    );
  }
} 