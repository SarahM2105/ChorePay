package com.chorepay.backend.reward;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateRewardRequest(

        @NotBlank
        @Size(max = 120)
        String name,

        @Size(max = 1000)
        String description,

        @Size(max = 80)
        String category,

        @NotNull
        @Min(0)
        Integer coinCost,

        boolean unlimitedStock,

        @Min(0)
        Integer stockQuantity,

        @Min(1)
        Integer minimumLevel,

        Instant availableFrom,

        Instant availableUntil,

        @NotNull
        RewardFulfillmentType fulfillmentType
) {
}