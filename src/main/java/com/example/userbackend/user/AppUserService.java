package com.example.userbackend.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public PageResponse<UserResponse> search(String firstName, String lastName, String q, Pageable pageable) {
        String f = firstName == null ? "" : firstName.trim();
        String l = lastName == null ? "" : lastName.trim();
        String qq = q == null ? "" : q.trim();

        Page<AppUser> page;
        if (!qq.isBlank()) {
            page = repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(qq, qq, pageable);
        } else if (!f.isBlank() && !l.isBlank()) {
            page = repo.findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(f, l, pageable);
        } else if (!f.isBlank()) {
            page = repo.findByFirstNameContainingIgnoreCase(f, pageable);
        } else if (!l.isBlank()) {
            page = repo.findByLastNameContainingIgnoreCase(l, pageable);
        } else {
            page = repo.findAll(pageable);
        }

        List<UserResponse> items = page.getContent().stream().map(this::toResponse).toList();
        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
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
        repo.delete(require(id));
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
