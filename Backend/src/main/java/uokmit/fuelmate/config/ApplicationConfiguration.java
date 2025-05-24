package com.uokmit.fuelmate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.uokmit.fuelmate.repository.UserRepo;

@Configuration
public class ApplicationConfiguration {
    private final UserRepo userRepository;

    public ApplicationConfiguration(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    UserDetailsService userDetailsService() {
        return username -> userRepository.findByPhone(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type", "Origin", "Accept", "X-Requested-With", "Access-Control-Allow-Origin")
                        .exposedHeaders("Authorization", "Access-Control-Allow-Origin")
                        .allowCredentials(true);
            }
        };
    }

}


//}"http://localhost:5173", "http://192.168.1.43:8080",
//        "https://fuel-master.vercel.app", "http://10.0.2.2:8080",
//        "http://10.0.2.2", "capacitor://localhost", "ionic://localhost",
//        "http://localhost", "http://192.168.56.1:8080"