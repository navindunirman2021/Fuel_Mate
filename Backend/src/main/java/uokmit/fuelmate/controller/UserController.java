package com.uokmit.fuelmate.controller;


import com.uokmit.fuelmate.dto.LoginDTO;
import com.uokmit.fuelmate.dto.Response.PhoneNumberDTO;
import com.uokmit.fuelmate.Entity.Vehicle;
import com.uokmit.fuelmate.repository.VehicleRepo;
import com.uokmit.fuelmate.response.ErrorResponse;
import com.uokmit.fuelmate.service.FuelTransactionService;
import com.uokmit.fuelmate.service.VerificationCodeService;
import com.uokmit.fuelmate.service.impl.UserIMPL;
import com.uokmit.fuelmate.dto.UserDTO;
import com.uokmit.fuelmate.response.SuccessResponse;
import com.uokmit.fuelmate.service.JwtService;
import com.uokmit.fuelmate.service.impl.VehicleIMPL;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import com.uokmit.fuelmate.Entity.User;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserIMPL userIMPL;

    @Autowired
    VehicleIMPL vehicleService;

    @Autowired
    FuelTransactionService fuelTransactionService;

    final VerificationCodeService verificationCodeService;

    private final JwtService jwtService;
    private final VehicleRepo vehicleRepo;

    public UserController(VerificationCodeService verificationCodeService, JwtService jwtService, VehicleRepo vehicleRepo) {
        this.verificationCodeService = verificationCodeService;
        this.jwtService = jwtService;
        this.vehicleRepo = vehicleRepo;
    }

    @PostMapping(path = "/save")
    public ResponseEntity<?> saveUser(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Define the expected field order
            List<String> fieldOrder = Arrays.asList("firstName", "lastName", "phone", "nic", "password");

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
            String token = userIMPL.addUser(userDTO);
            HashMap<String, Object> data = new HashMap<>();
            data.put("token", token);
            SuccessResponse successResponse = new SuccessResponse(
                    "User registration success",
                    true,
                    data
            );
            return ResponseEntity.ok(successResponse);
        } catch (IllegalArgumentException e) {  // Catch the specific exception
            ErrorResponse errorResponse = new ErrorResponse(400, e.getMessage());
            return ResponseEntity.status(400).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }

    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDTO) {
        System.out.println("login" + loginDTO);
        Optional<User> loggedUser = userIMPL.loginUser(loginDTO);
        if (loggedUser != null) {
            String token = jwtService.generateToken(loggedUser.get());
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", loggedUser.get());
            data.put("token", token);
            SuccessResponse successResponse = new SuccessResponse(
                    "Login Success",
                    true,
                    data
            );
            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(401, "Invalid Phone Number or Password");
            return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getAllUsers() {
        List<UserDTO> users = userIMPL.getAllUsers();
        if (!users.isEmpty()) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("allUsers", users);

            SuccessResponse successResponse = new SuccessResponse(
                    "Users retrieved successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "No Users Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','USER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userIMPL.getUserById(id);
        if (user != null) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", user);
            SuccessResponse successResponse = new SuccessResponse(
                    "User retrieved successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);

        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "User Not Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    @PostMapping("/change-phone")
    @PreAuthorize("hasAnyRole('USER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> changePhone(@RequestBody PhoneNumberDTO phoneNumberDTO) {
        try {
            User c = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userIMPL.updateUserPhoneNumber(c.getId(), phoneNumberDTO.getPhoneNumber());
            if (user != null) {
                HashMap<String, Object> data = new HashMap<>();
                data.put("user", user);
                verificationCodeService.sendVerificationCode();
                SuccessResponse successResponse = new SuccessResponse(
                        "Phone number updated successfully",
                        true,
                        data
                );

                return ResponseEntity.ok(successResponse);
            } else {
                ErrorResponse errorResponse = new ErrorResponse(404, "User Not Found");
                return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
            }
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(400, e.getMessage());
            return ResponseEntity.status(400).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    @GetMapping("/authenticate")
    @PreAuthorize("hasAnyRole('USER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> authenticateUser() {
        User tokenizedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userIMPL.getUserById(tokenizedUser.getId());
        if (user != null) {
             boolean haveAVehicle = vehicleRepo.existsByUser(user);
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("vehicleRegistration", haveAVehicle);

            SuccessResponse successResponse = new SuccessResponse(
                    "User authenticated successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "User Not Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    @GetMapping("/vehicle")
    @PreAuthorize("hasAnyRole('USER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> vehicle() {
        User tokenizedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userIMPL.getUserById(tokenizedUser.getId());
        if (user != null) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", user);
            Vehicle vehicle = null;
            try {
                vehicle = vehicleService.getByUser(user);
            } catch (Exception e) {
                System.out.println(e);
                ErrorResponse errorResponse = new ErrorResponse(404, "Vehicle Not Found");
                return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
            }
            Double usedQuota = fuelTransactionService.getFuelQuantity(vehicle.getId());
            data.put("vehicle", vehicle);
            data.put("defaultQuota", vehicle.getVehicleType().getDefaultQuota());
            data.put("usedQuota", usedQuota);
            data.put("availableQuota", vehicle.getVehicleType().getDefaultQuota() - usedQuota);
            SuccessResponse successResponse = new SuccessResponse(
                    "User authenticated successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "User Not Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }


    @GetMapping("/reset/qr")
    @PreAuthorize("hasAnyRole('USER')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> resetQr() {
        User tokenizedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userIMPL.getUserById(tokenizedUser.getId());
        if (user != null) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("user", user);
            Vehicle vehicle = null;
            try {
                vehicle = vehicleService.getByUser(user);
                vehicleService.resetQR(vehicle);
            } catch (Exception e) {
                System.out.println(e);
                ErrorResponse errorResponse = new ErrorResponse(404, "Vehicle Not Found");
                return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
            }
            Double usedQuota = fuelTransactionService.getFuelQuantity(vehicle.getId());
            data.put("vehicle", vehicle);
            data.put("defaultQuota", vehicle.getVehicleType().getDefaultQuota());
            data.put("usedQuota", usedQuota);
            data.put("availableQuota", vehicle.getVehicleType().getDefaultQuota() - usedQuota);
            SuccessResponse successResponse = new SuccessResponse(
                    "User authenticated successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);
        } else {
            ErrorResponse errorResponse = new ErrorResponse(404, "User Not Found");
            return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(errorResponse);
        }
    }

    //remove user
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> removeUser(@PathVariable Long id) {
        try {
            userIMPL.removeUser(id);
            List<UserDTO> allUsers = userIMPL.getAllUsers(); // Fetch updated user list
            HashMap<String, Object> data = new HashMap<>();
            data.put("allUsers", allUsers);
            SuccessResponse successResponse = new SuccessResponse(
                    "User deleted successfully",
                    true,
                    data
            );

            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), "This user cannot be deleted"));
        }
    }

}
