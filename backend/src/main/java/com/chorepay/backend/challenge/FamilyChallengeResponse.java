package com.chorepay.backend.challenge;

import java.time.Instant;
import java.util.UUID;

public record FamilyChallengeResponse(
        UUID id,
        String title,
        String description,
        ChallengeType challengeType,
        Integer targetValue,
        Integer currentProgress,
        Integer bonusCoins,
        Instant startsAt,
        Instant endsAt,
        boolean active,
        Instant completedAt
) {
}