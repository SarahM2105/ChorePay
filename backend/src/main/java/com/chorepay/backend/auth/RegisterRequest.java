package com.chorepay.backend.auth;

import com.chorepay.backend.user.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 8, max = 100)
        String password,

        @NotNull
        UserType userType

) {
}