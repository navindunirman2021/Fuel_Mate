package com.uokmit.fuelmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import com.uokmit.fuelmate.Entity.User;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);

    Optional<User> findOneByPhoneAndPassword(String phone, String password);

    Optional<Object> findByNic(String nic);
}
