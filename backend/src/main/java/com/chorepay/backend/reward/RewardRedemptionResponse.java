package com.chorepay.backend.reward;

import java.time.Instant;
import java.util.UUID;

public record RewardRedemptionResponse(
        UUID id,
        UUID rewardId,
        String rewardName,
        Integer coinCost,
        RewardRedemptionStatus status,
        Instant requestedAt,
        String parentNote,
        Instant reviewedAt,
        Instant fulfilledAt
) {
}