package com.chorepay.backend.security;

import com.chorepay.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "chorepay-development-secret-key-change-before-production-123456";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    public String generateToken(User user) {

        long expirationTime = 1000L * 60 * 60 * 24;

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("userType", user.getUserType().name())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + expirationTime
                        )
                )
                .signWith(key)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}