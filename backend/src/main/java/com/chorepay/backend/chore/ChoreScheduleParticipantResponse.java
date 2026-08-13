package com.chorepay.backend.chore;

import java.util.UUID;

public record ChoreScheduleParticipantResponse(
        UUID childUserId,
        String childName
) {
}