package com.chorepay.backend.chore;

import jakarta.validation.constraints.Size;

public record SubmitChoreRequest(

        @Size(max = 1000)
        String comment,

        @Size(max = 500)
        String photoUrl

) {
}