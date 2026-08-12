package com.chorepay.backend.reward;

import jakarta.validation.constraints.Size;

public record RejectRewardRedemptionRequest(

        @Size(max = 1000)
        String parentNote

) {
}