import 'package:flutter/material.dart';
import 'package:pumper_mobile_app/core/constants/app_colors.dart';
import 'package:pumper_mobile_app/core/utils/date_time_util.dart';

class FuelTransactionCard extends StatelessWidget {
  final int transactionNumber;
  final String vehicleNumber;
  final double fuelAmount;
  final DateTime timestamp;

  const FuelTransactionCard({
    super.key,
    required this.transactionNumber,
    required this.vehicleNumber,
    required this.fuelAmount,
    required this.timestamp,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      color: AppColors.darkSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppColors.accent,
          child: Icon(Icons.local_gas_station, color: Colors.black),
        ),
        title: Text(
          'Transaction #$transactionNumber',
          style: TextStyle(color: Colors.white),
        ),
        subtitle: Text(
          'Vehicle: $vehicleNumber',
          style: TextStyle(color: Colors.grey[400]),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '${fuelAmount.toStringAsFixed(2)} L',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.accent,
              ),
            ),
            Text(
              '${DateTimeUtils.formatTimestamp12Hour(timestamp)}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[400],
              ),
            ),
          ],
        ),
      ),
    );
  }
} 