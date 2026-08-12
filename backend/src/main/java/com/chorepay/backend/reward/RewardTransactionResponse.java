package com.chorepay.backend.reward;

import java.time.Instant;
import java.util.UUID;

public record RewardTransactionResponse(
        UUID id,
        RewardTransactionType transactionType,
        Integer amount,
        String description,
        Instant createdAt
) {
}