package com.chorepay.backend.chore;

import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record SubmitChoreRequest(

        @Size(max = 1000)
        String comment,

        @Size(max = 500)
        String photoUrl,

        List<UUID> completedChecklistItemIds

) {
}