package com.chorepay.backend.chore;

import java.util.UUID;

public record AssignmentParticipantResponse(
        UUID childUserId,
        String childName,
        ParticipationStatus participationStatus
) {
}