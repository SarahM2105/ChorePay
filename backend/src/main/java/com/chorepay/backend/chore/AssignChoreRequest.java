package com.chorepay.backend.chore;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AssignChoreRequest(

        @NotNull
        UUID templateId,

        @NotEmpty
        List<UUID> childUserIds,

        Instant dueAt

) {
}