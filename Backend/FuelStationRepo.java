package com.uokmit.fuelmaster.repository;

import com.uokmit.fuelmaster.Entity.FuelStation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuelStationRepo extends JpaRepository<FuelStation, Long> {
    boolean existsByRegNo(String regNo);
    boolean existsByOwnerId(Long ownerId);

    Optional<FuelStation> findById(Long id);

    Optional<FuelStation> findByOwnerId(Long id);
}