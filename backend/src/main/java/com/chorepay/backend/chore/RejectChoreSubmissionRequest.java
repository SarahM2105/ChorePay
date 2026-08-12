package com.chorepay.backend.chore;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectChoreSubmissionRequest(

        @NotBlank
        @Size(max = 1000)
        String feedback

) {
}