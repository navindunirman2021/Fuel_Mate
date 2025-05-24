package com.uokmit.fuelmate.repository;
import com.uokmit.fuelmate.Entity.User;
import com.uokmit.fuelmate.Entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    VerificationCode findByCodeAndUser(String code, User obj);
    VerificationCode findByCode(String code);
    VerificationCode findByUser( User obj);
}
