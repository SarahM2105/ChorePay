package com.chorepay.backend.challenge;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateFamilyChallengeRequest(

        @NotBlank
        @Size(max = 120)
        String title,

        @Size(max = 1000)
        String description,

        @NotNull
        ChallengeType challengeType,

        @NotNull
        @Min(1)
        Integer targetValue,

        @Min(0)
        Integer bonusCoins,

        Instant startsAt,

        @NotNull
        Instant endsAt
) {
}