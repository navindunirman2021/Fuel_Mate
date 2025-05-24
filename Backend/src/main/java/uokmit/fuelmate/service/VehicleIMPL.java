package com.uokmit.fuelmate.service.impl;

import com.uokmit.fuelmate.dto.VehicleDTO;
import com.uokmit.fuelmate.Entity.FuelQuota;
import com.uokmit.fuelmate.Entity.User;
import com.uokmit.fuelmate.Entity.Vehicle;
import com.uokmit.fuelmate.Entity.VehicleType;
import com.uokmit.fuelmate.repository.*;
import com.uokmit.fuelmate.service.VehicleService;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleIMPL implements VehicleService {

    private static final Logger logger = LoggerFactory.getLogger(VehicleIMPL.class);

    @Autowired
    private VehicleRepo vehicleRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private VehicleTypeRepository vehicleTypeRepo;

    @Autowired
    private MotorTrafficMockRepo motorTrafficMockRepo;

    @Autowired
    private FuelQuotaRepository fuelQuotaRepository;


    private String generateUniqueQRId(String chassisNumber, String registrationNumber) {
       
        String timestamp = String.valueOf(System.currentTimeMillis());
        String combined = chassisNumber + registrationNumber + timestamp;

        // Generate a hash of the combined string
        return "QR" + Math.abs(combined.hashCode());
    }

    @Transactional
    public String registerVehicle(VehicleDTO vehicleDTO) {
        logger.info("Starting vehicle registration...");

        if (!motorTrafficMockRepo.isVehicleRegistered(vehicleDTO.getChassisNumber())) {
            logger.error("Vehicle not registered in Motor Traffic Department.");
            return "Error: This vehicle is not registered with the Motor Traffic Department.";
        }

        if (vehicleRepo.findByChassisNumber(vehicleDTO.getChassisNumber()).isPresent()) {
            logger.error("Chassis number already exists: {}", vehicleDTO.getChassisNumber());
            return "Error: Chassis number already exists in the system.";
        }

        Optional<Vehicle> existingVehicle = vehicleRepo.findByVehicleRegistrationPart1AndVehicleRegistrationPart2(
                vehicleDTO.getVehicleRegistrationPart1(),
                vehicleDTO.getVehicleRegistrationPart2()
        );

        if (existingVehicle.isPresent()) {
            logger.error("Vehicle registration already exists: {}{}", vehicleDTO.getVehicleRegistrationPart1(), vehicleDTO.getVehicleRegistrationPart2());
            return "Error: Vehicle registration already exists in the system.";
        }

        User user = userRepo.findById(vehicleDTO.getUserId()).orElse(null);
        VehicleType vehicleType = vehicleTypeRepo.findById(vehicleDTO.getVehicleType()).orElse(null);

        boolean isUserVehicleExists = vehicleRepo.existsByUser(user);
        if (isUserVehicleExists) {
            logger.error("User already has a vehicle registered: {}", user);
            return "Error: User already has a vehicle registered.";
        }

        if (user == null || vehicleType == null) {
            logger.error("Invalid user or vehicle type information. User: {}, VehicleType: {}", user, vehicleType);
            return "Error: Invalid user or vehicle type information.";
        }

        String qrId = generateUniqueQRId(
                vehicleDTO.getChassisNumber(),
                vehicleDTO.getVehicleRegistrationPart1() + vehicleDTO.getVehicleRegistrationPart2()
        );

        Vehicle vehicle = new Vehicle(
                vehicleDTO.getId(),
                user,
                vehicleType,
                vehicleDTO.getVehicleRegistrationPart1(),
                vehicleDTO.getVehicleRegistrationPart2(),
                vehicleDTO.getChassisNumber(),
                qrId
        );

        logger.info("Saving vehicle to the database: {}", vehicle);
        vehicleRepo.save(vehicle);

        FuelQuota fuelQuota = new FuelQuota();
        fuelQuota.setVehicle(vehicle);
        fuelQuota.setDefaultQuota(vehicleType.getDefaultQuota()); // Set the default quota from VehicleType
        fuelQuota.setQuotaDate(LocalDate.now()); // Set the current date

        fuelQuotaRepository.save(fuelQuota);

        logger.info("Vehicle registered successfully: {}", vehicle.getChassisNumber());
        return vehicle.getVehicleRegistrationPart1() + vehicle.getVehicleRegistrationPart2();
    }

    public Vehicle getVehicleInfo(Long vehicleId) {
        logger.info("Retrieving vehicle info for vehicle ID: {}", vehicleId);
        return vehicleRepo.findById(vehicleId).orElse(null);
    }

    //remove vehicle
    @Transactional
    public void removeVehicle(Long id) {
        if (vehicleRepo.existsById(id)) {
            fuelQuotaRepository.deleteByVehicleId(id); // Delete related records first
            vehicleRepo.deleteById(id); // Now delete vehicle
        } else {
            throw new RuntimeException("Vehicle not found");
        }
    }

    public Vehicle get(Long id) {
        return vehicleRepo.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle getByQRId(String qrId) {
        try {
            return vehicleRepo.findByQrId(qrId);
        } catch (Exception e) {
            throw new RuntimeException("Vehicle not found");
        }
    }

    @Override
    public List<Vehicle> getAll() {
        return vehicleRepo.findAll();
    }

    @Override
    public Vehicle getByUser(User user) {
        try {
            return vehicleRepo.findFirstByUser(user);
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException("Vehicle not found");
        }
    }

    @Override
    public Vehicle resetQR(Vehicle vehicle) {
        try {
            String qr = generateUniqueQRId(vehicle.getChassisNumber(), vehicle.getVehicleRegistrationPart1() + vehicle.getVehicleRegistrationPart2());
            vehicle.setQrId(qr);
            return vehicleRepo.save(vehicle);
        } catch (Exception e) {
            throw new RuntimeException("Vehicle not found");
        }
    }


}
