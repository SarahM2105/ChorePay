package com.chorepay.backend.chore;

import java.util.UUID;

public record ChoreTemplateResponse(
        UUID id,
        String title,
        String description,
        String category,
        ChoreDifficulty difficulty,
        Integer estimatedMinutes,
        Integer coinReward,
        Integer xpReward,
        Integer moneyRewardPence,
        Integer latePenaltyPercent,
        Integer resubmissionPenaltyPercent,
        boolean photoRequired,
        boolean commentRequired,
        boolean active
) {
}