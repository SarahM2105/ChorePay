package com.chorepay.backend.chore;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChecklistItemRequest(

        @NotBlank
        @Size(max = 255)
        String text,

        boolean required

) {
}