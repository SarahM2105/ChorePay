package com.chorepay.backend.notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(

        UUID id,
        NotificationType notificationType,
        String title,
        String message,
        UUID referenceId,
        boolean read,
        Instant createdAt

) {
}