package com.chorepay.backend.chore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ParentChoreSubmissionResponse(

        UUID submissionId,

        UUID assignmentId,

        String choreTitle,

        UUID submittedByUserId,

        String submittedByName,

        Integer submissionNumber,

        String comment,

        String photoUrl,

        ChoreSubmissionStatus status,

        Instant submittedAt,

        String parentFeedback,

        Instant reviewedAt,

        List<SubmissionChecklistItemResponse> checklist

) {
}