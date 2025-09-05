package com.example.userbackend.dev;

import com.example.userbackend.user.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DevData {
    @Bean
    CommandLineRunner seed(AppUserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.count() == 0) {
                AppUser admin = new AppUser();
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail("admin@example.com");
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                admin.setPasswordHash(encoder.encode("admin123"));
                repo.save(admin);
            }
        };
    }
}
