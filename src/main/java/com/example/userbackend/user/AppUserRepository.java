package com.example.userbackend.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);

    // --- Paged search variants ---
    Page<AppUser> findByFirstNameContainingIgnoreCase(String first, Pageable pageable);

    Page<AppUser> findByLastNameContainingIgnoreCase(String last, Pageable pageable);

    Page<AppUser> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String first, String last,
            Pageable pageable);

    Page<AppUser> findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(String first, String last,
            Pageable pageable);
}
