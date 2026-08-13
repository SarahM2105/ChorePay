package com.chorepay.backend.chore;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChoreSubmissionResponse(

        UUID id,

        UUID assignmentId,

        Integer submissionNumber,

        String comment,

        String photoUrl,

        ChoreSubmissionStatus status,

        Instant submittedAt,

        String parentFeedback,

        List<SubmissionChecklistItemResponse> checklist

) {
}