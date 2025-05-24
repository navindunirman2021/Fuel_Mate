package com.uokmit.fuelmate.service;

import com.uokmit.fuelmate.dto.AdminDTO;
import com.uokmit.fuelmate.dto.AdminLoginDTO;
import com.uokmit.fuelmate.dto.Response.AdminViewDTO;
import com.uokmit.fuelmate.Entity.Admin;
import com.uokmit.fuelmate.repository.AdminRepository;

import com.uokmit.fuelmate.util.PasswordUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.uokmit.fuelmate.util.PasswordUtil.hashPassword;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;


    // Method to add an admin
    @Transactional
    public String addAdmin(AdminDTO adminDTO) {

        if(adminRepository.findByNic(adminDTO.getNic()).isPresent()){
            throw new IllegalArgumentException("NIC already registered: " +adminDTO.getNic());
        }
        if (adminRepository.findByEmail(adminDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email address already registered: " + adminDTO.getEmail());
        }
        Admin admin = new Admin();
        admin.setName(adminDTO.getName());
        admin.setEmail(adminDTO.getEmail());
        admin.setNic(adminDTO.getNic());
        admin.setRole(adminDTO.getRole());
        admin.setPassword(hashPassword(adminDTO.getPassword()));

        // Save the admin object to the database
        adminRepository.save(admin);
        return admin.getName();
    }


    public List<AdminViewDTO> getAllAdmins() {
        List<Admin> admins = adminRepository.findAll();
        return admins.stream().map(admin -> new AdminViewDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getNic()
        )).toList();
    }
    public List<AdminViewDTO> getUnassignedStationManagers() {
        List<Admin> admins = adminRepository.findUnassignedStationManagers();
        return admins.stream().map(admin -> new AdminViewDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getNic()
        )).toList();
    }


    public Optional<Admin> loginAdmin(AdminLoginDTO loginDTO) {
        Optional<Admin> user = adminRepository.findByEmail(loginDTO.getEmail());
        if (user.isPresent()) {
            String inputPassword = loginDTO.getPassword();
            String storedPassword = user.get().getPassword();
            if (PasswordUtil.verifyPassword(inputPassword, storedPassword)) {
                return user;
            }

        }
        return Optional.empty();
    }

    public Optional<Admin> getAdmin(String id) {
        Optional<Admin> adminOptional = adminRepository.findById(Long.parseLong(id));
        return adminOptional;
    }
}
