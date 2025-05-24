package com.uokmit.fuelmate.service;

import com.uokmit.fuelmate.dto.EmployeeViewDetailsDTO;
import com.uokmit.fuelmate.dto.LoginDTO;
import com.uokmit.fuelmate.dto.Request.EmployeeDTO;
import com.uokmit.fuelmate.Entity.Admin;
import com.uokmit.fuelmate.Entity.AdminType;
import com.uokmit.fuelmate.Entity.Employee;
import com.uokmit.fuelmate.Entity.FuelStation;
import com.uokmit.fuelmate.repository.EmployeeRepository;
import com.uokmit.fuelmate.repository.FuelStationRepo;
import com.uokmit.fuelmate.util.PasswordUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepo;
    @Autowired
    private FuelStationRepo fuelStationRepo;

//    Adds a new employee to the system.
//    Checks for duplicate NIC and phone number.
//    Hashes the password before saving.
//    Associates the employee with the fuel station of the currently logged-in admin.
    public String addEmployee(EmployeeDTO employeeDTO) {
        // Check if NIC already exists
            Optional<Employee> existingEmployeeByNIC = employeeRepo.findByNic(employeeDTO.getNic());
            Optional<Employee> existingEmployeeByPhone = employeeRepo.findByPhone(employeeDTO.getPhone());
            if (existingEmployeeByPhone.isPresent()) {
                throw new IllegalArgumentException("Phone number already registered: " + employeeDTO.getPhone());
            }
        if (existingEmployeeByNIC.isPresent()) {
            throw new IllegalArgumentException("NIC already registered: " + employeeDTO.getNic());
        }

        Admin admin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Check if Fuel Station exists
        FuelStation fuelStation = fuelStationRepo.findByOwnerId(admin.getId())
                .orElseThrow(() -> new IllegalArgumentException("Fuel Station not found"));

        String hashedPassword = PasswordUtil.hashPassword(employeeDTO.getPassword());
        Employee employee = new Employee(
                null,
                employeeDTO.getName(),
                employeeDTO.getPhone(),
                employeeDTO.getNic(),
                hashedPassword,
                fuelStation,
                null, null);

        employeeRepo.save(employee);
        return employee.getName();

    }

    public List<Employee> getAllEmployees() {
        Admin admin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (admin.getRole() == AdminType.SUPER_ADMIN) {
            return employeeRepo.findAll();
        }
        FuelStation fuelStation = fuelStationRepo.findByOwnerId(admin.getId())
                .orElseThrow(() -> new IllegalArgumentException("Fuel Station not found"));
        return employeeRepo.findAllByFuelStation(fuelStation);
    }
    public List<Employee> getMyStationEmployees() {
        Admin admin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        FuelStation fuelStation = fuelStationRepo.findByOwnerId(admin.getId())
                .orElseThrow(() -> new IllegalArgumentException("Fuel Station not found"));
        return employeeRepo.findByFuelStation(fuelStation);
    }

    public EmployeeViewDetailsDTO getEmployeeByPhone(String phone) {
        Optional<Employee> employeeOptional = employeeRepo.findByPhone(phone);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            return new EmployeeViewDetailsDTO(
                    employee.getName(),
                    employee.getPhone(),
                    employee.getNic());
        } else {
            return null;
        }
    }
    public Optional<Employee> getEmployee(String id) {
        Optional<Employee> employeeOptional = employeeRepo.findById(Long.parseLong(id));
        return employeeOptional;
    }

    public Optional<Employee> loginEmployee(LoginDTO loginDTO) {
        Optional<Employee> employee = employeeRepo.findByPhone(loginDTO.getPhone());
        if (employee.isPresent()) {
            String inputPassword = loginDTO.getPassword();
            String storedPassword = employee.get().getPassword();
            if (PasswordUtil.verifyPassword(inputPassword, storedPassword)) {
                return employee;
            }
        }
        return Optional.empty();
    }

    public void deleteEmployee(String id) {
        employeeRepo.deleteById(Long.parseLong(id));
    }
}
