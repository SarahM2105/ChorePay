package com.chorepay.backend.chore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChoreAssignmentResponse(
        UUID id,
        UUID templateId,
        String title,
        Instant dueAt,
        ChoreAssignmentStatus status,
        Integer coinReward,
        Integer xpReward,
        Integer moneyRewardPence,
        List<UUID> childUserIds
) {
}