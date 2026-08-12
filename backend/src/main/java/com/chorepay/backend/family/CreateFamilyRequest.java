package com.chorepay.backend.family;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFamilyRequest(

        @NotBlank
        @Size(max = 100)
        String name

) {
}