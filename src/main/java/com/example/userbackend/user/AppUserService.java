package com.example.userbackend.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AppUserService {

    private final AppUserRepository repo;

    public AppUserService(AppUserRepository repo) {
        this.repo = repo;
    }

    public List<UserResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse findById(UUID id) {
        return toResponse(require(id));
    }

    public UserResponse create(UserRequest req) {
        if (repo.existsByEmailIgnoreCase(req.email())) {
            throw new DuplicateEmailException("Email already in use: " + req.email());
        }
        AppUser u = new AppUser();
        apply(u, req);
        return toResponse(repo.save(u));
    }

    public UserResponse update(UUID id, UserRequest req) {
        AppUser u = require(id);
        if (repo.existsByEmailIgnoreCaseAndIdNot(req.email(), id)) {
            throw new DuplicateEmailException("Email already in use: " + req.email());
        }
        apply(u, req);
        return toResponse(repo.save(u));
    }

    public void delete(UUID id) {
        AppUser u = require(id);
        repo.delete(u);
    }

    // Helpers
    private AppUser require(UUID id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("User not found: " + id));
    }

    private void apply(AppUser u, UserRequest req) {
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setEmail(req.email());
        u.setRole(req.role() != null ? req.role() : Role.USER);
        u.setEnabled(req.enabled() != null ? req.enabled() : true);
    }

    private UserResponse toResponse(AppUser u) {
        return new UserResponse(
                u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),
                u.getRole(), u.isEnabled(), u.getCreatedAt(), u.getUpdatedAt());
    }
}
