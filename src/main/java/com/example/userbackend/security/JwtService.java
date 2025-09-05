package com.example.userbackend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final Key key;
    private final long ttlSeconds;

    // public JwtService(
    // @Value("${security.jwt.secret:dev-secret-please-change}") String secret,
    // @Value("${security.jwt.ttl-seconds:3600}") long ttlSeconds) {
    // this.key = Keys.hmacShaKeyFor(secret.getBytes());
    // this.ttlSeconds = ttlSeconds;
    // }

    public JwtService(
            @Value("${security.jwt.secret:}") String secret,
            @Value("${security.jwt.ttl-seconds:3600}") long ttlSeconds) {

        if (secret.isBlank()) {
            throw new IllegalStateException(
                    "Missing property security.jwt.secret. Define it in application.yml or pass -Dsecurity.jwt.secret");
        }

        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret); // Base64 path
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("security.jwt.secret must be Base64 for this configuration.", ex);
        }

        if (keyBytes.length < 32) {
            throw new IllegalStateException("security.jwt.secret (after Base64 decode) must be >= 32 bytes.");
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.ttlSeconds = ttlSeconds;
    }

    public String generate(String subject, Map<String, Object> claims) {
        var now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(ttlSeconds)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}
