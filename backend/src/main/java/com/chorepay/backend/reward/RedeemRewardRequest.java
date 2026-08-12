package com.chorepay.backend.reward;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RedeemRewardRequest(

        @NotNull
        UUID rewardId

) {
}