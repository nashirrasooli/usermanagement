package com.example.userbackend.user;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class AppUserController {

    private final AppUserService service;

    public AppUserController(AppUserService service) {
        this.service = service;
    }

    /**
     * Examples:
     * GET /api/users?page=0&size=10&sort=createdAt,desc
     * GET /api/users?firstName=kab&page=0&size=5
     * GET /api/users?q=ali&sort=lastName,asc
     */
    @GetMapping
    public PageResponse<UserResponse> all(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false, name = "q") String q,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC, size = 10) Pageable pageable) {
        return service.search(firstName, lastName, q, pageable);
    }

    @GetMapping("{id}")
    public UserResponse one(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody UserRequest req) {
        return service.create(req);
    }

    @PutMapping("{id}")
    public UserResponse update(@PathVariable UUID id, @Valid @RequestBody UserRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
