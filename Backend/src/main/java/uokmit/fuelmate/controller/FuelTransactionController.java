package com.uokmit.fuelmate.controller;

import com.uokmit.fuelmate.dto.FuelTransactionDTO;
import com.uokmit.fuelmate.Entity.FuelTransaction;
import com.uokmit.fuelmate.Entity.Vehicle;
import com.uokmit.fuelmate.response.ErrorResponse;
import com.uokmit.fuelmate.response.SuccessResponse;
import com.uokmit.fuelmate.service.FuelTransactionService;
import com.uokmit.fuelmate.service.VehicleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/transactions")
@Tag(name = "Fuel Transaction", description = "Fuel Transaction API")
@SecurityRequirement(name = "bearerAuth")
public class FuelTransactionController {
    private final FuelTransactionService fuelTransactionService;
    private final VehicleService vehicleService;

    public FuelTransactionController(FuelTransactionService fuelTransactionService, VehicleService vehicleService) {
        this.fuelTransactionService = fuelTransactionService;
        this.vehicleService = vehicleService;
    }

    @GetMapping("/employee/today")
    @PreAuthorize("hasAnyRole('STATION_MANAGER','SUPER_ADMIN','EMPLOYEE')")
    public ResponseEntity getEmployeeTransactions() {
        try {
            Object result = fuelTransactionService.getEmployeeTransactions();
            SuccessResponse response = new SuccessResponse("Transactions retrieved successfully", true, result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ErrorResponse response = new ErrorResponse(400, e.getMessage());
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(response);
        }
    }

    @GetMapping("/info/{qrId}")
    @PreAuthorize("hasAnyRole('STATION_MANAGER','SUPER_ADMIN','EMPLOYEE')")
    public ResponseEntity getFuelQuantity(@PathVariable String qrId) {

        try {
            Vehicle vehicle = vehicleService.getByQRId(qrId);
            if(vehicle == null) {
                ErrorResponse response = new ErrorResponse(400, "Vehicle not found. Please check the QR code and try again.");
                return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(response);
            }
            Double usedQuota = fuelTransactionService.getFuelQuantity(vehicle.getId());
            HashMap responseData = new HashMap();
            responseData.put("vehicle", vehicle);
            responseData.put("defaultQuota", vehicle.getVehicleType().getDefaultQuota());
            responseData.put("usedQuota", usedQuota);
            responseData.put("availableQuota", vehicle.getVehicleType().getDefaultQuota() - usedQuota);

            Optional<FuelTransaction> lastTransaction = fuelTransactionService.getLastTransaction(vehicle.getId());
            if (lastTransaction.isPresent()) {
                responseData.put("lastTransaction", lastTransaction.get().getTransactionDate());
            } else {
                responseData.put("lastTransaction", null);
            }
            SuccessResponse response = new SuccessResponse("Vehicle info retrieved successfully", true, responseData);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ErrorResponse response = new ErrorResponse(400, e.getMessage());
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(response);
        }
    }

    @PostMapping("/process")
    @PreAuthorize("hasAnyRole('STATION_MANAGER','SUPER_ADMIN','EMPLOYEE')")
    public ResponseEntity addTransaction(@RequestBody FuelTransactionDTO fuelTransactionDTO) {
        System.out.println("Vehicle ID: " + fuelTransactionDTO);
        try {
            Object result = fuelTransactionService.addFuelTransaction(fuelTransactionDTO.getVehicleId(), fuelTransactionDTO.getPumpedQuantity());
            SuccessResponse response = new SuccessResponse("Transaction added successfully", true, result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Error: " + e);
            ErrorResponse response = new ErrorResponse(400, e.getMessage());
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(response);
        }
    }
}


