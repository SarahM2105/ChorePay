package com.chorepay.backend.auth;

import com.chorepay.backend.user.UserType;

import java.util.UUID;

public record RegisterResponse(
        UUID id,
        String name,
        String email,
        UserType userType
) {
}