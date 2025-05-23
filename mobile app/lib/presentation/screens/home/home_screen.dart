import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:pumper_mobile_app/core/constants/app_colors.dart';
import 'package:pumper_mobile_app/data/models/fuel_transaction_model.dart';
import 'package:pumper_mobile_app/presentation/screens/home/home_controller.dart';
import 'package:pumper_mobile_app/presentation/screens/shared/primary_button.dart';
import 'package:pumper_mobile_app/presentation/screens/home/widgets/app_drawer.dart';
import 'package:pumper_mobile_app/presentation/screens/home/widgets/summary_card.dart';
import 'package:pumper_mobile_app/presentation/screens/qr_scanner/qr_scanner_screen.dart';
import 'package:pumper_mobile_app/presentation/screens/home/widgets/fuel_transaction_card.dart';

class HomeScreen extends StatelessWidget {
  HomeScreen({super.key});

  RxList<FuelTransactionModel> transactions = <FuelTransactionModel>[].obs;
  final homeController = HomeController();

  Future<void> _openQRScanner(BuildContext context) async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (context) => const QRScannerScreen(),
      ),
    );

    if (result != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Scanned QR Code: $result'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    RxDouble totalFuelAmount = 0.0.obs;
    void getTransactions() async {
      List<FuelTransactionModel> transactionsList =
          await homeController.getFuelTransactions();
      double totalFuelAmountTmp = 0;
      for (var transaction in transactionsList) {
        totalFuelAmountTmp += transaction.pumpedQuantity;
      }
      print(totalFuelAmountTmp);

      totalFuelAmount.value = totalFuelAmountTmp;
      transactions.value = transactionsList;
    }

    getTransactions();
    return Scaffold(
      backgroundColor: AppColors.darkBackground,
      appBar: AppBar(
        backgroundColor: AppColors.darkBackground,
        elevation: 0,
        title: Text(
          "Dashboard",
          style: TextStyle(
            color: AppColors.accent,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          Builder(
            builder: (context) => IconButton(
              icon: Icon(Icons.menu, color: AppColors.accent),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            ),
          )
        ],
        centerTitle: false,
      ),
      drawer: const AppDrawer(),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Obx(() {
                      return SummaryCard(
                        title: "Today Used Fuel",
                        value: "${totalFuelAmount.value.toStringAsFixed(2)} L",
                        icon: Icons.local_gas_station,
                        color: AppColors.accent,
                      );
                    }),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Obx(() {
                      return SummaryCard(
                        title: "Last Fuel Amount",
                        value: "${transactions.isNotEmpty ? transactions[0].pumpedQuantity.toStringAsFixed(2) : 0} L",
                        icon: Icons.history,
                        color: AppColors.accent,
                      );
                    }),
                  ),
                ],
              ),

              const SizedBox(height: 16),
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
                child: PrimaryButton(
                  onPressed: () => _openQRScanner(context),
                  text: "Scan QR",
                ),
              ),
              const SizedBox(height: 24),
              Text(
                "Recent Activity",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.accent,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: Obx(() {
                  if (transactions.isEmpty) {
                    return Center(
                      child: Text(
                        "No transactions recorded today",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 16,
                        ),
                      ),
                    );
                  }
                  return ListView.builder(
                    itemCount: transactions.length,
                    itemBuilder: (context, index) {
                      return FuelTransactionCard(
                        transactionNumber: transactions[index].id,
                        vehicleNumber: transactions[index].vehicleNumber,
                        fuelAmount: transactions[index].pumpedQuantity,
                        timestamp:
                            DateTime.parse(transactions[index].transactionDate),
                      );
                    },
                  );
                }),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openQRScanner(context),
        backgroundColor: AppColors.accent,
        child: const Icon(Icons.qr_code_scanner, color: Colors.black),
      ),
    );
  }
}
