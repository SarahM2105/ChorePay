package com.chorepay.backend.chore;

import java.util.UUID;

public record ChoreChecklistItemResponse(

        UUID id,
        String text,
        Integer displayOrder,
        boolean required

) {
}