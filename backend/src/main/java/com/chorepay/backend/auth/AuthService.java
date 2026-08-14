package com.chorepay.backend.auth;

import com.chorepay.backend.security.JwtService;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

public User register(RegisterRequest request) {

    String normalizedEmail =
            request.email().toLowerCase();

    if (userRepository.existsByEmail(normalizedEmail)) {
        throw new IllegalArgumentException(
                "An account with this email already exists."
        );
    }

    User user = new User();

    user.setName(request.name());
    user.setEmail(normalizedEmail);

    user.setPasswordHash(
            passwordEncoder.encode(
                    request.password()
            )
    );

    user.setUserType(
            request.userType()
    );

    return userRepository.save(user);
}
    public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(
            request.email().toLowerCase()
    ).orElseThrow(() ->
            new IllegalArgumentException("Invalid email or password.")
    );

    if (!passwordEncoder.matches(
            request.password(),
            user.getPasswordHash()
    )) {
        throw new IllegalArgumentException(
                "Invalid email or password."
        );
    }

    String token = jwtService.generateToken(user);

    return new LoginResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getUserType(),
            token
    );
}
}