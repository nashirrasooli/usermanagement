package com.example.userbackend.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_user", uniqueConstraints = @UniqueConstraint(name = "uk_app_user_email", columnNames = "email"))
@Getter
@Setter
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(nullable = false, length = 80)
    private String firstName;

    @NotBlank
    @Column(nullable = false, length = 80)
    private String lastName;

    @Email
    @NotBlank
    @Column(nullable = false, length = 160)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Role role = Role.USER;

    @Column(nullable = false)
    private boolean enabled = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
    // ...
    @Column(nullable = false)
    private String passwordHash;

}
