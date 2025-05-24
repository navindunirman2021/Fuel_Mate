package com.uokmit.fuelmate.controller;

import com.uokmit.fuelmate.Entity.Employee;
import com.uokmit.fuelmate.Entity.FuelStation;
import com.uokmit.fuelmate.Entity.Vehicle;
import com.uokmit.fuelmate.service.EmployeeService;
import com.uokmit.fuelmate.service.FuelStationService;
import com.uokmit.fuelmate.service.FuelTransactionService;
import com.uokmit.fuelmate.response.SuccessResponse;
import com.uokmit.fuelmate.service.impl.VehicleIMPL;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/report")
@Tag(name = "Reports", description = "Reports API")
public class ReportController {

    private FuelStationService fuelStationService;
    private VehicleIMPL vehicleIMPL;

    private EmployeeService employeeService;

    private FuelTransactionService fuelTransactionService;

    public ReportController(FuelStationService fuelStationService, VehicleIMPL vehicleIMPL, EmployeeService employeeService, FuelTransactionService fuelTransactionService) {
        this.fuelStationService = fuelStationService;
        this.vehicleIMPL = vehicleIMPL;
        this.employeeService = employeeService;
        this.fuelTransactionService = fuelTransactionService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'STATION_MANAGER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getDashboardInfo() {
        List<FuelStation> fuelStations = fuelStationService.getAllFuelStations();
        List<Employee> employee = employeeService.getAllEmployees();
        List<Vehicle> vehicle = vehicleIMPL.getAll();
        HashMap<String, Object> data = new HashMap<>();

        data.put("station", fuelStations.size());
        data.put("vehicle", vehicle.size());
        data.put("employee", employee.size());

        try {
            data.put("todayUsedFuelAmount", fuelTransactionService.getTodayTransaction());
        } catch (Exception e) {
            data.put("todayUsedFuelAmount", 0);
        }
        try {
            data.put("todayTransaction", fuelTransactionService.getTodayTransactionObj());
        } catch (Exception e) {
            data.put("todayTransaction", new ArrayList());
        }
        try {
            data.put("weeklyReport", fuelTransactionService.getCurrentWeekReport());
        } catch (Exception e) {
            data.put("weeklyReport", new ArrayList());
        }

        SuccessResponse successResponse = new SuccessResponse(
                "Admins retrieved successfully",
                true,
                data
        );

        return ResponseEntity.ok(successResponse);
    }

}
