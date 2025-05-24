package com.uokmit.fuelmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uokmit.fuelmate.Entity.FuelType;
import com.uokmit.fuelmate.Entity.VehicleType;

import java.util.Optional;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {
    Optional<VehicleType> findByVehicleTypeAndFuelType(String vehicleType, FuelType fuelType);
}
