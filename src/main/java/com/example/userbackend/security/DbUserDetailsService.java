package com.example.userbackend.security;

import com.example.userbackend.user.AppUser;
import com.example.userbackend.user.AppUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DbUserDetailsService implements UserDetailsService {
    private final AppUserRepository repo;

    public DbUserDetailsService(AppUserRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser u = repo.findAll().stream()
                .filter(x -> x.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("No user: " + email));

        var auth = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());
        // return User.withUsername(u.getEmail())
        // .password(u.getPasswordHash())
        // .authorities(List.of(auth))
        // .disabled(!u.isEnabled())
        // .build();
        return User.withUsername(u.getEmail())
                .password(u.getPasswordHash()) // <-- must be passwordHash field
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name())))
                .disabled(!u.isEnabled())
                .build();

    }
}
