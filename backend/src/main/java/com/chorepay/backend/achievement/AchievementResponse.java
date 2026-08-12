package com.chorepay.backend.achievement;

import java.time.Instant;
import java.util.UUID;

public record AchievementResponse(
        UUID achievementId,
        String code,
        String name,
        String description,
        AchievementType achievementType,
        Integer thresholdValue,
        String iconKey,
        boolean unlocked,
        Instant unlockedAt
) {
}