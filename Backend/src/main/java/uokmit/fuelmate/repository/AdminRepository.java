package com.uokmit.fuelmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uokmit.fuelmate.Entity.Admin;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByNic(String nic);

    @Query("SELECT a FROM Admin a WHERE a.role = 'STATION_MANAGER' " +
            "AND a.id NOT IN (SELECT f.ownerId FROM FuelStation f)")
    List<Admin> findUnassignedStationManagers();

}
