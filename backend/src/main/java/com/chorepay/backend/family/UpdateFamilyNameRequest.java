package com.chorepay.backend.family;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateFamilyNameRequest(
        @NotBlank
        @Size(max = 100)
        String name
) {
}