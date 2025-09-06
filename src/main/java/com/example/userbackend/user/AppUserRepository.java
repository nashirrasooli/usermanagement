package com.example.userbackend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);

    // Search helpers
    List<AppUser> findByFirstNameContainingIgnoreCase(String first);

    List<AppUser> findByLastNameContainingIgnoreCase(String last);

    List<AppUser> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String first, String last);

    List<AppUser> findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(String first, String last);
}
