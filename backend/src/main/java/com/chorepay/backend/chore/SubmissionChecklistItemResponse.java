package com.chorepay.backend.chore;

import java.util.UUID;

public record SubmissionChecklistItemResponse(

        UUID checklistItemId,
        String text,
        boolean required,
        boolean completed

) {
}