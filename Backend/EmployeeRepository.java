package com.uokmit.fuelmaster.repository;

import com.uokmit.fuelmaster.Entity.Employee;
import com.uokmit.fuelmaster.Entity.FuelStation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByPhone(String phone);

    Optional<Employee> findByNic(String nic);

    List<Employee> findByFuelStation(FuelStation id);

//    Find an employee by matching both phone number and password.
    Optional<Employee> findOneByPhoneAndPassword(String phone, String password);

    void deleteByFuelStationId(Long id);

    List<Employee> findAllByFuelStation( FuelStation fuelStation);
}
