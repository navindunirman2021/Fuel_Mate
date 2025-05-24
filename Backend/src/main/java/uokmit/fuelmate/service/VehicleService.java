package com.uokmit.fuelmate.service;

import com.uokmit.fuelmate.dto.VehicleDTO;
import com.uokmit.fuelmate.Entity.User;
import com.uokmit.fuelmate.Entity.Vehicle;

import java.util.List;

public interface VehicleService {

    String registerVehicle(VehicleDTO vehicleDTO);

    Vehicle get(Long vehicleId);

    Vehicle getByQRId(String qrId);

    List<Vehicle> getAll();

    Vehicle resetQR(Vehicle vehicle);

    Vehicle getByUser(User user);
}