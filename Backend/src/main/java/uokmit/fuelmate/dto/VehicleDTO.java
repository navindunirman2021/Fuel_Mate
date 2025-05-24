package com.uokmit.fuelmate.dto;

import com.uokmit.fuelmate.Entity.FuelType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class VehicleDTO {
    @Schema(hidden = true)
    private Long id;

    @NotNull(message = "User Id is mandatory")
    private Long userId;

   @NotNull(message = "Vehicle Type is mandatory")
    private Long vehicleType;

    @NotBlank(message = "Vehicle Registration Part 1 is mandatory")
    private String vehicleRegistrationPart1;

    @NotNull(message = "Vehicle Registration Part 2 is mandatory")
    private Long vehicleRegistrationPart2;

    @NotBlank(message = "Chassis Number is mandatory")
    private String chassisNumber;

    @NotNull(message = "Fuel Type is mandatory")
    private FuelType fuelType;

    // Constructors, Getters, and Setters...

    public VehicleDTO() {
    }

    public VehicleDTO(Long id, Long userId, Long vehicleType, String vehicleRegistrationPart1,
                      Long vehicleRegistrationPart2, String chassisNumber, FuelType fuelType) {
        this.id = id;
        this.userId = userId;
        this.vehicleType = vehicleType;
        this.vehicleRegistrationPart1 = vehicleRegistrationPart1;
        this.vehicleRegistrationPart2 = vehicleRegistrationPart2;
        this.chassisNumber = chassisNumber;
        this.fuelType = fuelType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(Long vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleRegistrationPart1() {
        return vehicleRegistrationPart1;
    }

    public void setVehicleRegistrationPart1(String vehicleRegistrationPart1) {
        this.vehicleRegistrationPart1 = vehicleRegistrationPart1;
    }

    public Long getVehicleRegistrationPart2() {
        return vehicleRegistrationPart2;
    }

    public void setVehicleRegistrationPart2(Long vehicleRegistrationPart2) {
        this.vehicleRegistrationPart2 = vehicleRegistrationPart2;
    }

    public String getChassisNumber() {
        return chassisNumber;
    }

    public void setChassisNumber(String chassisNumber) {
        this.chassisNumber = chassisNumber;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }
}