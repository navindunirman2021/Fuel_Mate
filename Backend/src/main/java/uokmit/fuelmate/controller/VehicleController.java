package com.uokmit.fuelmate.controller;

import com.uokmit.fuelmate.dto.VehicleDTO;
import com.uokmit.fuelmate.dto.VehicleInfoDTO;
import com.uokmit.fuelmate.Entity.User;
import com.uokmit.fuelmate.Entity.Vehicle;
import com.uokmit.fuelmate.Entity.VehicleType;
import com.uokmit.fuelmate.response.ErrorResponse;
import com.uokmit.fuelmate.response.SuccessResponse;
import com.uokmit.fuelmate.service.impl.VehicleIMPL;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/vehicle")
@Tag(name = "Vehicle", description = "Vehicle API")
@SecurityRequirement(name = "bearerAuth")
public class VehicleController {
    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);

    @Autowired
    private VehicleIMPL vehicleIMPL;

    @PostMapping("/save")
    @PreAuthorize("hasAnyRole('USER','SUPER_ADMIN')")
    public ResponseEntity<?> saveVehicle(@Valid @RequestBody VehicleDTO vehicleDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Define the expected field order
            List<String> fieldOrder = Arrays.asList("userId", "vehicleType", "vehicleRegistrationPart1", "vehicleRegistrationPart2", "chassisNumber", "fuelType");

            // Get the first occurring field error based on the expected order
            for (String field : fieldOrder) {
                Optional<String> errorMessage = bindingResult.getFieldErrors().stream()
                        .filter(error -> error.getField().equals(field))
                        .map(FieldError::getDefaultMessage)
                        .findFirst();

                if (errorMessage.isPresent()) {
                    ErrorResponse errorResponse = new ErrorResponse(400, errorMessage.get());
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
        }
        logger.info("Received request to save vehicle: {}", vehicleDTO);

        try {
            // Call the service to register the vehicle
            String registrationMessage = vehicleIMPL.registerVehicle(vehicleDTO);

            // Handle error messages returned by the service
            if (registrationMessage.startsWith("Error:")) {
                logger.error("Vehicle registration failed: {}", registrationMessage);
                ErrorResponse errorResponse = new ErrorResponse(400, registrationMessage);
                return ResponseEntity.badRequest().body(errorResponse); // Return 400 with error message
            }

            // Return success message
            logger.info("Vehicle registered successfully: {}", registrationMessage);
            SuccessResponse successResponse = new SuccessResponse(
                    "Vehicle registered successfully",
                    true,
                    null
            );
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            // Log and handle unexpected errors
            logger.error("An error occurred while saving the vehicle: {}", e.getMessage(), e);
            ErrorResponse errorResponse = new ErrorResponse(500, "An error occurred while saving the vehicle");
            return ResponseEntity.badRequest().body(errorResponse);
        }


    }

    @GetMapping("/{vehicleId}/info")
    @PreAuthorize("hasAnyRole('USER','SUPER_ADMIN')")
    public ResponseEntity<?> getVehicleInfo(@PathVariable Long vehicleId) {
        logger.info("Received request to get vehicle info for vehicle ID: {}", vehicleId);
        Vehicle vehicle = vehicleIMPL.getVehicleInfo(vehicleId);

        if (vehicle == null) {
            logger.error("No vehicle found for ID: {}", vehicleId);
            return ResponseEntity.status(404).body(new ErrorResponse(404, "Vehicle not found with ID: " + vehicleId));
        }

        User user = vehicle.getUser ();
        VehicleType vehicleType = vehicle.getVehicleType();

        VehicleInfoDTO vehicleInfo = new VehicleInfoDTO();
        vehicleInfo.setUserFullName(user.getFirstName() + " " + user.getLastName());
        vehicleInfo.setUserPhone(user.getPhone());
        vehicleInfo.setUserNic(user.getNic());
        vehicleInfo.setVehicleNumber(vehicle.getVehicleRegistrationPart1() + vehicle.getVehicleRegistrationPart2());
        vehicleInfo.setVehicleType(vehicleType.getVehicleType());
        vehicleInfo.setFuelType(vehicleType.getFuelType().name()); // Assuming FuelType is an enum
        vehicleInfo.setChassisNumber(vehicle.getChassisNumber());

        logger.info("Vehicle info retrieved successfully for vehicle ID: {}", vehicleId);
        SuccessResponse successResponse = new SuccessResponse(
                "Vehicle info retrieved successfully",
                true,
                vehicleInfo
        );

        return ResponseEntity.ok(successResponse);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> removeVehicle(@PathVariable Long id) {
        try {
            vehicleIMPL.removeVehicle(id);
            return ResponseEntity.ok(new SuccessResponse("Vehicle deleted successfully", true, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        }
    }


}

