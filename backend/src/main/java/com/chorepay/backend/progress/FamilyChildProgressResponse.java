package com.chorepay.backend.progress;

import java.util.UUID;

public record FamilyChildProgressResponse(
        UUID childUserId,
        String name,
        Integer coinBalance,
        Integer totalXp,
        Integer currentLevel,
        Integer currentStreak,
        Integer longestStreak,
        Integer completedChoreCount
) {
}