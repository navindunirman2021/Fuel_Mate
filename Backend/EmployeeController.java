package com.uokmit.fuelmaster.controller;

import com.uokmit.fuelmaster.dto.EmployeeViewDetailsDTO;
import com.uokmit.fuelmaster.dto.LoginDTO;
import com.uokmit.fuelmaster.Entity.Admin;
import com.uokmit.fuelmaster.Entity.AdminType;
import com.uokmit.fuelmaster.Entity.Employee;
import com.uokmit.fuelmaster.response.ErrorResponse;
import com.uokmit.fuelmaster.response.SuccessResponse;
import com.uokmit.fuelmaster.service.EmployeeService;
import com.uokmit.fuelmaster.dto.Request.EmployeeDTO;
import com.uokmit.fuelmaster.service.JwtService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/employee")
@Tag(name = "Employee", description = "Employee API")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    private final JwtService jwtService;

    public EmployeeController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // Endpoint to add a new employee to the system.
    @PostMapping(path="/save")
    @PreAuthorize("hasAnyRole('STATION_MANAGER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> saveEmployee(@Valid @RequestBody EmployeeDTO employeeDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Define the expected field order
            List<String> fieldOrder = Arrays.asList("name", "phone", "nic", "password", "fuelStation");

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
        try {
            String name = employeeService.addEmployee(employeeDTO);
            HashMap<String, Object> data = new HashMap<>();
            data.put("employeeName", name);

            SuccessResponse successResponse = new SuccessResponse(
                    "User saved successfully",
                    true,
                    data);
            return ResponseEntity.ok(successResponse);

        } catch (IllegalArgumentException e) { // Catch the specific exception
            ErrorResponse errorResponse = new ErrorResponse(404, e.getMessage());
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    // Endpoint to retrieve a list of employees.
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','STATION_MANAGER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getAllEmployees() {
        Admin admin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Employee> employees = admin.getRole() == AdminType.SUPER_ADMIN?employeeService.getAllEmployees():employeeService.getMyStationEmployees();
        if (!employees.isEmpty()) {
            SuccessResponse successResponse = new SuccessResponse(
                    "Employees retrieved successfully",
                    true,
                    employees
            );

            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "No employees found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    // Endpoint to get a specific employee's details using their phone number.
    @GetMapping("/{phone}")
    @PreAuthorize("hasAnyRole('STATION_MANAGER','SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getEmployeeByPhone(@PathVariable String phone) {
        EmployeeViewDetailsDTO employee = employeeService.getEmployeeByPhone(phone);
        if (employee != null) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", employee);
            SuccessResponse successResponse = new SuccessResponse(
                    "Employee retrieved successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "No Employee Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    // Endpoint for employee login using credentials provided in LoginDTO
    @PostMapping("/login")
    public ResponseEntity<?> loginEmployee(@RequestBody LoginDTO loginDTO) {
        Optional<Employee> employee = employeeService.loginEmployee(loginDTO);
        if (employee.isPresent()) {
            String token = jwtService.generateToken(employee.get(),"EMPLOYEE");
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", employee.get().getCommonData());
            data.put("token", token);
            SuccessResponse response = new SuccessResponse("Successfully logged in.", true, data);
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(new ErrorResponse(401, "Invalid Credentials"));
        }
    }

    // Endpoint to get details of the currently authenticated employee using the JWT token.
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('EMPLOYEE')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getEmployeeByToken(@RequestHeader("Authorization") String bearerToken) {
        final String jwt = bearerToken.substring(7);
        String phone = "";
        try {
            phone = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(new ErrorResponse(401, "Invalid Token"));
        }
        Optional<Employee> employee = employeeService.getEmployee(phone);
        if (employee.isPresent()) {
            String token = jwtService.generateToken(employee.get(),"EMPLOYEE");
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", employee.get().getCommonData());
            data.put("token", token);
            SuccessResponse response = new SuccessResponse("Employee found", true, data);
            return ResponseEntity.ok(response);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "No Employee Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    // Endpoint to delete an employee using their unique ID.
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('STATION_MANAGER','SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        try {
            employeeService.deleteEmployee(id);
            SuccessResponse successResponse = new SuccessResponse(
                    "Employee deleted successfully",
                    true,
                    null
            );
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(400, "This employee cannot be deleted");
            return ResponseEntity.status(400).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

}
