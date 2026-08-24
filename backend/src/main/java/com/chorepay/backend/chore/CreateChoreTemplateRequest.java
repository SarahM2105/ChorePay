package com.chorepay.backend.chore;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateChoreTemplateRequest(

        @NotBlank
        @Size(max = 120)
        String title,

        String description,

        String category,

        @NotNull
        ChoreDifficulty difficulty,

        @NotNull
        @Min(1)
        Integer estimatedMinutes,

        @Min(0)
        Integer moneyRewardPence,

        @Min(0)
        @Max(100)
        Integer latePenaltyPercent,

        @Min(0)
        @Max(100)
        Integer resubmissionPenaltyPercent,

        boolean photoRequired,

        boolean commentRequired

) {
}