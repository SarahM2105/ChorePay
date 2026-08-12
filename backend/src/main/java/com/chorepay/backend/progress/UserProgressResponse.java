package com.chorepay.backend.progress;

import java.time.LocalDate;
import java.util.UUID;

public record UserProgressResponse(
        UUID childUserId,
        Integer coinBalance,
        Integer totalXp,
        Integer currentLevel,
        Integer currentStreak,
        Integer longestStreak,
        LocalDate lastCompletedChoreDate,
        Integer completedChoreCount
) {
}