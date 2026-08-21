package com.chorepay.backend.chore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ParentChoreAssignmentResponse(

        UUID assignmentId,

        UUID templateId,

        String title,

        String description,

        UUID createdByUserId,

        String createdByName,

        Instant dueAt,

        ChoreAssignmentStatus status,

        Integer coinReward,

        Integer xpReward,

        Integer moneyRewardPence,

        List<AssignmentParticipantResponse> participants,

        Instant completedAt,

        Instant createdAt

) {
}