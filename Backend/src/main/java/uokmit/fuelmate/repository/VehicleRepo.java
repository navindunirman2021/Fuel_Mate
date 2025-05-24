package com.uokmit.fuelmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import com.uokmit.fuelmate.Entity.User;
import com.uokmit.fuelmate.Entity.Vehicle;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface VehicleRepo extends JpaRepository<Vehicle, Long> {
   Optional<Vehicle> findByChassisNumber(String chassisNumber);


    Optional<Vehicle> findByVehicleRegistrationPart1AndVehicleRegistrationPart2(String part1, Long part2);


    Vehicle findByUserId(Long userId);

    Vehicle findByQrId(String qrId);

    Vehicle findFirstByUser(User user);

    boolean existsByUser(User user);

}
