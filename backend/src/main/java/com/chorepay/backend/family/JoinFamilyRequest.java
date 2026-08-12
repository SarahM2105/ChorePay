package com.chorepay.backend.family;

import jakarta.validation.constraints.NotBlank;

public record JoinFamilyRequest(

        @NotBlank
        String joinCode

) {
}