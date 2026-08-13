package com.chorepay.backend.chore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChildChoreAssignmentResponse(

        UUID assignmentId,

        UUID templateId,

        String title,

        String description,

        Instant dueAt,

        ChoreAssignmentStatus status,

        ParticipationStatus participationStatus,

        Integer coinReward,

        Integer xpReward,

        Integer moneyRewardPence,

        List<ChoreChecklistItemResponse> checklist,

        ChoreSubmissionStatus latestSubmissionStatus,

        String parentFeedback,

        Instant completedAt

) {
}